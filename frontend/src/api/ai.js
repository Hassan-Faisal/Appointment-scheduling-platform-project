import api from "./api";

// Function to send query and appointment date to backend
export const sendQueryToAI = async (query, selectedDate) => {
  try {
    const response = await api.post("/ai/query", {
      query: query,
      appointment_date: selectedDate,  // Optional, if available
    });

    // Log the response for debugging
    console.log("Backend response:", response.data);

    // Return the 'answer' field directly from the response
    return response.data.answer;  // Adjusted to return 'answer' field
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw new Error("Something went wrong. Please try again.");
  }
};
