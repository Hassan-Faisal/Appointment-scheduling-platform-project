import api from "./api";

// export const getDoctors = () => api.get("/doctor/doctors_list");

// export const getDoctorSlots = (doctorId, date) =>
//   api.get(`/slots/${doctorId}`, {
//     params: { date },
//   });

// export const bookAppointment = (data) =>
//   api.post("/appointments/book", data);
///////////////



// export const getDoctors = () => api.get("patient/doctors");

// export const getDoctorSlots = (doctorId, date) =>
//   api.get(`/slots/${doctorId}`, { params: { date } });

// export const bookAppointment = (data) =>
//   api.post("/appointments/book", data);


export const getDoctors = () =>
  api.get("/patient/doctors");

export const getDoctorSlots = (doctorId, date) =>
  api.get(`/patient/slots/${doctorId}`, {
    params: { date },
  });

export const bookAppointment = (data) =>
  api.post("/appointments/appointments/appointments/book", data);
