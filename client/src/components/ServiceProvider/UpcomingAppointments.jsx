import React, { useState } from "react";
import Table from '../Common/Table';

function UpcomingAppointments() {
    return (
        <div className="upapp-main-container">
            <h2 className="upapp-header">Upcoming Appointments</h2>
            <Table type="upcoming appointment"/>
        </div>
    );
  }
  
  export default UpcomingAppointments;