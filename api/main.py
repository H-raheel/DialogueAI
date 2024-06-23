from flask import Flask, request, flash, jsonify

from openai import OpenAI
from openai.types.chat import ChatCompletion
from pymongo.mongo_client import MongoClient
import pymongo
from __init__ import envs
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os

from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryBufferMemory
import speech_recognition as sr
from langchain.callbacks import get_openai_callback

app = Flask(__name__)
load_dotenv()
openaiKey = os.getenv("OPENAI_API_KEY")

chat = ChatOpenAI(openai_api_key=openaiKey, model_name="gpt-3.5-turbo")

# Create OpenAI client for calling ChatCompletion API
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

conversation = ConversationChain(
    llm=chat,
    verbose=False,
)

prompt_file = open("system_instructions/language_expert.txt", "r").read()

def connect():
    global db, client
    """
    code for connecting to the cluster
    """
    uri = envs['uri']

    # Create a new client and connect to the server
    client = MongoClient(uri)
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
    except Exception as e:
        print(e)
    db = client
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
    db = connect().Chat.session
    req = request.get_json()
    chatid = req['chatid']
    obj = ObjectId(chatid)
    result = db.find({ "_id": obj })
    result = result[0]
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


"""
Converts voice to text using speech_recognition module
"""
@app.route('/transcribe', methods=['POST'])
def transcribe():
    data = request.get_json()
    filename = data.get('filename')

    print(f"data = {data}")
    if not filename:
        return jsonify({"error": "Filename not provided"}), 400

    recognizer = sr.Recognizer()
    file_path = os.path.join('recordings', filename)

    try:
        with sr.AudioFile(file_path) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_whisper(audio) # You can try other recognizers as well, besides whisper
            return jsonify({"transcription": text})
    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand audio"}), 400
    except sr.RequestError:
        return jsonify({"error": "Could not request results"}), 400
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 400


"""
Calls OpenAI LLM to Get Feedback. The system instructions for the LLM is provided in system_instructions directory.
"""
@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.get_json()
    text = data.get('text')

    print(f"text = {text}")

    if not text:
        return jsonify({"error": "Text not provided"}), 400

    # OpenAI API call for grammar and vocabulary feedback

    response: ChatCompletion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": f"{prompt_file}"},
            {"role": "user", "content": f"{text}"}
        ],
        max_tokens=150
    )

    feedback_text = response.choices[0].message
    print(f"feedback_text = {feedback_text}")
    return jsonify({"feedback": feedback_text.content})


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


if __name__ == '__main__':
    app.run(debug=True, port=8888, host='0.0.0.0')

