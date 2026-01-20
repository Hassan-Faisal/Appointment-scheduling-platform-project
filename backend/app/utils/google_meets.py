from googleapiclient.discovery import build
from datetime import datetime, timedelta
from app.utils.google_auth import get_calendar_service

def create_google_meet(doctor_email, patient_email, start_dt, end_dt):
    service = get_calendar_service()

    event = {
        "summary": "Online Medical Consultation",
        "description": "Online appointment via Google Meet",
        "start": {"dateTime": start_dt.isoformat()},
        "end": {"dateTime": end_dt.isoformat()},
        "conferenceData": {
            "createRequest": {
                "requestId": f"meet-{start_dt.timestamp()}"
            }
        },
        "attendees": [
            {"email": doctor_email},
            {"email": patient_email}
        ]
    }

    created_event = service.events().insert(
        calendarId="primary",
        body=event,
        conferenceDataVersion=1
    ).execute()

    return created_event["conferenceData"]["entryPoints"][0]["uri"]
