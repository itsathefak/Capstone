import React, { useState, useEffect } from "react";
import Table from "../Common/Table";
import { getAppointmentRequests, acceptAppointment, rejectAppointment } from "../../api/appointments";
import LoadingIndicator from "../Common/LoadingIndicator";

function AppointmentRequests() {
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // function called which performs get call and returns data to state variable
  useEffect(() => {
    const getRequests = async () => {
      try {
        setLoading(true);
        const data = await getAppointmentRequests();
        setAppointmentRequests(data);
      } catch (error) {
        console.error("Error reading appointment requests:", error);
      }
      finally {
        setLoading(false);
      }
    };

    getRequests();
  },[]);

  // function called which performs api call to accept requests
  const handleAccept = async (appointmentId) => {
    try {
        setLoading(true);
        await acceptAppointment(appointmentId);

        debugger;

        setAppointmentRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== appointmentId)
        );
        console.log("Appointment accepted");
      } catch (error) {
        console.error("Error accepting the appointment:", error);
      }
      finally {
        setLoading(false);
      }
  };

  // function called which performs api call to reject requests
  const handleReject = async (appointmentId) => {
    try {
        setLoading(true);

        await rejectAppointment(appointmentId);

        setAppointmentRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== appointmentId)
        );
        console.log("Appointment rejected");
      } catch (error) {
        console.error("Error rejecting the appointment:", error);
      }
      finally {
        setLoading(false);
      }
  };

  return (
    <div className="appreq-main-container">
      {loading && <LoadingIndicator />}

      <h2 className="appreq-header">Appointment Requests</h2>

      {/* Customize table component based on type and data */}
      {/* passing accept and reject handling functions as props */}
      <Table type="appointment requests" data={appointmentRequests} onAccept={handleAccept}
        onReject={handleReject}/>
    </div>
  );
}

export default AppointmentRequests;
