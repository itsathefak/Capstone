import api from "./api";

// appointment requests
export const getAppointmentRequests = async (token) => {
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

// upcoming appointments
export const getUpcomingAppointments = async (token) => {
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

export const acceptAppointment = async (appointmentId, token) => {
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

export const rejectAppointment = async (appointmentId, token) => {
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
