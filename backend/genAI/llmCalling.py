import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

def generate_study_plan(summary):

    prompt = f"""
    You are an agriculture expert. Farmers would be passing their queries. I would be supplying with the crop details, soil details, and some details I mined using ML techniques.
    The Details along with the farmer's query are as follows:
    {summary}
    Now, generate the steps which should be taken by the farmer.
    """

    response = model.generate_content(prompt)

    return response.text