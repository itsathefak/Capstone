import React, { useState, useEffect } from "react";
import Table from "../Common/Table";
import { getAppointmentRequests, acceptAppointment, rejectAppointment } from "../../api/appointments";

function AppointmentRequests() {
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  // const token = localStorage.getItem("token");

  // function called which performs get call and returns data to state variable
  useEffect(() => {
    const getRequests = async () => {
      try {
        const data = await getAppointmentRequests();
        setAppointmentRequests(data);
      } catch (error) {
        console.error("Error reading appointment requests:", error);
      }
    };

    getRequests();
  },[]);

  // function called which performs api call to accept requests
  const handleAccept = async (appointmentId) => {
    try {
        await acceptAppointment(appointmentId);

        setAppointmentRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== appointmentId)
        );
        console.log("Appointment accepted");
      } catch (error) {
        console.error("Error accepting the appointment:", error);
      }
  };

  // function called which performs api call to reject requests
  const handleReject = async (appointmentId) => {
    try {
        await rejectAppointment(appointmentId);

        setAppointmentRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== appointmentId)
        );
        console.log("Appointment rejected");
      } catch (error) {
        console.error("Error rejecting the appointment:", error);
      }
  };

  return (
    <div className="appreq-main-container">
      <h2 className="appreq-header">Appointment Requests</h2>

      {/* Customize table component based on type and data */}
      {/* passing accept and reject handling functions as props */}
      <Table type="appointment requests" data={appointmentRequests} onAccept={handleAccept}
        onReject={handleReject}/>
    </div>
  );
}

export default AppointmentRequests;
