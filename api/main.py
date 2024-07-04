import datetime
import json
import random
import re
import string
from collections import defaultdict

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

from langchain_core.messages import HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

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


def addUser(entry: dict):
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
    result = db.find({"_id": ObjectId(id_)})
    result = result[0]
    result['_id'] = str(result['_id'])
    return result


@app.route('/api/get_role', methods=['GET', 'POST'])
def getRole():
    db = connect().Main.users
    req = request.get_json()
    uid = req['uid']
    result = db.find({"user_id": uid})[0]
    return {
        'role': result['role'],
        'name': result['name']
    }


@app.route('/api/getLang', methods=['GET', 'POST'])
def getLang():
    db = connect().Chat.session
    req = request.get_json()
    chatid = req['chatid']
    obj = ObjectId(chatid)
    result = db.find({"_id": obj})
    result = result[0]
    return {
        'lang': result['language']
    }


def getClasses(uid):
    result = db.find({"user_id": uid})
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
    result = db.find({"_id": obj})
    result = result[0]
    return {'result': result}


@app.route('/api/openChat', methods=['GET', 'POST'])
def openChat():
    print("Inside openachat")
    db = connect().Chat.session
    req = request.get_json()
    chatid = req['chatid']
    obj = ObjectId(chatid)
    result = db.find({"_id": obj})
    result = result[0]
    print(f"result = {result}")
    assignmentid = result['assignment_id']
    userid = result['user_id']

    chat_history, feedback_history = update_memory(assignmentid, userid)
    chat_history = [{'role': 'Human' if (idx + 1) % 2 else 'AI', 'content': i.split(": ")[1]} for idx, i in
                    enumerate(chat_history)]
    feedback_history = [{'role': 'Human' if (idx + 1) % 2 else 'AI', 'content': i.split(":x ")[1]} for idx, i in
                        enumerate(feedback_history)]

    # human, AI, human, AI pattern
    return {'chatHistory': chat_history, 'feedback_history': feedback_history}


def update_memory(assignmentid, userid):
    # updates global conversation memory
    global conversation
    # {"$and":[{"name": "name"}, {"date": "date"}]}
    db_chat = connect().Chat.session
    result = db_chat.find({"$and": [{"assignment_id": assignmentid}, {"user_id": userid}]}).sort('created',
                                                                                                 pymongo.ASCENDING)  # oldest first
    chat_history = result[0]["chat"]
    chat_history = chat_history.split("\n")

    feedback_history = result[0]["message_history"]
    feedback_history = feedback_history.split("\n")

    memory = ConversationSummaryBufferMemory(
        llm=chat, max_token_limit=4096
    )
    conversation.memory = memory
    for i in range(0, len(chat_history), 2):
        inp = chat_history[i].split(": ")[1]
        out = chat_history[i + 1].split(": ")[1]
        conversation.memory.save_context({"input": inp}, {"output": out})

    return chat_history, feedback_history


@app.route('/api/assign', methods=['GET', 'POST'])
def assign():
    db = connect().Main.assignments
    req = request.get_json()
    target = req['target']  # either 'everyone' or 'student'
    assignment_name = req['assignment_name']

    # insert = db.insert_one(
    #    {
    #        'user_id': uid,
    #        'class_id': cid
    #    }
    # )
    # return insert.inserted_id


@app.route('/api/get_prompt_from_chat', methods=['POST'])
def get_prompt_from_chat():
    req= request.get_json()
    chat_id=req['chat_id']

    if not chat_id:
        return jsonify({"error": "chat_id is required"}), 400

    db_chat = connect().Chat.session
    try:
        chat_document = db_chat.find_one({"_id": ObjectId(chat_id)})
        if not chat_document:
            return jsonify({"error": "Chat not found"}), 404

        prompt = chat_document.get('prompt')
        return jsonify({"system_prompt": prompt})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/getResponse', methods=['GET', 'POST'])
def getResponse():
    # Talks to chatgpt and gets a response
    req = request.get_json()
    text = req['text']
    system_prompt = req['system_prompt']
    chat_history = req['chat_history']
   

    chat_history_list = [
        {"role": "user",
         "content": message.get('content')} for message in chat_history]
    chat_history_list.insert(0, {"role": "system", "content": f"{system_prompt}"})
    chat_history_list.append({'role': 'user', 'content': text})

    print(f"chat_history_list = {chat_history_list}")
    response_roleplay_ai: ChatCompletion = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=chat_history_list,
        max_tokens=150,
        temperature=0.5,
    )
    return {'response': response_roleplay_ai.choices[0].message.content}


@app.route('/api/getAssignments', methods=['GET', 'POST'])
def getAssignments():
    db = connect().Main.assignments
    req = request.get_json()
    uid = req['uid']
    # returns pymongo cursor
    result = db.find({"user_id": uid}).sort('created', pymongo.DESCENDING)
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
    result = db2.find({"_id": obj})
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
    result = db.find({"_id": obj})
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
            text = recognizer.recognize_whisper(audio)  # You can try other recognizers as well, besides whisper
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
        feedback_data = db.find_one({"_id": obj})
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
                db.insert_one(
                    {"_id": obj, "student_id": "rfVmiajVyhRQu7F9apY0U2C30o22", "message_history": message_history})
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


@app.route('/api/get_last_six_error_summation_for_student', methods=['POST'])
def get_error_summation_student():
    """
    Retrieve the last 6 assignments for a given user_id and return their names and error counts.

    Query Parameters:
    - user_id (str): The ID of the _student_ whose assignments are to be retrieved.

    Returns:
    - JSON response containing:
        - labels (list of str): Names of the last 6 assignments.
        - grammar_errors (list of int): Number of grammar errors in each assignment.
        - tone_errors (list of int): Number of tone errors in each assignment.
        - vocabulary_errors (list of int): Number of vocabulary errors in each assignment.
    - HTTP Status 200 if the operation is successful.
    - HTTP Status 400 if the user_id is not provided.
    - HTTP Status 404 if no assignments are found for the given user_id.
    - HTTP Status 500 for any other errors.

    Example Request:
    GET /get_last_6_assignments?user_id=rfVmiajVyhRQu7F9apY0U2C30o22
    """
    data = request.json

    if not data or not 'user_id' in data:
        return jsonify({'error': 'Invalid input'}), 400

    user_id = data['user_id']

    assignment_db = connect().Main.assignments

    try:
        assignments = list(assignment_db.find({'user_id': user_id}).sort('created', -1).limit(6))

        if not assignments:
            return jsonify({'error': 'No assignments found for the given user_id'}), 404

        labels = [assignment['name'] for assignment in assignments]
        number_of_grammar_errors = [assignment.get('grammar_errors', 0) for assignment in assignments]
        number_of_tone_errors = [assignment.get('tone_errors', 0) for assignment in assignments]
        number_of_vocabulary_errors = [assignment.get('vocabulary_errors', 0) for assignment in assignments]

        response = {
            'labels': labels,
            'grammar_errors': number_of_grammar_errors,
            'tone_errors': number_of_tone_errors,
            'vocabulary_errors': number_of_vocabulary_errors
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/get_last_six_error_summation_for_teacher', methods=['GET'])
def get_error_summation_teacher():
    """
    Retrieve the last 6 assignments for a given user_id and return their names and error counts.

    Query Parameters:
    - user_id (str): The ID of the _teacher_ for whose students assignments are to be retrieved.

    Returns:
    - JSON response containing:
        - labels (list of str): Names of the last 6 assignments.
        - grammar_errors (list of int): Number of grammar errors in each assignment.
        - tone_errors (list of int): Number of tone errors in each assignment.
        - vocabulary_errors (list of int): Number of vocabulary errors in each assignment.
    - HTTP Status 200 if the operation is successful.
    - HTTP Status 400 if the user_id is not provided.
    - HTTP Status 404 if no assignments are found for the given user_id.
    - HTTP Status 500 for any other errors.

    Example Request:
    GET /get_last_6_assignments?user_id=uB5QM291PoXZnShJDj6VCdKGS4R2

    Note: Although the request takes user_id, it is mapped to the _assigner_ which is the teacher of the assignments.
    """

    data = request.json

    if not data or not 'user_id' in data:
        return jsonify({'error': 'Invalid input'}), 400

    assigner = data['user_id']

    assignment_db = connect().Main.assignments

    try:
        assignments = list(assignment_db.find({'assigner': assigner}).sort('created', -1).limit(6))

        if not assignments:
            return jsonify({'error': 'No assignments found for the given user_id'}), 404

        labels = [assignment['name'] for assignment in assignments]
        number_of_grammar_errors = [assignment.get('grammar_errors', 0) for assignment in assignments]
        number_of_tone_errors = [assignment.get('tone_errors', 0) for assignment in assignments]
        number_of_vocabulary_errors = [assignment.get('vocabulary_errors', 0) for assignment in assignments]

        response = {
            'labels': labels,
            'grammar_errors': number_of_grammar_errors,
            'tone_errors': number_of_tone_errors,
            'vocabulary_errors': number_of_vocabulary_errors
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/assignment_submitted', methods=['POST'])
def update_assignment_is_submitted():
    req = request.get_json()
    assignment_db = connect().Main.assignments

    if not req or not 'chat_id' in req:
        return jsonify({'error': 'Invalid input'}), 400

    chat_id = req['chat_id']

    result = assignment_db.update_one(
        {'chat_id': chat_id},
        {'$set': {'is_submitted': True}}
    )

    if result.matched_count == 0:
        return jsonify({'error': 'Assignment not found'}), 404

    return jsonify({'message': 'Assignment submission status updated successfully'}), 200


@app.route('/api/update_chat_history', methods=['POST'])
def update_chat_history_mistakes_for_immediate_feedback():
    print(f"inside update_chat_history")
    req = request.get_json()
    text_human = req.get('text')
    feedback_ai = req.get('feedback')
    roleplay_ai = req.get('roleplay_ai')

    db = connect().Chat.session
    db2 = connect().Main.assignments

    chat_id = req['chatid']
    obj = ObjectId(chat_id)

    result = db.find({"_id": obj})
    result = result[0]

    # Updating message_history of feedbacks
    message_history = result["message_history"]
    message_history += f"\nHuman:x {text_human}\n"
    feedback_ai_single_line = " ".join(feedback_ai.splitlines())
    message_history += f"AI:x {feedback_ai_single_line}"

    # Updating chat_history of roleplay
    chat_history = result["chat"]
    chat_history += f"\nHuman: {text_human}\n"
    chat_history += f"AI: {roleplay_ai}"

    db.update_one(
        {"_id": obj},
        {
            "$set": {"chat": chat_history,
                     "message_history": message_history
                     }
        },
        upsert=True
    )

    # Updating assignments collection with the mistakes
    result2 = db2.find({"chat_id": chat_id})

    result2 = result2[0]
    print(result2)
    update_fields = {}

    if 'grammar_errors' in req:
        update_fields['grammar_errors'] = result2.get('grammar_errors') + req['grammar_errors']
    if 'tone_errors' in req:
        update_fields['tone_errors'] = result2.get('tone_errors') + req['tone_errors']
    if 'vocabulary_errors' in req:
        update_fields['vocabulary_errors'] = result2.get('vocabulary_errors') + req['vocabulary_errors']

    if not update_fields:
        return jsonify({'error': 'No valid fields to update'}), 400

    db2.update_one(
        {'chat_id': chat_id},
        {'$set': update_fields}
    )

    return "success"


def generate_random_string(length=24):
    return ''.join(random.choices(string.hexdigits.lower(), k=length))


# API 1: Create new assignment documents for each student
@app.route('/api/create_assignments', methods=['POST'])
def create_assignments():
    """
    Create new assignment documents for each student.

    This API endpoint creates new assignment documents in the assignments collection
    for each student specified in the input request.

    Request JSON Format:
    {
        "assignment_name": str,       # Name of the assignment
        "due_date": str,              # Due date of the assignment in 'YYYY-MM-DD' format
        "teacher_id": str,            # ID of the teacher assigning the assignment
        "student_ids": list,          # List of student IDs receiving the assignment
        "description": str,           # Description of the assignment
        "student_class": str,         # Class associated with the assignment
        "language": str               # Language of the assignment
    }

    Response JSON Format:
    {
        "message": str,               # Message indicating the success of the operation
        "assignments": list           # List of created assignments with student_id, assignment_id, and chat_id
    }

    Response Status Codes:
        201: Assignments created successfully
        400: Missing required fields
    """
    data = request.json
    assignment_name = data.get('assignment_name')
    due_date = data.get('due_date')
    teacher_id = data.get('teacher_id')
    student_ids = data.get('student_ids')
    description = data.get('description')
    student_class = data.get('student_class')
    language = data.get('language')
    dialogue_ai_role = data.get('dialogue_ai_role')
    student_role = data.get('student_role')
    roleplay_description_ai = data.get('roleplay_description_ai')

    if not all([assignment_name, due_date, teacher_id, student_ids, student_class, student_class, description,
                dialogue_ai_role, student_role, roleplay_description_ai]):
        return jsonify({"error": "Missing required fields"}), 400

    due_date = datetime.datetime.strptime(due_date, "%Y-%m-%d")

    created_assignments = []
    db_assignments = connect().Main.assignments
    for student_id in student_ids:
        chat_id = generate_random_string()
        assignment_id = generate_random_string()
        assignment_document = {
            "user_id": student_id,
            "created": datetime.datetime.utcnow(),
            "name": assignment_name,
            "due_date": due_date,
            "class": student_class,
            "assigner": teacher_id,
            "description": description,
            "language": language,
            "chat_id": chat_id,
            "grammar_errors": 0,
            "tone_errors": 0,
            "vocabulary_errors": 0,
            "is_submitted": False,
            "dialogue_ai_role": dialogue_ai_role,
            "student_role": student_role,
            "roleplay_description_ai": roleplay_description_ai,
            "assignment_id": assignment_id,
        }
        db_assignments.insert_one(assignment_document)
        created_assignments.append({
            "student_id": student_id,
            "assignment_id": assignment_id,
            "chat_id": chat_id
        })

    return jsonify({"message": "Assignments created successfully", "assignments": created_assignments}), 201


@app.route('/api/get_students_for_teacher', methods=['GET'])
def get_students_for_teacher():
    """
    Get a list of student user IDs for a given teacher.

    This API endpoint retrieves a list of student user IDs that share the same
    language as the specified teacher.

    Query Parameters:
        user_id (str): The user ID of the teacher.

    Response JSON Format:
        {
            "students": list  # List of student user IDs sharing the same language as the teacher,
            "language": teacher / student language such as 'en-us' as string
        }

    Response Status Codes:
        200: Success with list of student user IDs.
        400: Missing user ID in the request.
        404: Teacher not found with the given user ID.
    """
    teacher_user_id = request.args.get('user_id')

    if not teacher_user_id:
        return jsonify({"error": "Missing user_id"}), 400

    # Fetch the teacher's document
    db_users = connect().Main.users

    teacher = db_users.find_one({"user_id": teacher_user_id, "role": "teacher"})

    if not teacher:
        return jsonify({"error": "Teacher not found"}), 404

    teacher_language = teacher.get('language')

    # Fetch all students with the same language
    students = db_users.find({"role": "student", "language": teacher_language})

    print(f"students = {students}")
    student_user_ids = [student['user_id'] for student in students]

    return jsonify({"students": student_user_ids, "language": teacher_language})


# API 2: Create LLM prompt
@app.route('/api/create_llm_prompt', methods=['POST'])
def create_llm_prompt():
    """
    Creates LLM prompts and updates the chat sessions collection.

    This endpoint accepts assignment details and creates new chat session documents
    in the `chat.sessions` collection for each assignment.

    Request JSON Parameters:
        - created_assignments (list of dict): A list of assignment details, where each entry
          contains the following keys:
            - student_id (str): The ID of the student.
            - assignment_id (str): The ID of the assignment.
            - chat_id (str): The ID of the chat session.
        - assignment_description (str): A description of the assignment.
        - language (str): The language of the assignment and chat session.
        - dialogue_ai_role (str): The role assigned to the AI in the dialogue.
        - student_role (str): The role assigned to the student in the dialogue.

    Returns:
        - JSON response indicating success or failure:
            - On success: A JSON response with a message "Chat sessions created successfully".
            - On failure: A JSON response with an error message "Missing required fields".
    """
    data = request.json
    created_assignments = data.get('created_assignments')
    assignment_description = data.get('assignment_description')
    language = data.get('language')
    dialogue_ai_role = data.get('dialogue_ai_role')
    student_role = data.get('student_role')
    roleplay_description_ai = data.get('roleplay_description_ai')

    if not all([created_assignments, assignment_description, language, dialogue_ai_role, student_role, roleplay_description_ai]):
        return jsonify({"error": "Missing required fields"}), 400

    db_chat_session = connect().Chat.session
    system_prompt = f"""
    This is a roleplay. You are a {dialogue_ai_role}. 
    Follow the instructions: {roleplay_description_ai}. The conversation MUST be in {language} STRICTLY. 
    You will be having conversation with a {student_role}. 
    Feel free to ask interesting and engaging questions. Keep each single conversation concise."""

    for assignment in created_assignments:
        student_id = assignment['student_id']
        assignment_id = assignment['assignment_id']
        chat_id = assignment['chat_id']

        chat_document = {
            "_id": ObjectId(chat_id),
            "user_id": student_id,
            "assignment_id": assignment_id,
            "prompt": system_prompt,
            "chat": "",
            "message_history": "",
            "language": language
        }

        db_chat_session.insert_one(chat_document)

    return jsonify({"message": "Chat sessions created successfully", "roleplay_prompt": system_prompt}), 201


@app.route('/api/get_student_highest_lowest_achievements', methods=['POST'])
def get_student_highest_lowest_achievements_for_teachers_dashboard():
    """
        Endpoint to retrieve students' achievements based on the number of errors in assignments.

    Request Body:
        - user_id (str): The ID of the teacher whose students' achievements are being queried.

    Returns:
        - JSON response containing two lists:
            - highest_achievers: List of students with the fewest errors.
            - needs_improvement: List of students with the most errors.
    """
    req = request.get_json()
    teacher_id = req.get('user_id')

    if not teacher_id:
        return jsonify({"error": "teacher_id is required"}), 400

    db_assignments = connect().Main.assignments
    assignments = db_assignments.find({"assigner": teacher_id})

    student_errors = {}
    for assignment in assignments:
        user_id = assignment['user_id']
        total_errors = assignment['grammar_errors'] + assignment['tone_errors'] + assignment['vocabulary_errors']
        if user_id in student_errors:
            student_errors[user_id] += total_errors
        else:
            student_errors[user_id] = total_errors

    sorted_students = sorted(student_errors.items(), key=lambda item: item[1])

    total_students = len(sorted_students)
    split_point = (total_students + 1) // 2  # Ensure extra student goes to highest achievers if odd number

    highest_achievers = sorted_students[:split_point]
    needs_improvement = sorted_students[split_point:]

    # Fetch student names from user_id
    db_users = connect().Main.users

    def get_student_names(students):
        result = []
        for user_id, errors in students:
            user = db_users.find_one({"user_id": user_id})
            if user:
                result.append({"name": user['name'], "errors": errors})
        result = sorted(result, key=lambda x: x['errors'], reverse=True)
        return result

    response = {
        "highest_achievers": get_student_names(highest_achievers),
        "needs_improvement": get_student_names(needs_improvement)
    }

    return jsonify(response)


@app.route('/api/get_header_statistics_for_teacher', methods=['POST'])
def get_header_statistics_for_teacher():
    """
    GET endpoint to fetch statistics for a teacher based on assignments.

    Parameters:
    - user_id (str): The ID of the teacher whose statistics are to be retrieved.

    Returns:
    - JSON response containing:
      - "best_performing_student": Name of the student with the lowest total errors.
      - "worst_performing_student": Name of the student with the highest total errors.
      - "number_of_assignments": Total number of assignments given by the teacher.
      - "language": languages for which the teacher is in-charge.

    Errors:
    - 400 if 'user_id' parameter is missing.
    - 404 if no assignments are found for the given user_id.
    """
    req = request.get_json()
    teacher_id = req.get('user_id')

    if not teacher_id:
        return jsonify({"error": "teacher_id parameter is required"}), 400

    db_assignments = connect().Main.assignments
    db_users = connect().Main.users

    # Filter assignments by teacher_id (assigner)
    assignments = db_assignments.find({"assigner": teacher_id})
    users = db_users.find()

    user_stats = {}

    language = "en-us"
    for assignment in assignments:
        language = assignment['language']
        user_id = assignment['user_id']
        errors_sum = assignment['grammar_errors'] + assignment['tone_errors'] + assignment['vocabulary_errors']

        if user_id in user_stats:
            user_stats[user_id] += errors_sum
        else:
            user_stats[user_id] = errors_sum

    if not user_stats:
        return jsonify({"error": "No assignments found for the given teacher_id"}), 404

    best_performing_student = min(user_stats, key=user_stats.get)
    worst_performing_student = max(user_stats, key=user_stats.get)

    print(f"user_stats = {user_stats}")
    # Get the names of the best and worst performing students
    users = list(users)  # Convert cursor to list for reuse
    
    best_student_name = next((user['name'] for user in users if user['user_id'] == best_performing_student), "Unknown")
    worst_student_name = next((user['name'] for user in users if user['user_id'] == worst_performing_student),
                              "Unknown")

    db_assignments = connect().Main.assignments
    number_of_assignments = db_assignments.count_documents({"assigner": teacher_id})

    return jsonify({
        "language": language,
        "best_performing_student": best_student_name,
        "worst_performing_student": worst_student_name,
        "number_of_assignments": number_of_assignments
    })
##get assignments
@app.route('/api/get_assignments_student', methods=['POST'])
def assignments_student():
    req = request.get_json()
    user_id = req.get('user_id')

    if not user_id:
        return jsonify({"error": "chat_id is required"}), 400

    db_assignments = connect().Main.assignments
   
    assignments = db_assignments.find(
        {"user_id": user_id},
        {"_id": 0, "name": 1,"due_date":1,"is_submitted":1,"description":1,"chat_id":1}
    )

    # Convert cursor to a list and return as JSON
    assignment_list = list(assignments)

    return jsonify({
        "assignments": assignment_list
    })


@app.route('/api/get_assignments_teacher', methods=['POST'])
def assignments_teacher():
    req = request.get_json()
    assigner_id = req.get('assigner_id')

    if not assigner_id:
        return jsonify({"error": "assigner_id is required"}), 400

    db_assignments = connect().Main.assignments
    db_users = connect().Main.users

  
    assignments = db_assignments.find(
        {"assigner": assigner_id},
        {"_id": 0, "due_date": 1, "is_submitted": 1, "chat_id": 1, "user_id": 1,"name":1}
    )

 
    assignment_list = list(assignments)


    user_ids = set(assignment['user_id'] for assignment in assignment_list)


    user_data = db_users.find(
        {"user_id": {"$in": list(user_ids)}},
        {"_id": 0, "user_id": 1, "name": 1}
    )

    
    user_dict = {user['user_id']: user['name'] for user in user_data}


    for assignment in assignment_list:
        assignment['user_name'] = user_dict.get(assignment['user_id'], "Unknown")
        del assignment['user_id']

    return jsonify({
        "assignments": assignment_list
    })


##general feedback pages
@app.route('/api/get_feedback_header_statistics_for_teacher', methods=['POST'])
def general_feedback_teacher():
    req = request.get_json()
    chat_id = req.get('chat_id')

    if not chat_id:
        return jsonify({"error": "chat_id is required"}), 400

    db_assignments = connect().Main.assignments
    assignment = db_assignments.find_one({"chat_id": chat_id})

    db = connect().Main.users

    if assignment:
        due_date = assignment["due_date"]
        is_submitted = assignment["is_submitted"]
        assignment_name = assignment["name"]
        user_id = assignment["user_id"]
        total_errors = assignment["grammar_errors"] + assignment["vocabulary_errors"] + assignment["tone_errors"]

    result = db.find({"user_id": user_id})[0]
    return jsonify({
        "due_date": due_date,
        "is_submitted": is_submitted,
        "assignment_name": assignment_name,
        "name": result['name'],
        "total_errors": total_errors

    })


@app.route('/api/assignment_errors', methods=['POST'])
def errors():
    req = request.get_json()
    chat_id = req.get('chat_id')

    if not chat_id:
        return jsonify({"error": "chat_id is required"}), 400

    db_assignments = connect().Main.assignments
    assignment = db_assignments.find_one({"chat_id": chat_id})

    # db = connect().Main.users

    grammar_errors = 0
    tone_errors = 0
    vocabulary_errors = 0
    if assignment:
        grammar_errors = assignment["grammar_errors"]
        tone_errors = assignment["tone_errors"]
        vocabulary_errors = assignment["vocabulary_errors"]

    return jsonify({
        "errors": [grammar_errors, vocabulary_errors, tone_errors]

    })


@app.route('/api/get_feedback_header_statistics_for_student', methods=['POST'])
def general_feedback_student():
    req = request.get_json()
    chat_id = req.get('chat_id')

    if not chat_id:
        return jsonify({"error": "chat_id is required"}), 400

    db_assignments = connect().Main.assignments
    assignment = db_assignments.find_one({"chat_id": chat_id})

    due_date = None
    is_submitted = False
    assignment_name = "Invalid"
    total_errors = 0

    if assignment:
        due_date = assignment["due_date"]
        is_submitted = assignment["is_submitted"]
        assignment_name = assignment["name"]
        total_errors = assignment["grammar_errors"] + assignment["vocabulary_errors"] + assignment["tone_errors"]

    return jsonify({
        "due_date": due_date,
        "is_submitted": is_submitted,
        "assignment_name": assignment_name,
        "total_errors": total_errors
    })


@app.route('/api/get_bar_statistics_for_teacher', methods=['POST'])
def get_bar_statistics_for_teacher():
    """
    Fetch and aggregate error statistics for assignments assigned by a specific teacher.

    Request Body (JSON):
    - user_id (str): The ID of the teacher.

    Response (JSON):
    - List of dictionaries, each containing:
        - assignment_id (str): The assignment ID.
        - total_grammar_errors (int): Total grammar errors for the assignment.
        - total_tone_errors (int): Total tone errors for the assignment.
        - total_vocabulary_errors (int): Total vocabulary errors for the assignment.
    """
    req = request.get_json()
    teacher_id = req.get('user_id')

    if not teacher_id:
        return jsonify({"error": "teacher_id is required"}), 400

    # Fetch all assignments for the given teacher_id
    db_assignments = connect().Main.assignments
    assignments = db_assignments.find({"assigner": teacher_id})

    # Aggregate errors by assignment_id
    error_summary = defaultdict(
        lambda: {"total_grammar_errors": 0, "total_tone_errors": 0, "total_vocabulary_errors": 0})

    for assignment in assignments:
        assignment_id = assignment.get('name')
        error_summary[name]["total_grammar_errors"] += assignment.get('grammar_errors', 0)
        error_summary[name]["total_tone_errors"] += assignment.get('tone_errors', 0)
        error_summary[name]["total_vocabulary_errors"] += assignment.get('vocabulary_errors', 0)

    # Format the result
    results = []
    print(f"error_summary = {error_summary}")

    for name, errors in error_summary.items():
        result = {
            "assignment_id": assignment_id,
            "total_grammar_errors": errors["total_grammar_errors"],
            "total_tone_errors": errors["total_tone_errors"],
            "total_vocabulary_errors": errors["total_vocabulary_errors"]
        }
        results.append(result)

    return jsonify(results)


@app.route('/api/immediate_feedback', methods=['POST'])
def feedback():
    """
    Calls OpenAI LLM to Get Feedback. The system instructions for the LLM is provided in system_instructions directory.
    """
    req = request.get_json()
    text = req.get('text')

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
                    "grammar_errors": number_of_grammar_errors,
                    "tone_errors": number_of_tone_errors,
                    "vocabulary_errors": number_of_vocabulary_errors})


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
    find = db.find({"_id": obj})
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
        max_tokens=550
    )
    feedback = response.choices[0].message.content
    print('feedback:', feedback)

    try:
        feedback = json.loads(feedback)
    except json.JSONDecodeError:
        feedback = eval(feedback.replace("'", "\""))

    return {'feedback': feedback}


if __name__ == '__main__':
    app.run(debug=True, port=8888, host='0.0.0.0')
