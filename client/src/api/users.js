import api from "./api";

// Function to fetch services with user images
export const fetchServicesWithUserImage = async () => {
  try {
    const response = await api.get("/userService/services-with-user-image");
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};
