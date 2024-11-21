import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchServiceById } from "../../api/services";
import { bookService } from "../../api/appointments";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

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

  // Speech recognition for input fields
  const handleVoiceInput = (setFieldValue, type, options = []) => {
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript.trim();
      let matchedOption = null;

      if (type === "date") {
        const normalizedText = spokenText.replace(/(\d+)(st|nd|rd|th)/, "$1");

        const date = new Date(normalizedText);

        if (isNaN(date.getTime())) {
          return null;
        }

        // Format the date as MM/DD/YYYY
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const yyyy = date.getFullYear();

        let spokenDate = `${yyyy}-${mm}-${dd}`;

        // Match the spoken text with available dates
        const matchedDate = options.find((date) => {
          return new Date(date).toISOString().split("T")[0] === spokenDate;
        });

        if (matchedDate) {
          setFieldValue(matchedDate);
          const availability = service.availability.find(
            (item) =>
              new Date(item.date).toISOString().split("T")[0] ===
              new Date(date).toISOString().split("T")[0]
          );
          setTimeSlots(availability ? availability.slots : []);
          setSelectedTime("");
        } else {
          const utterance = new SpeechSynthesisUtterance(
            "The spoken date does not match any available options. Please try again."
          );
          window.speechSynthesis.speak(utterance);
        }
      } else if (type === "time") {
        let spokenTime = spokenText.replace(/ to /g, "-").toLowerCase();
        spokenTime = spokenTime.replace(/ p.m./g, "").toLowerCase();
        spokenTime = spokenTime.replace(/ a.m./g, "").toLowerCase();

        const [start, end] = spokenTime.split("-");

        // Format the start and end time
        const formattedStart = start
          .split(":")
          .map((part) => part.padStart(2, "0"))
          .join(":");
        const formattedEnd = end
          .split(":")
          .map((part) => part.padStart(2, "0"))
          .join(":");

        spokenTime = `${formattedStart}-${formattedEnd}`;

        // Match the spoken text with available time slots
        const matchedTime = options.find((time) => {
          return time.toLowerCase() === spokenTime;
        });

        if (matchedTime) {
          setFieldValue(matchedTime);
        } else {
          const utterance = new SpeechSynthesisUtterance(
            "The spoken time slot does not match any available options. Please try again."
          );
          window.speechSynthesis.speak(utterance);
        }
      } else if (type === "email") {
        const email = spokenText.replace(/ at the rate /g, "@").toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
          setFieldValue(email);
        } else {
          const utterance = new SpeechSynthesisUtterance(
            "The spoken input does not appear to be a valid email address. Please try again."
          );
          window.speechSynthesis.speak(utterance);
        }
      } else {
        setFieldValue(spokenText);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

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

        <label className="BS-label" htmlFor="firstName">
          First Name:
        </label>
        <div className="BS-input-group">
          <input
            className="BS-input"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <button
            type="button"
            className="BS-voiceButton"
            onClick={() => handleVoiceInput(setFirstName)}
          >
            🎤
          </button>
        </div>

        <label className="BS-label" htmlFor="lastName">
          Last Name:
        </label>
        <div className="BS-input-group">
          <input
            className="BS-input"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <button
            type="button"
            className="BS-voiceButton"
            onClick={() => handleVoiceInput(setLastName)}
          >
            🎤
          </button>
        </div>

        <label className="BS-label" htmlFor="email">
          Email:
        </label>

        <div className="BS-form-group">
          <div className="BS-input-group">
            <input
              className="BS-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="button"
              className="BS-voiceButton"
              onClick={() => handleVoiceInput(setEmail, "email")}
            >
              🎤
            </button>
          </div>
        </div>

        <label className="BS-label" htmlFor="note">
          Add note/description:
        </label>

        <div className="BS-input-group">
          <textarea
            className="BS-textarea"
            placeholder="Add note/description"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            type="button"
            className="BS-voiceButton"
            onClick={() => handleVoiceInput(setNote)}
          >
            🎤
          </button>
        </div>

        <div className="BS-date-time">
          <label className="BS-label" htmlFor="date">
            Select Date:
          </label>
          <div className="BS-input-group">
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
                  value={
                    new Date(availability.date).toISOString().split("T")[0]
                  }
                >
                  {new Date(availability.date).toISOString().split("T")[0]}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="BS-voiceButton"
              onClick={() =>
                handleVoiceInput(
                  setSelectedDate,
                  "date",
                  service.availability.map(
                    (availability) =>
                      new Date(availability.date).toISOString().split("T")[0]
                  )
                )
              }
            >
              🎤
            </button>
          </div>

          {selectedDate && timeSlots.length > 0 && (
            <>
              <label className="BS-label" htmlFor="time">
                Select Time Slot:
              </label>
              <div className="BS-input-group">
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
                      disabled={slot.status === "Booked"}
                    >
                      {slot.startTime} - {slot.endTime}{" "}
                      {slot.status === "Booked" ? "(Booked)" : ""}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="BS-voiceButton"
                  onClick={() =>
                    handleVoiceInput(
                      setSelectedTime,
                      "time",
                      timeSlots.map(
                        (slot) => `${slot.startTime}-${slot.endTime}`
                      )
                    )
                  }
                >
                  🎤
                </button>
              </div>
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
