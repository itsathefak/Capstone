import api from "./api";

// GET call for appointment requests
export const getAppointmentRequests = async (providerId) => {
  try {
    const response = await api.get(
      `/appointments/requests`, providerId
    );
    return response.data;
  } catch (error) {
    console.error("Error reading appointment requests", error);
    throw error;
  }
};

// GET call for upcoming appointments
export const getUpcomingAppointments = async (providerId) => {
  try {
    const response = await api.get(
      `/appointments/upcoming`, providerId
    );
    return response.data;
  } catch (error) {
    console.error("Error reading upcoming appointments", error);
    throw error;
  }
};

// PUT call to accept a appointment request
export const acceptAppointment = async (appointmentId) => {
  try {
    const response = await api.put(
      `/appointments/requests/accept`,
      { appointmentId }
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );
    return response.data;
  } catch (error) {
    console.error("Error accepting the appointment", error);
    throw error;
  }
};

// PUT call to reject a appointment request
export const rejectAppointment = async (appointmentId) => {
  try {
    const response = await api.put(
      `/appointments/requests/reject`,
      { appointmentId }
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting the appointment", error);
    throw error;
  }
};

// GET call for appointment history
export const getAppointmentHistory = async (customerId) => {
  try {
    const response = await api.get(
      `/appointments/history`, customerId
    );
    return response.data;
  } catch (error) {
    console.error("Error reading appointment history", error);
    throw error;
  }
};

// Api calls for BookServiceForm

// Function to fetch available time slots
export const fetchAvailableTimeSlots = async (serviceId, date) => {
  try {
    const response = await api.get(
      `/appointments/available?serviceId=${serviceId}&date=${date}`
    );
    return response.data; // Return the available time slots
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    throw error;
  }
};

// Function to book a service
export const bookService = async (bookingDetails) => {
  try {
    const response = await api.post("/appointments/book", bookingDetails);
    return response.data; // Return booking confirmation
  } catch (error) {
    console.error("Error booking service:", error);
    throw error;
  }
};
