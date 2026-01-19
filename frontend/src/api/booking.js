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

// export const bookAppointment = (data) =>
//   api.post("/appointments/appointments/book", data);


export const bookAppointment = async (data) => {
  try {
    // Log the data that will be sent to the backend
    console.log("Sending Data to Backend:", data);

    const response = await api.post("/appointments/appointments/book", data);

    console.log("Appointment booked successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error booking appointment:", error.response ? error.response.data : error.message);
    throw error;
  }
};
