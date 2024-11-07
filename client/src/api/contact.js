import api from "./api";

// Function to submit contact form data
export const submitContactForm = async (contactData) => {
  try {
    const response = await api.post("/contact", contactData);
    return response.data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
};
