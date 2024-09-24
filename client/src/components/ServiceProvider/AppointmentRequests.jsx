import React, { useState } from "react";
import Table from '../Common/Table';

function AppointmentRequests() {


    return (
        <div className="appreq-main-container">
            <h2 className="appreq-header">Appointment Requests</h2>
            <Table type="appointment requests"/>
        </div>
    );
  }
  
  export default AppointmentRequests;