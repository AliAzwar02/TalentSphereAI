from google.generativeai import GenerativeModel, configure
from dotenv import load_dotenv
import os
import traceback

load_dotenv()
try:
    configure(api_key=os.getenv('GEMINI_API_KEY'))
    model = GenerativeModel('gemini-1.5-flash')
    history=[{'role': 'user', 'parts': ['hi']}]
    chat = model.start_chat(history=history)
    print("Chat started. Response:", chat.send_message('hello').text)
except Exception as e:
    print("Error:")
    traceback.print_exc()
