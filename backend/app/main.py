# from fastapi import FastAPI
# from app.api import auth

# app = FastAPI()
# app.include_router(auth.router, prefix="/auth")


from fastapi import FastAPI
from app.api import auth, patient, doctor, admin
from app.api import appointments
from app.api import admin_schedule, admin_breaks, slots
from app.api import patient_actions, doctor_actions, system_actions

from app.api import doctor_dashboard, patient_dashboard, admin_dashboard



app = FastAPI()

app.include_router(auth.router, prefix="/auth")
app.include_router(patient.router, prefix="/patient")
app.include_router(doctor.router, prefix="/doctor")
app.include_router(admin.router, prefix="/admin")
app.include_router(appointments.router, prefix="/appointments")
app.include_router(admin_schedule.router, prefix="/admin")
app.include_router(admin_breaks.router, prefix="/admin")
app.include_router(slots.router, prefix="/slots")
app.include_router(patient_actions.router, prefix="/patient")
app.include_router(doctor_actions.router, prefix="/doctor")
app.include_router(system_actions.router, prefix="/system")

app.include_router(doctor_dashboard.router, prefix="/doctor")
app.include_router(patient_dashboard.router, prefix="/patient")
app.include_router(admin_dashboard.router, prefix="/admin")