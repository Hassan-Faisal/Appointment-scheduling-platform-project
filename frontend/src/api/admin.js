import api from "./api";

export const adminApi = {
  dashboard: () => api.get("/admin/dashboard-stats"),

  doctors: () => api.get("/admin/users?role=doctor"),
  patients: () => api.get("/admin/users?role=patient"),

  blockUser: (id) => api.patch(`/admin/user/${id}/block`),
  unblockUser: (id) => api.patch(`/admin/user/${id}/unblock`),

  createDoctor: (data) => api.post("/admin/create-doctor", data),
  updateDoctor: (doctorId, data) => api.patch(`/admin/doctor/${doctorId}`, data), // Update doctor API
  getDoctorDetail :(doctorId) => api.get(`/admin/doctor/${doctorId}`),
  

  appointments: () => api.get("/admin/appointments"),
  reschedule: (id, data) =>
    api.patch(`/admin/appointment/${id}/reschedule`, data),

  addAvailability: (data) => api.post("/admin/availability", data),
  addBreak: (data) => api.post("/admin/break", data),
};
