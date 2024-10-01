import api from "./api";

// Function to create a service
export const createService = async (serviceData) => {
  try {
    const response = await api.post("/services/create", serviceData);
    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};

// Function to Update a service
