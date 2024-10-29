import React, { useState } from "react";

function TableRow({rowData, type, onAccept, onReject}) {

  return (
      <tr scope="row">
        {type === "appointment history" ? (
          <>
            <td data-label="Service Name">{rowData.serviceName}</td>
            <td className="com-row-email" data-label="Provider Name">{rowData.providerName}</td>
            <td data-label="Provider Email">{rowData.providerEmail}</td>
          </>
        ) : (
          <>
        <td data-label="Name">{rowData.userName}</td>
        <td className="appreq-row-email" data-label="Email">{rowData.userEmail}</td>
        <td data-label="Service Name">{rowData.serviceName}</td>
        </>
        )}
        <td data-label="Date">{rowData.date}</td>
        <td data-label="Timeslot">{rowData.timeslot}</td>
        {/* hide/show accept/reject btns based on the type of table */}
        {type === "appointment requests" && (
        <td data-label="Action">
          <div className="com-action-btn-container">
            {/* callback functions passing id (appointment id) */}
            <button className="com-primary-btn" onClick={() => onAccept(rowData._id)}>Accept</button>
            <button className="com-secondary-btn" onClick={() => onReject(rowData._id)}>Reject</button>
          </div>
        </td>
        )}
      </tr>
  );
}

export default TableRow;
