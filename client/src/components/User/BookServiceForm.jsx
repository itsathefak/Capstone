import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchServiceById } from "../../api/services";
import { bookService } from "../../api/appointments";

const BookServiceForm = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);

  // Fetch service details
  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await fetchServiceById(serviceId);
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };
    fetchService();
  }, [serviceId]);

  // Handle date selection
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const availability = service.availability.find(
      (item) =>
        new Date(item.date).toDateString() === new Date(date).toDateString()
    );
    setTimeSlots(availability ? availability.slots : []);
    setSelectedTime("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const [startTime, endTime] = selectedTime.split("-");
    const bookingDetails = {
      serviceId,
      firstName,
      lastName,
      email,
      note,
      date: selectedDate,
      startTime,
      endTime,
      price: service.price,
      serviceName: service.name,
      providerName: `${service.providerFirstName} ${service.providerLastName}`,
    };
    try {
      await bookService(bookingDetails);
      alert(
        "Service booking request sent successfully! The provider will be notified for confirmation."
      );
      navigate("/service-list");
    } catch (error) {
      console.error("Error booking service:", error);
      alert("Failed to book the service. Please try again.");
    }
  };

  if (!service) return <div className="BS-loading">Loading...</div>;

  return (
    <div className="BS-form-container">
      <h1 className="BS-title">Book Service: {service.name}</h1>

      {/* Provider Details Table */}
      <div className="BS-provider-details">
        <h2 className="BS-provider-title">Provider Details</h2>
        <table className="BS-provider-table">
          <tbody>
            <tr>
              <td>
                <strong>Name:</strong>
              </td>
              <td>
                {service.providerFirstName} {service.providerLastName}
              </td>
            </tr>
            <tr>
              <td>
                <strong>Description:</strong>
              </td>
              <td>{service.description}</td>
            </tr>
            <tr>
              <td>
                <strong>Price:</strong>
              </td>
              <td>${service.price}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Booking Form */}
      <form className="BS-form" onSubmit={handleSubmit}>
        <h2 className="BS-form-title">Your Booking Details</h2>

        <div className="BS-form-group">
          <input
            className="BS-input"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            className="BS-input"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="BS-form-group">
          <input
            className="BS-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <textarea
          className="BS-textarea"
          placeholder="Add note/description"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="BS-date-time">
          <label className="BS-label" htmlFor="date">
            Select Date:
          </label>
          <select
            className="BS-select"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            required
          >
            <option value="">Select a date</option>
            {service.availability.map((availability) => (
              <option
                key={availability._id}
                value={new Date(availability.date).toISOString().split("T")[0]}
              >
                {new Date(availability.date).toLocaleDateString()}
              </option>
            ))}
          </select>

          {selectedDate && timeSlots.length > 0 && (
            <>
              <label className="BS-label" htmlFor="time">
                Select Time Slot:
              </label>
              <select
                className="BS-select"
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot) => (
                  <option
                    key={slot._id}
                    value={`${slot.startTime}-${slot.endTime}`}
                  >
                    {slot.startTime} - {slot.endTime}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <button className="BS-button" type="submit">
          Book Service
        </button>
      </form>
    </div>
  );
};

export default BookServiceForm;
