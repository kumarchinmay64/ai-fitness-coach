import os

from dotenv import load_dotenv
from google import genai


# Load variables from .env
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY was not found in .env")


# Create Gemini client
client = genai.Client(api_key=api_key)


# Send a simple test question
response = client.models.generate_content(
    model="gemini-3.7-flash",
    contents="Give me one short fitness tip for a beginner."
)


print("\n===== GEMINI RESPONSE =====\n")
print(response.text)