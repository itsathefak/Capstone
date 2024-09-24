import React, { useState } from "react";
import TableRow from "./TableRow";

function Table({request, type}) {

  return (
      <tr scope="row">
        <td>{request.name}</td>
        <td>{request.email}</td>
        <td>{request.date}</td>
        <td>{request.timeslot}</td>
        {type !== "upcoming appointment" && (
        <td>
          <div className="com-action-btn-container">
            <button className="com-primary-btn">Accept</button>
            <button className="com-secondary-btn">Reject</button>
          </div>
        </td>
        )}
      </tr>
  );
}

export default Table;
