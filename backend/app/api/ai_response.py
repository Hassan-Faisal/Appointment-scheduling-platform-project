
# # from fastapi import APIRouter, HTTPException
# # from pydantic import BaseModel
# # from typing import Optional
# # from datetime import date
# # import os

# # from litellm import completion

# # from app.api.ai_data import get_doctors_for_ai, get_doctor_availability_for_ai

# # router = APIRouter()

# # class AiQueryRequest(BaseModel):
# #     query: str
# #     appointment_date: Optional[date] = None  # optional

# # def fetch_doctor_and_slot_data(appointment_date: Optional[date] = None):
# #     doctors_data = get_doctors_for_ai()

# #     if appointment_date:
# #         availability_data = get_doctor_availability_for_ai(appointment_date)
# #     else:
# #         availability_data = []

# #     return doctors_data, availability_data

# # def run_gemini(doctors_data, availability_data, user_query: str):
# #     # Keep prompt small (minimal setup). Large data ho to later filtering/summary add karna.
# #     prompt = f"""
# # You are a helpful healthcare assistant.

# # Doctors:
# # {doctors_data}

# # Availability (if provided, else empty):
# # {availability_data}

# # User query:
# # {user_query}

# # Task:
# # 1) Suggest best matching doctor(s) based on query (specialization/experience/fee).
# # 2) If availability is provided, show 3-5 best available slots for the best doctor.
# # 3) If date not provided, just recommend doctor(s) and ask preferred date.
# # Return in clean bullet points.
# # """

# #     try:
# #         # LiteLLM uses OpenAI-style "messages"
# #         resp = completion(
# #             model="gemini/gemini-2.5-flash",
# #             messages=[
# #                 {"role": "system", "content": "You are a healthcare assistant for an appointment booking platform."},
# #                 {"role": "user", "content": prompt},
# #             ],
# #             api_key=os.getenv("GEMINI_API_KEY"),  # IMPORTANT
# #         )

# #         # LiteLLM response is OpenAI-style
# #         return resp["choices"][0]["message"]["content"]

# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")

# # @router.post("/ai/query")
# # async def ai_query(payload: AiQueryRequest):
# #     try:
# #         doctors_data, availability_data = fetch_doctor_and_slot_data(payload.appointment_date)
# #         ai_text = run_gemini(doctors_data, availability_data, payload.query)
# #         return {"ai_response": ai_text}
# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# import os
# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from typing import Optional
# from datetime import date
# # from ...ai_suggestion.src.ai_suggestion.crew import AiSuggestion  # Import CrewAI
# from ai_suggestion.src.ai_suggestion.crew import AiSuggestion  # Import CrewAI

# # Import your helper functions
# from app.api.ai_data import get_doctors_for_ai, get_doctor_availability_for_ai

# router = APIRouter()

# # Define the Pydantic model for the request body
# class AiQueryRequest(BaseModel):
#     query: str
#     appointment_date: Optional[date] = None  # Optional appointment date

# # Function to fetch doctor and slot data
# def fetch_doctor_and_slot_data(appointment_date: Optional[date] = None):
#     doctors_data = get_doctors_for_ai()  # Fetch doctors from your API

#     if appointment_date:
#         availability_data = get_doctor_availability_for_ai(appointment_date)  # Fetch availability if date is provided
#     else:
#         availability_data = []  # No availability data if no date is provided

#     return doctors_data, availability_data

# # Function to run CrewAI's suggestion system
# def run_crewai(doctors_data, availability_data, query: str):
#     # Prepare inputs for CrewAI
#     inputs = {
#         # "topic": "AI LLMs",  # or a topic relevant to your domain
#         "doctors_data": doctors_data,
#         "availability_data": availability_data,
#         "query": query,
#     }

#     try:
#         # Call CrewAI's run method with the inputs
#         ai_suggestion = AiSuggestion()
#         ai_response = ai_suggestion.crew().kickoff(inputs=inputs)
#         return ai_response
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error running CrewAI: {str(e)}")

# @router.post("/ai/query")
# async def ai_query(payload: AiQueryRequest):
#     try:
#         # Step 1: Fetch data from the API (doctors and availability)
#         doctors_data, availability_data = fetch_doctor_and_slot_data(payload.appointment_date)

#         # Step 2: Run CrewAI to get the suggestion based on the query
#         ai_response = run_crewai(doctors_data, availability_data, payload.query)

#         # Step 3: Return the AI response to the user
#         return {"ai_response": ai_response}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing the query: {str(e)}")


# # #


# import os
# import requests
# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from typing import Optional
# from datetime import date

# # Import your helper functions
# from app.api.ai_data import get_doctors_for_ai, get_doctor_availability_for_ai

# router = APIRouter()

# # Define the Pydantic model for the request body
# class AiQueryRequest(BaseModel):
#     query: str
#     appointment_date: Optional[date] = None  # Optional appointment date

# # Function to fetch doctor and slot data
# def fetch_doctor_and_slot_data(appointment_date: Optional[date] = None):
#     doctors_data = get_doctors_for_ai()  # Fetch doctors from your API

#     if appointment_date:
#         availability_data = get_doctor_availability_for_ai(appointment_date)  # Fetch availability if date is provided
#     else:
#         availability_data = []  # No availability data if no date is provided

#     return doctors_data, availability_data

# # Function to make a request to Google Gemini API
# def run_gemini_api(doctors_data, availability_data, query: str):
#     # Prepare the API URL and headers
#     api_key = os.getenv('GEMINI_API_KEY')  # Ensure you have set your API key in environment variables
#     url = "https://generativelanguage.googleapis.com/v1beta/openai/"  # Example URL for Gemini API (check the actual endpoint)
    
#     # Prepare the data for the request
#     data = {
#         "model": "google/gemini-2",  # Specify the model you're using
#         "inputs": [
#             {
#                 "doctors_data": doctors_data,
#                 "availability_data": availability_data,
#                 "query": query
#             }
#         ]
#     }
    
#     # Prepare the headers with Authorization (using your API Key)
#     headers = {
#         'Content-Type': 'application/json',
#         'Authorization': f'Bearer {api_key}',  # Your Gemini API key
#     }

#     try:
#         # Send the request to Gemini API
#         response = requests.post(url, headers=headers, json=data)

#         # If successful, return the response
#         if response.status_code == 200:
#             return response.json()  # Assuming the API returns a JSON response
#         else:
#             raise HTTPException(status_code=response.status_code, detail=f"Error from Gemini API: {response.text}")

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error with Gemini API: {str(e)}")

# @router.post("/ai/query")
# async def ai_query(payload: AiQueryRequest):
#     try:
#         # Step 1: Fetch data from the API (doctors and availability)
#         doctors_data, availability_data = fetch_doctor_and_slot_data(payload.appointment_date)

#         # Step 2: Make the request to Gemini API to get the AI response based on the query
#         ai_response = run_gemini_api(doctors_data, availability_data, payload.query)

#         # Step 3: Return the AI response to the user
#         return {"ai_response": ai_response}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing the query: {str(e)}")

import os
import requests
import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
from app.core.database import get_db
from app.services.ai_data_service import (
    fetch_doctors,
    fetch_doctor_availability
)
gemini_key=os.getenv("GEMINI_API_KEY")
router = APIRouter()


class AiQueryRequest(BaseModel):
    query: str
    appointment_date: Optional[date] = None


def run_gemini_api(query: str, doctors_data, availability_data):
    
    if not gemini_key:
        raise HTTPException(status_code=500, detail="Gemini API key not set")

    url = (
        "https://generativelanguage.googleapis.com/"
        "v1beta/models/gemini-3-flash-preview:generateContent"
    )
  
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": gemini_key,
    }

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": f"""
You are a medical appointment assistant.

Doctors:
{doctors_data}

Availability:
{availability_data}

User query:
{query}

Respond clearly and recommend the best doctor.
"""
                    }
                ]
            }
        ]
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini error: {response.text}"
        )

    return response.json()


# @router.post("/ai/query")
# def ai_query(payload: AiQueryRequest, db: Session = Depends(get_db)):
#     logging.info(f"AI query received: {payload.query}")

#     doctors_data = fetch_doctors(db)

#     availability_data = []
#     if payload.appointment_date:
#         availability_data = fetch_doctor_availability(
#             db, payload.appointment_date
#         )

#     ai_response = run_gemini_api(
#         payload.query,
#         doctors_data,
#         availability_data
#     )

#     return {"ai_response": ai_response}

@router.post("/ai/query")
def ai_query(payload: AiQueryRequest, db: Session = Depends(get_db)):
    doctors_data = fetch_doctors(db)

    availability_data = []
    if payload.appointment_date:
        availability_data = fetch_doctor_availability(
            db, payload.appointment_date
        )

    ai_raw_response = run_gemini_api(
        payload.query,
        doctors_data,
        availability_data
    )

    # ✅ SAFE EXTRACTION
    try:
        ai_text = (
            ai_raw_response["candidates"][0]
            ["content"]["parts"][0]["text"]
        )
    except (KeyError, IndexError):
        raise HTTPException(
            status_code=500,
            detail="Invalid AI response format"
        )

    return {
        "answer": ai_text
    }
