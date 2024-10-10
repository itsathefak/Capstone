import React, { useState, useEffect } from "react";
import Table from '../Common/Table';
import { getAppointmentHistory } from "../../api/appointments";

function AppointmentHistory() {
    const [appointmentHistory, setAppointmentHistory] = useState([]);

    // function called which performs get call and returns data to state variable
    useEffect(() => {
        const getHistory = async () => {
          try {
            const data = await getAppointmentHistory();
            setAppointmentHistory(data);
          } catch (error) {
            console.error("Error reading appointment history:", error);
          }
        };
    
        getHistory();
      }, []);

    return (
        <div className="apphis-main-container">
            <h2 className="apphis-header">Appointments History</h2>
            {/* Customize table component based on type and data */}
            <Table type="appointment history" data={appointmentHistory}/>
        </div>
    );
  }
  
  export default AppointmentHistory;