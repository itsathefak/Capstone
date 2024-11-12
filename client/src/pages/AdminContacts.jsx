import React, { useEffect, useState } from "react";
import { fetchContacts } from "../api/contact";
import Modal from "./ContactModal"; // Import the Modal component

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null); // Track the selected contact
  const [isMobile, setIsMobile] = useState(false); // Track if the screen is mobile

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const contacts = await fetchContacts();
        setContacts(contacts);
        setLoading(false);
      } catch (err) {
        setError("Failed to load contacts.");
        setLoading(false);
      }
    };

    loadContacts();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    // Listen for window resize event
    window.addEventListener("resize", handleResize);
    handleResize(); // Set the initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRowClick = (contact) => {
    setSelectedContact(contact); // Show modal with the clicked contact
  };

  const closeModal = () => {
    setSelectedContact(null); // Close the modal by setting the selected contact to null
  };

  const truncateMessage = (message, limit = 100) => {
    // Truncate the message if it exceeds the limit
    if (message.length > limit) {
      return message.substring(0, limit) + "...";
    }
    return message;
  };

  if (loading) return <div className="admin-contacts-loading"><div className="loading-spinner"></div></div>;
  if (error) return <div className="admin-contacts-error">{error}</div>;

  return (
    <div className="admin-contacts-container">
      <h2>Contact Submissions</h2>
      {contacts.length === 0 ? (
        <p>No contact submissions available.</p>
      ) : (
        <>
          {/* Display as table for large screens */}
          {!isMobile && (
            <div className="contacts-table-container">
              <table className="contacts-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact._id} onClick={() => handleRowClick(contact)}>
                      <td>{contact.firstName} {contact.lastName}</td>
                      <td>{contact.email}</td>
                      <td>{contact.phone}</td>
                      <td>{truncateMessage(contact.message)}</td>
                      <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Display as cards for small screens */}
          {isMobile && (
            <div className="contact-card-container">
              {contacts.map((contact) => (
                <div key={contact._id} className="contact-card" onClick={() => handleRowClick(contact)}>
                  <h3>{contact.firstName} {contact.lastName}</h3>
                  <p><span>Email:</span> {contact.email}</p>
                  <p><span>Phone:</span> {contact.phone}</p>
                  <p><span>Message:</span> {truncateMessage(contact.message)}</p>
                  <p><span>Date:</span> {new Date(contact.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Display the modal with contact details */}
      {selectedContact && (
        <Modal contact={selectedContact} onClose={closeModal} />
      )}
    </div>
  );
};

export default AdminContacts;