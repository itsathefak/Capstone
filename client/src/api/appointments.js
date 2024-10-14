import api from "./api";

// GET call for appointment requests
export const getAppointmentRequests = async () => {
  try {
    const response = await api.get(
      `/appointments/requests`
      //     {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );
    return response.data;
  } catch (error) {
    console.error("Error reading appointment requests", error);
    throw error;
  }
};

// GET call for upcoming appointments
export const getUpcomingAppointments = async () => {
  try {
    const response = await api.get(
      `/appointments/upcoming`
      //     {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
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
export const getAppointmentHistory = async () => {
  try {
    const response = await api.get(
      `/appointments/history`
      //     {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
    );
    return response.data;
  } catch (error) {
    console.error("Error reading appointment history", error);
    throw error;
  }
};