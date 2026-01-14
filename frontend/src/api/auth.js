import api from "./api";

// LOGIN
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

// SIGNUP (Patient only)
export const signupPatient = async (data) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });
  return response.data;
};
