# from app.utils.google_meet import create_google_meet



from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build
# from datetime import datetime, timedelta
import uuid

SCOPES = ["https://www.googleapis.com/auth/calendar"]
SERVICE_ACCOUNT_FILE = "app/core/google_calendar_service.json"

def create_google_meet(start_dt, end_dt, patient_email):
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=SCOPES
    )

    service = build("calendar", "v3", credentials=credentials)

    event = {
        "summary": "Online Doctor Appointment",
        "start": {
            "dateTime": start_dt.isoformat(),
            "timeZone": "Asia/Karachi",
        },
        "end": {
            "dateTime": end_dt.isoformat(),
            "timeZone": "Asia/Karachi",
        },
        "attendees": [
            {"email": patient_email}
        ],
        "conferenceData": {
            "createRequest": {
                "requestId": str(uuid.uuid4())
            }
        }
    }

    created_event = service.events().insert(
        calendarId="primary",
        body=event,
        conferenceDataVersion=1
    ).execute()

    meet_link = created_event["conferenceData"]["entryPoints"][0]["uri"]
    return meet_link

link = create_google_meet(
    datetime.now() + timedelta(hours=1),
    datetime.now() + timedelta(hours=1, minutes=30),
    "patient@example.com"
)

print(link)
