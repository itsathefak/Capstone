import React from "react";

const Modal = ({ contact, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>X</button>
        <h3>Contact Details</h3>
        <div className="modal-detail">
          <p><strong>Name:</strong> {contact.firstName} {contact.lastName}</p>
          <p><strong>Email:</strong> {contact.email}</p>
          <p><strong>Phone:</strong> {contact.phone}</p>
          <p><strong>Message:</strong> {contact.message}</p>
          <p><strong>Date Submitted:</strong> {new Date(contact.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;