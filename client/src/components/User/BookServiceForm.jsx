import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchServiceById } from "../../api/services";
import { createPaymentIntent } from "../../api/payment";
import { Helmet } from "react-helmet";

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
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const platformFee = 40;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await fetchServiceById(serviceId);

        // Group availability by unique dates
        const groupedAvailability = data.availability.reduce((acc, curr) => {
          const dateKey = new Date(curr.date).toISOString().split("T")[0];
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey] = [...acc[dateKey], ...curr.slots];
          return acc;
        }, {});

        const groupedAvailabilityArray = Object.entries(
          groupedAvailability
        ).map(([date, slots]) => ({
          date,
          slots,
        }));

        data.groupedAvailability = groupedAvailabilityArray; // Attach grouped availability to the service
        setService(data);

        const calculatedTax = (data.price + platformFee) * 0.13;
        const calculatedTotal = data.price + calculatedTax + platformFee;

        setSubtotal(data.price);
        setTax(calculatedTax);
        setTotal(calculatedTotal);

        const paymentIntent = await createPaymentIntent({
          amount: calculatedTotal,
          paymentType: "booking",
        });

        setClientSecret(paymentIntent.clientSecret);
        setPaymentIntentId(paymentIntent.clientSecret.split("_secret_")[0]);
      } catch (error) {
        console.error(
          "Error fetching service or creating payment intent:",
          error
        );
      }
    };
    fetchService();
  }, [serviceId, platformFee]);

  const handleVoiceInput = (setFieldValue, type) => {
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript.trim();
      setFieldValue(spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const availability = service?.groupedAvailability?.find(
      (item) => item.date === date
    );
    setTimeSlots(availability ? availability.slots : []);
    setSelectedTime("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientSecret || !paymentIntentId) {
      alert("Payment initialization failed. Please try again.");
      return;
    }

    navigate("/payment", {
      state: {
        clientSecret,
        paymentIntentId,
        paymentDetails: { subtotal, tax, platformFee, total },
        userDetails: { firstName, lastName, email, note },
        serviceDetails: {
          serviceId: service?._id,
          serviceName: service?.name,
          providerName: `${service?.providerFirstName} ${service?.providerLastName}`,
          selectedDate,
          selectedTime,
        },
        paymentType: "booking",
      },
    });
  };

  if (!service) return <div className="BS-loading">Loading...</div>;

  return (
    <div className="BS-form-container">
      <Helmet>
        <title>Book a Service | AppointMe</title>
        <meta
          name="description"
          content="Book a service by adding the user details and scheduling an appointment."
        />
        <meta
          name="keywords"
          content="book service, book appointment, schedule appointment"
        />
      </Helmet>

      <div className="BS-provider-details">
        <h2 className="BS-provider-title">Provider Details</h2>
        <table className="BS-provider-table">
          <tbody>
            <tr>
              <td>
                <strong>Service Name:</strong>
              </td>
              <td>{service?.name}</td>
            </tr>
            <tr>
              <td>
                <strong>Provider Name:</strong>
              </td>
              <td>
                {service?.providerFirstName} {service?.providerLastName}
              </td>
            </tr>
            <tr>
              <td>
                <strong>Description:</strong>
              </td>
              <td>{service?.description}</td>
            </tr>
            <tr>
              <td>
                <strong>Price:</strong>
              </td>
              <td>${service?.price.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

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
            onClick={() => handleVoiceInput(setEmail)}
          >
            🎤
          </button>
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
              {service?.groupedAvailability?.map((availability) => (
                <option key={availability.date} value={availability.date}>
                  {availability.date}
                </option>
              ))}
            </select>
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
              </div>
            </>
          )}
        </div>

        <div className="payment-summary">
          <h2>Payment Summary</h2>
          <div className="summary-row">
            <span className="summary-label">Subtotal:</span>
            <span className="summary-value">${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Platform Fee:</span>
            <span className="summary-value">${platformFee.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Tax (13%):</span>
            <span className="summary-value">${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row summary-total">
            <span className="total-label">Total:</span>
            <span className="total-value">${total.toFixed(2)}</span>
          </div>
        </div>

        <button className="BS-button" type="submit">
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default BookServiceForm;
