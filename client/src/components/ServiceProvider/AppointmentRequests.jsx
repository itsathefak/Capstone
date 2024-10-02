import React, { useState, useEffect } from "react";
import Table from "../Common/Table";
import { getAppointmentRequests, acceptAppointment, rejectAppointment } from "../../api/appointments";

function AppointmentRequests() {
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  // const token = localStorage.getItem("token");

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
      <Table type="appointment requests" data={appointmentRequests} onAccept={handleAccept}
        onReject={handleReject}/>
    </div>
  );
}

export default AppointmentRequests;
