from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.memory import ConversationSummaryBufferMemory
from langchain.callbacks import get_openai_callback
import os 
from dotenv import load_dotenv  
from pymongo.mongo_client import MongoClient
import pymongo
from bson.objectid import ObjectId
load_dotenv()

openaiKey = os.getenv("OPENAI_API_KEY")
client = MongoClient(os.getenv('connection_uri'))
db = client.Main.testing


test = db.find_one( {"_id": ObjectId("662618c8066d64dacc404e3a")} )
testing = test["conversation"]
print("first test:\n", testing)

chat = ChatOpenAI(openai_api_key=openaiKey, model_name="gpt-3.5-turbo")
conversation = ConversationChain(
    llm=chat,
    verbose=False,
)
"""
conversation.prompt.template = \"""
You are a servant for your master, the user, and shall always address them as master

Current conversation:
{history}
Human: {input}
AI:
\"""
"""

"""
with get_openai_callback() as cb:
    inp = input()
    while inp != "stop":
        result = conversation.predict(input=inp)
        print(f"\n{result}\n")
        inp = input()
    print(cb)
    print('\n')
    print(conversation.memory.buffer)
    print(type(conversation.memory.buffer))

db.insert_one(
    {
        'conversation': conversation.memory.buffer
    }
)
"""
memory=ConversationSummaryBufferMemory(
        llm=chat, max_token_limit=4096, buffer=testing
    )
conversation.memory = memory

testing = testing.split("\n")
for i in range(0, len(testing), 2):
    print(i)
    test = testing[i].split(": ")[1]
    test2 = testing[i+1].split(": ")[1]
    conversation.memory.save_context({"input": test}, {"output": test2})

print("test two:")
print(conversation.memory.buffer)
print(type(conversation.memory.buffer))
print(conversation.memory.load_memory_variables({}))

with get_openai_callback() as cb:
    inp = input()
    while inp != "stop":
        result = conversation.predict(input=inp)
        print(f"\n{result}\n")
        inp = input()
    print(cb)

messages = conversation.memory.chat_memory.messages
previous_summary = ""
test = conversation.memory.predict_new_summary(messages, previous_summary)
print(test)
print(conversation.memory.buffer)
print(type(conversation.memory.buffer))
print(conversation.memory.load_memory_variables({}))