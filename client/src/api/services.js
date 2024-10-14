import api from "./api";

// Function to create a service
export const createService = async (serviceData, providerId) => {
  try {
    const serviceDataWithProvider = {
      ...serviceData,
      providerId,
    };

    const response = await api.post(
      "/services/create",
      serviceDataWithProvider
    );
    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};

// Fetch services by provider
export const fetchServicesByProvider = async (providerId) => {
  const response = await api.get(`/services?providerId=${providerId}`);
  return response.data; // Return the fetched services
};

// Function to fetch a service by ID for EditService
export const fetchServiceById = async (serviceId) => {
  const response = await api.get(`/services/${serviceId}`);
  return response.data;
};

// Function to update a service
export const updateService = async (serviceId, serviceData) => {
  try {
    const response = await api.put(`/services/${serviceId}`, serviceData);
    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};
