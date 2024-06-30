import re

from flask import Flask, request, flash, jsonify
from langchain_core.prompts import PromptTemplate

from openai import OpenAI
from openai.types.chat import ChatCompletion
from pymongo.mongo_client import MongoClient
import pymongo
from __init__ import envs
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os
load_dotenv()
import logging
import pyaudio
import wave

from langchain_openai import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryBufferMemory, ConversationBufferMemory
import speech_recognition as sr

# Import the logger from the main module
logger = logging.getLogger(__name__)

app = Flask(__name__)
load_dotenv()
openaiKey = os.getenv("OPENAI_API_KEY")

chat = ChatOpenAI(openai_api_key=openaiKey, model_name="gpt-3.5-turbo")

# Create OpenAI client for calling ChatCompletion API
openai_client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

prompt_file_provide_feedback = open("system_instructions/language_expert.txt", "r").read()
prompt_file_provide_number_of_errors = open("system_instructions/num_errors.txt", "r").read()

conversation = ConversationChain(
    llm=chat,
    verbose=False
    # prompt=prompt_template
)
def connect():
    global db, mongodb_client
    """
    code for connecting to the cluster
    """
    uri = envs['uri']

    # Create a new client and connect to the server
    mongodb_client = MongoClient(uri)
    # Send a ping to confirm a successful connection
    try:
        mongodb_client.admin.command('ping')
    except Exception as e:
        print(e)
    db = mongodb_client
    return db


def addUser(entry:dict):
    db = connect().Main.users
    userid = entry['user_id']
    created = entry['created']
    role = entry['role']
    insert = db.insert_one(
        {
            'user_id': userid,
            'created': created,
            'role': role
        }
    )
    return insert.inserted_id

# @app.route('/', methods=['GET'])
# def printHello():
#     return "Hello"
@app.route('/api/get_details', methods=['GET', 'POST'])
def getDetails():
    req = request.get_json()
    id_ = req['id']
    result = db.find({ "_id": ObjectId(id_) })
    result = result[0]
    result['_id'] = str(result['_id'])
    return result


@app.route('/api/get_role', methods=['GET', 'POST'])
def getRole():
    db = connect().Main.users
    req = request.get_json()
    uid = req['uid']
    result = db.find({ "user_id": uid })[0]
    return {
        'role': result['role']
    }


@app.route('/api/getLang', methods=['GET', 'POST'])
def getLang():
    db = connect().Chat.session
    req = request.get_json()
    chatid = req['chatid']
    obj = ObjectId(chatid)
    result = db.find({ "_id": obj })
    result = result[0]
    return {
        'lang': result['language']
    }


def getClasses(uid):
    result = db.find({ "user_id": uid })
    resultIds = [i._id for i in result]
    resultNames = [i['name'] for i in result]
    return resultIds, resultNames


@app.route('/api/getClasses', methods=['GET', 'POST'])
def userGetClasses():
    db = connect().user2class
    req = request.get_json()
    uid = req['uid']
    resultIds, resultNames = getClasses(uid)
    return {'classIds': resultIds, 'classNames': resultNames}

@app.route('/api/getChatIds', methods=['GET', 'POST'])
def getChatIds():
    db = connect().Chat.session
    req = request.get_json()
    chatid = req['chatid']
    obj = ObjectId(chatid)
    result = db.find({ "_id": obj })
    result = result[0]
    return {'result': result}


@app.route('/api/openChat', methods=['GET', 'POST'])
def openChat():
    print("Inside openachat")
    db = connect().Chat.session
    req = request.get_json()
    chatid = req['chatid']
    obj = ObjectId(chatid)
    result = db.find({ "_id": obj })
    result = result[0]
    print(f"result = {result}")
    assignmentid = result['assignment_id']
    userid = result['user_id']

    history = updateMemory(assignmentid, userid)
    history = [{'role': 'Human' if (idx+1) % 2 else 'AI', 'content': i.split(": ")[1]} for idx, i in enumerate(history)]
    # human, AI, human, AI pattern
    return {'chatHistory': history}


def updateMemory(assignmentid, userid):
    #updates global conversation memory
    global conversation
    #{"$and":[{"name": "name"}, {"date": "date"}]}
    db = connect().Chat.session
    result = db.find({ "$and": [{"assignment_id": assignmentid}, {"user_id": userid}] }).sort('created',pymongo.ASCENDING) #oldest first
    result = result[0]["chat"]
    result = result.split("\n")
    memory = ConversationSummaryBufferMemory(
        llm=chat, max_token_limit=4096
    )
    conversation.memory = memory
    for i in range(0, len(result), 2):
        inp = result[i].split(": ")[1]
        out = result[i+1].split(": ")[1]
        conversation.memory.save_context({"input": inp}, {"output": out})

    return result

@app.route('/api/assign', methods=['GET', 'POST'])
def assign():
    db = connect().Main.assignments
    req = request.get_json()
    target = req['target'] #either 'everyone' or 'student'
    assignment_name = req['assignment_name']

    #insert = db.insert_one(
    #    {
    #        'user_id': uid,
    #        'class_id': cid
    #    }
    #)
    #return insert.inserted_id

@app.route('/api/getResponse', methods=['GET', 'POST'])
def getResponse():
    # Talks to chatgpt and gets a response
    req = request.get_json()
    text = req['text']
    result = conversation.predict(input=text)
    return {'response': result}


@app.route('/api/getAssignments', methods=['GET', 'POST'])
def getAssignments():
    db = connect().Main.assignments
    req = request.get_json()
    uid = req['uid']
    #returns pymongo cursor
    result = db.find({ "user_id": uid }).sort('created',pymongo.DESCENDING)
    result = [i for i in result]
    format = r'%Y-%m-%d'
    for i in result:
        i['_id'] = str(i['_id'])
        i['created'] = i['created'].strftime(format)
        i['due_date'] = i['due_date'].strftime(format)


    return {'result': result}

@app.route('/api/getAssignmentDetail', methods=['GET', 'POST'])
def getAssignmentDetail():
    db = connect().Main.assignments
    db2 = connect().Chat.session
    req = request.get_json()
    chatid = req['chatid']
    obj = ObjectId(chatid)
    format = r'%Y-%m-%d'
    result = db2.find({ "_id": obj })
    result = result[0]
    result2 = db.find({"chat_id": chatid})
    result2 = result2[0]
    result['_id'] = str(result['_id'])
    result['created'] = result['created'].strftime(format)
    result2['_id'] = str(result2['_id'])
    result2['created'] = result2['created'].strftime(format)
    result2['due_date'] = result2['due_date'].strftime(format)
    return {'assignment': result2, 'chat': result}

@app.route('/api/updateChat', methods=['GET', 'POST'])
def updateChat():
    db = connect().Chat.session
    req = request.get_json()
    chatid = req['chatid']
    obj = ObjectId(chatid)
    result = db.find({ "_id": obj })
    result = result[0]


def transcribe(filename):
    """
    Converts voice to text using speech_recognition module
    """
    # data = request.get_json()
    # filename = data.get('filename')

    if not filename:
        return jsonify({"error": "Filename not provided"}), 400

    recognizer = sr.Recognizer()
    file_path = os.path.join('recordings', filename)

    try:
        with sr.AudioFile(filename) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_whisper(audio) # You can try other recognizers as well, besides whisper
            return jsonify({"transcription": text})
    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand audio"}), 400
    except sr.RequestError:
        return jsonify({"error": "Could not request results"}), 400
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 400


@app.route('/api/immediatefeedback', methods=['POST', 'GET'])
def langchain_feedback():
    """
    This endpoint provides immediate feedback by calling a language model (LLM)
    and saving the conversation history to a database.

    Request JSON format:
    {
        "text": "Your input text here"
    }

    Returns:
        Response: JSON response containing the AI feedback.

    TODO:
        1. Add system prompt for immediate feedbacks.
        2. Provide a general or summarized version of feedback
        3. Remove hardcoded studentId in `obj` variable
    """
    try:
        data = request.get_json()
        text = data.get('text')

        print(f"text = {text}")

        if not text:
            return jsonify({"error": "Text or student ID not provided"}), 400

        # Fetch feedback data from db
        db = connect().Chat.feedback
        obj = ObjectId("667bf7c96d8037b647330752")
        feedback_data = db.find_one({ "_id": obj })
        print(f"feedback_data = {feedback_data}")

        # Initialize LangChain memory
        memory = ConversationBufferMemory(
            llm=chat,  # Initialize the LLM with the required parameters
            max_token_limit=4096
        )

        # Check if message_history is empty
        if not feedback_data.get("message_history"):
            # Append user's data to db, get llm response, append ai's chat in db
            message_history = f"Human: {text}\n"

            ai_response = conversation.predict(input=text)
            message_history += f"AI: {ai_response}\n"

            # Save the updated message history to the database
            if not feedback_data:
                db.insert_one({"_id": obj, "student_id": "rfVmiajVyhRQu7F9apY0U2C30o22", "message_history": message_history})
            else:
                db.update_one(
                    {"_id": obj},
                    {"$set": {"student_id": "rfVmiajVyhRQu7F9apY0U2C30o22", "message_history": message_history}}
                )
        else:
            # Get message history, add user's latest message, call llm, save llm's feedback in feedback chat in db
            message_history = feedback_data["message_history"]
            message_history += f"\nHuman: {text}\n"

            print(f"message_history = {message_history}")

            conversation.memory = memory
            # Load existing conversation into memory
            for line in message_history.split('\n'):
                print(f"line = {line}")
                if line.startswith("Human: "):
                    user_input = line[len("Human: "):]
                    conversation.memory.save_context({"input": user_input}, {"output": ""})
                elif line.startswith("AI: "):
                    ai_output = line[len("AI: "):]
                    print(f"ai_output = {ai_output}")
                    conversation.memory.save_context({"input": ""}, {"output": ai_output})

            # Get AI's response for the latest user input
            ai_response = conversation.predict(input=text)
            message_history += f"AI: {ai_response}\n"

            # Save the updated message history to the database
            db.update_one(
                {"_id": obj},
                {"$set": {"message_history": message_history}}
            )

        return jsonify({"feedback": ai_response})
    except Exception as e:
        logger.error(f"Error in langchain_feedback: {str(e)}")
        return jsonify({"error": "An error occurred"}), 500


@app.route('/api/update_chat_history', methods=['POST'])
def update_chat_history():
    req = request.get_json()
    text_human = req.get('text')
    feedback_ai = req.get('feedback')

    db = connect().Chat.session
    chatid = req['chatid']
    obj = ObjectId(chatid)
    result = db.find({"_id": obj})

    result = result[0]

    message_history = result["chat"]
    message_history += f"\nHuman: {text_human}\n"

    message_history += f"AI: {feedback_ai}\n"
    db.update_one(
        {"_id": obj},
        {"$set": {"message_history": message_history}}
    )


@app.route('/api/immediate_feedback', methods=['GET'])
def feedback():
    """
    Calls OpenAI LLM to Get Feedback. The system instructions for the LLM is provided in system_instructions directory.
    """
    # data = request.get_json()
    text = "The newspaper said their is going to be heavy rain tomorrow, so don't forget your umbrella"

    response_feedback: ChatCompletion = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": f"{prompt_file_provide_feedback}"},
            {"role": "user", "content": f"{text}"}
        ],
        max_tokens=150,
        temperature=0.1,
    )
    feedback_text = response_feedback.choices[0].message
    feedback_text_final = f"ORIGINAL PHRASE: {text}\n" + f"{feedback_text.content}"

    response_quantify_mistakes: ChatCompletion = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": f"{prompt_file_provide_number_of_errors}"},
            {"role": "user", "content": f"{feedback_text_final}"}
        ],
        max_tokens=150,
        temperature=0.1,
    )

    num_errors_text = response_quantify_mistakes.choices[0].message

    # Regular expression to extract values
    grammar_errors = re.search(r'number_of_grammar_errors: (\d+)', num_errors_text.content).group(1)
    tone_errors = re.search(r'number_of_tone_errors: (\d+)', num_errors_text.content).group(1)
    vocabulary_errors = re.search(r'number_of_vocabulary_errors: (\d+)', num_errors_text.content).group(1)

    # Convert extracted values to integers
    number_of_grammar_errors = int(grammar_errors)
    number_of_tone_errors = int(tone_errors)
    number_of_vocabulary_errors = int(vocabulary_errors)

    return jsonify({"feedback": feedback_text_final,
                    "number_of_grammar_errors": number_of_grammar_errors,
                    "number_of_tone_errors": number_of_tone_errors,
                    "number_of_vocabulary_errors": number_of_vocabulary_errors})


@app.route('/api/record_voice', methods=['POST'])
def record_voice():
    """
    Records audio from the microphone and saves it as a WAV file.

    This endpoint accepts POST requests with JSON data containing the output
    filename and the duration of the recording in seconds. It records audio
    using the microphone, saves it to the specified file, and returns the
    transcription of the audio.

    Request JSON format:
    {
        "output_filename": "output.wav",
        "record_seconds": 4
    }

    Returns:
        Response: JSON response containing the transcription of the recorded audio.
    """
    data = request.get_json()
    output_filename = data.get('output_filename', 'output.wav')
    record_seconds = data.get('record_seconds', 4)

    chunk = 1024  # Record in chunks of 1024 samples
    sample_format = pyaudio.paInt16  # 16 bits per sample
    channels = 1  # Mono
    fs = 44100  # Record at 44100 samples per second

    p = pyaudio.PyAudio()  # Create an interface to PortAudio

    print('Recording...')

    stream = p.open(format=sample_format,
                    channels=channels,
                    rate=fs,
                    frames_per_buffer=chunk,
                    input=True)

    frames = []  # Initialize array to store frames

    # Store data in chunks for the specified duration
    for _ in range(0, int(fs / chunk * record_seconds)):
        data = stream.read(chunk)
        frames.append(data)

    # Stop and close the stream
    stream.stop_stream()
    stream.close()
    # Terminate the PortAudio interface
    p.terminate()

    print('Finished recording.')

    # Save the recorded data as a WAV file
    with wave.open(output_filename, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(p.get_sample_size(sample_format))
        wf.setframerate(fs)
        wf.writeframes(b''.join(frames))

    # Returns text form of the speech
    transcription = transcribe(output_filename)
    return transcription
    # transcription = transcribe(output_filename)
    # return jsonify({"transcription": transcription})
"""
Saves the recorded audio from record_voice.py to api/recordings/ directory.
TODO: Use this api to record voice, instead of record_voice.py
"""
@app.route('/record', methods=['POST'])
def record():
    print("Inside record api call")
    # Simulate recording by saving the uploaded file
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file.save(os.path.join('recordings', file.filename))
    return jsonify({"message": "File saved successfully"}), 200


@app.route('/api/getAssignmentFeedback', methods=['GET', 'POST'])
def getAssignmentFeedback():
    db = connect().Chat.session
    req = request.get_json()
    chatid = req['chatid']
    obj = ObjectId(chatid)
    find = db.find({ "_id": obj })
    find = find[0]
    chat = find["chat"]
    prompt = """
    You are a language expert. 
    You will be given a conversation between human and an AI. 
    Your task is to provide insightful feedback ONLY for the human messages.
    The feedback MUST consist of grammatical feedback, vocabulary feedback and tone feedback and must be addressed to the human.

    Your response should be in a json format of {'grammatical': (grammatical feedback), 'vocabulary': (vocabulary feedback), 'tone': (tone feedback)}.
    Put a newline in between every point in each feedback to separate them.
    """
    response: ChatCompletion = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": f"Chat Logs:\n{chat}"}
        ],
        max_tokens=1000
    )
    feedback = response.choices[0].message.content
    print('feedback:', feedback)
    feedback = eval(feedback)

    return {'feedback': feedback}


if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')

