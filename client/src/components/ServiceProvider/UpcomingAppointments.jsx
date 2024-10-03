import React, { useState, useEffect } from "react";
import Table from '../Common/Table';
import { getUpcomingAppointments } from "../../api/appointments";

function UpcomingAppointments() {
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    // function called which performs get call and returns data to state variable
    useEffect(() => {
        const getUpcoming = async () => {
          try {
            const data = await getUpcomingAppointments();
            setUpcomingAppointments(data);
          } catch (error) {
            console.error("Error reading upcoming appointment:", error);
          }
        };
    
        getUpcoming();
      }, []);

    return (
        <div className="upapp-main-container">
            <h2 className="upapp-header">Upcoming Appointments</h2>
            {/* Customize table component based on type and data */}
            <Table type="upcoming appointment" data={upcomingAppointments}/>
        </div>
    );
  }
  
  export default UpcomingAppointments;