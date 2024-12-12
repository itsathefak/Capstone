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

// Function to fetch user profile data
export const fetchUserProfile = async () => {
  try {
    const response = await api.get("/user/userProfile", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.response?.data);
    throw error;
  }
};
