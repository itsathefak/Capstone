import React, { useState, useEffect } from "react";
import Table from '../Common/Table';
import { getUpcomingAppointments } from "../../api/appointments";

function UpcomingAppointments() {
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

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
            <Table type="upcoming appointment" data={upcomingAppointments}/>
        </div>
    );
  }
  
  export default UpcomingAppointments;