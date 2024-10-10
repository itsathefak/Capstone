import React, { useState } from "react";

function TableRow({rowData, type, onAccept, onReject}) {

  return (
      <tr scope="row">
        {type === "appointment history" ? (
          <>
            <td>{rowData.serviceName}</td>
            <td>{rowData.providerName}</td>
            <td>{rowData.providerEmail}</td>
          </>
        ) : (
          <>
        <td>{rowData.userName}</td>
        <td>{rowData.userEmail}</td>
        <td>{rowData.serviceName}</td>
        </>
        )}
        <td>{rowData.date}</td>
        <td>{rowData.timeslot}</td>
        {/* hide/show accept/reject btns based on the type of table */}
        {type === "appointment requests" && (
        <td>
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
