import React, { useState, useEffect } from "react";
import Table from '../Common/Table';
import { getAppointmentHistory } from "../../api/appointments";
import LoadingIndicator from "../Common/LoadingIndicator";

function AppointmentHistory() {
    const [appointmentHistory, setAppointmentHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // function called which performs get call and returns data to state variable
    useEffect(() => {
        const getHistory = async () => {
          try {
            setLoading(true);
            const data = await getAppointmentHistory();
            setAppointmentHistory(data);
          } catch (error) {
            console.error("Error reading appointment history:", error);
          }
          finally {
            setLoading(false);
          }
        };
    
        getHistory();
      }, []);

    return (
        <div className="apphis-main-container">
            {loading && <LoadingIndicator />}
            
            <h2 className="apphis-header">Appointments History</h2>
            {/* Customize table component based on type and data */}
            <Table type="appointment history" data={appointmentHistory}/>
        </div>
    );
  }
  
  export default AppointmentHistory;