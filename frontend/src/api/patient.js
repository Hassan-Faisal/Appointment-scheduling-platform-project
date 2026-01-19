import api from "./api";

// Profile
export const getMyProfile = () => api.get("/patient/me");
export const updateMyProfile = (data) => api.put("/patient/me", data);

// Dashboard stats
export const getPatientStats = () => api.get("/patient/stats");

// Appointments
export const getMyUpcomingAppointments = () =>
  api.get("/patient/my-upcoming");




export const getMyAppointmentHistory = () =>
  api.get("/patient/my-history");

export const cancelAppointment = (id) =>
  api.patch(`/appointments/appointments/cancel/${id}`);
