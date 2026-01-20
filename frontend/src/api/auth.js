import api from "./api";

// LOGIN
export const loginUser = async ( email, password) => {
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

export const forgotPassword = async (email) => {
    const response = await api.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
    return response.data;
  };
  

export const verifyEmail = (token) =>
  api.get(`/auth/verify-email?token=${token}`);

export const resendVerification = (email) =>
  api.post("/auth/resend-verification", null, {
    params: { email }
  });


export const resetPassword = async (token, newPassword) => {
  try {
    // Use `token` in the query and `newPassword` in the query string as expected by the backend
    const response = await api.post(
      `/auth/reset-password?token=${token}&new_password=${newPassword}`
    );
    return response.data;  // Return the response data
  } catch (error) {
    console.error("Error resetting password:", error);  // Log the error
    throw error;  // Re-throw the error for the frontend to handle
  }
};

