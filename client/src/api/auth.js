import api from "./api";

// Function to handle user login
export const loginUser = async (formData) => {
  try {
    const response = await api.post("/user/login", formData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to handle user registration
export const registerUser = async (formData) => {
  try {
    const response = await api.post("/user/register", formData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
