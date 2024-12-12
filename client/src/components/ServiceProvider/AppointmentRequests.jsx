import React, { useState, useEffect } from "react";
import Table from "../Common/Table";
import { getAppointmentRequests, acceptAppointment, rejectAppointment } from "../../api/appointments";
import LoadingIndicator from "../Common/LoadingIndicator";
import Toast from "../Common/Toast";
import { Helmet } from "react-helmet";

function AppointmentRequests() {
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

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

        setAppointmentRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== appointmentId)
        );

        setToastMessage("Appointment Accepted");
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
        // showToast("Appointment rejected");
        setToastMessage("Appointment Rejected");
      } catch (error) {
        console.error("Error rejecting the appointment:", error);
      }
      finally {
        setLoading(false);
      }
  };

  return (
    <div className="appreq-main-container">

      <Helmet>
        <title>Appointment Requests | AppointMe</title>
        <meta name="description" content="Manage appointment requests efficiently with options to accept or reject them." />
        <meta name="keywords" content="appointment requests, accept appointment, reject appointment" />
      </Helmet>

      {loading && <LoadingIndicator />}
      {toastMessage && <Toast message={toastMessage} duration={3000} onClose={() => setToastMessage("")} />}

      <h2 className="appreq-header">Appointment Requests</h2>

      {/* Customize table component based on type and data */}
      {/* passing accept and reject handling functions as props */}
      <Table type="appointment requests" data={appointmentRequests} onAccept={handleAccept}
        onReject={handleReject}/>
    </div>
  );
}

export default AppointmentRequests;