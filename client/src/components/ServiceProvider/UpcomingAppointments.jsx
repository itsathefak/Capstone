import React, { useState, useEffect } from "react";
import Table from '../Common/Table';
import { getUpcomingAppointments } from "../../api/appointments";
import LoadingIndicator from "../Common/LoadingIndicator";
import { Helmet } from "react-helmet";

function UpcomingAppointments() {
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // function called which performs get call and returns data to state variable
    useEffect(() => {
        const getUpcoming = async () => {
          try {
            setLoading(true);
            const data = await getUpcomingAppointments();
            setUpcomingAppointments(data);
          } catch (error) {
            console.error("Error reading upcoming appointment:", error);
          }
          finally {
            setLoading(false);
          }
        };
    
        getUpcoming();
      }, []);

    return (
        <div className="upapp-main-container">
          <Helmet>
            <title>Upcoming Appointments | AppointMe</title>
            <meta name="description" content="View the list of confirmed upcoming appointments with the booked user and schedule details." />
            <meta name="keywords" content="upcoming appointments, scheduled appointments, confirmed appointments" />
          </Helmet>

          {loading && <LoadingIndicator />}

          <h2 className="upapp-header">Upcoming Appointments</h2>
          {/* Customize table component based on type and data */}
          <Table type="upcoming appointment" data={upcomingAppointments}/>
        </div>
    );
  }
  
  export default UpcomingAppointments;