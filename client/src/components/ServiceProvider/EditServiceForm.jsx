import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchServiceById, updateService } from "../../api/services";
import { Helmet } from "react-helmet";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const EditService = ({ onUpdate }) => {
  const { serviceId } = useParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [category, setCategory] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const serviceData = await fetchServiceById(serviceId);
        setFirstName(serviceData.providerFirstName);
        setLastName(serviceData.providerLastName);
        setServiceName(serviceData.name);
        setCategory(serviceData.category);
        setDescription(serviceData.description);
        setPrice(serviceData.price);

        // Map availability to get time slots for all dates
        const availableSlots = serviceData.availability.map((avail) => ({
          date: avail.date.split("T")[0],
          slots: avail.slots,
        }));
        setTimeSlots(availableSlots);
      } catch (error) {
        console.error("Failed to fetch service details:", error);
      }
    };

    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  // Speech recognition for input fields
  const handleVoiceInput = (setFieldValue, type) => {
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;

      if (type === "date") {
        const normalizedText = spokenText.replace(/(\d+)(st|nd|rd|th)/, "$1");

        const spokenDate = new Date(normalizedText);

        if (!isNaN(spokenDate)) {
          setFieldValue(spokenDate.toISOString().split("T")[0]);
        } else {
          const utterance = new SpeechSynthesisUtterance(
            "Could not understand the date. Please try again."
          );
          window.speechSynthesis.speak(utterance);
        }
      } else if (type === "time") {
        const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i;
        let spokenTime = spokenText.replace(/a.m./, "AM").replace(/p.m./, "PM");

        const match = spokenTime.match(timeRegex);
        if (match) {
          const [hours, minutes, period] = match;
          let adjustedHours = parseInt(hours, 10);
          if (period?.toUpperCase() === "PM" && adjustedHours < 12) {
            adjustedHours += 12;
          } else if (period?.toUpperCase() === "AM" && adjustedHours === 12) {
            adjustedHours = 0;
          }
          setFieldValue(`${String(adjustedHours).padStart(2, "0")}:${minutes}`);
        } else {
          const utterance = new SpeechSynthesisUtterance(
            "Could not understand the time. Please try again."
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

  const validateTimeSlot = (date, start, end) => {
    if (!date || !start || !end) return "Date and times must be provided.";

    const startDateTime = new Date(`${date}T${start}`);
    const endDateTime = new Date(`${date}T${end}`);
    const duration = (endDateTime - startDateTime) / (1000 * 60);

    if (duration < 30) return "Time slots must be at least 30 minutes long.";

    const selectedDaySlots =
      timeSlots.find((slot) => slot.date === date)?.slots || [];

    for (const slot of selectedDaySlots) {
      if (
        (start >= slot.startTime && start < slot.endTime) ||
        (end > slot.startTime && end <= slot.endTime) ||
        (start <= slot.startTime && end >= slot.endTime)
      ) {
        return "Time slots cannot overlap.";
      }
    }

    return null;
  };

  const handleAddTimeSlot = () => {
    const error = validateTimeSlot(date, startTime, endTime);
    if (error) {
      setErrors({ ...errors, timeSlot: error });
      return;
    }

    const updatedTimeSlots = [...timeSlots];
    const dayIndex = updatedTimeSlots.findIndex((slot) => slot.date === date);

    if (dayIndex > -1) {
      updatedTimeSlots[dayIndex].slots.push({ startTime, endTime });
    } else {
      updatedTimeSlots.push({ date, slots: [{ startTime, endTime }] });
    }

    setTimeSlots(updatedTimeSlots);
    setErrors({ ...errors, timeSlot: null });
    setStartTime("");
    setEndTime("");
  };

  const handleRemoveTimeSlot = (date, slotIndex) => {
    const updatedTimeSlots = timeSlots.map((slot) => {
      if (slot.date === date) {
        const updatedSlots = slot.slots.filter(
          (_, index) => index !== slotIndex
        );
        return { ...slot, slots: updatedSlots };
      }
      return slot;
    });

    setTimeSlots(updatedTimeSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!firstName) validationErrors.firstName = "First name is required.";
    if (!lastName) validationErrors.lastName = "Last name is required.";
    if (!serviceName)
      validationErrors.serviceName = "Service name is required.";
    if (!category) validationErrors.category = "Please select a category.";
    if (!description) validationErrors.description = "Description is required.";
    if (price === "") validationErrors.price = "Price is required.";
    if (price < 0) validationErrors.price = "Price cannot be negative.";
    if (isNaN(price)) validationErrors.price = "Price must be a number.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedServiceData = {
      firstName,
      lastName,
      name: serviceName,
      category,
      description,
      availability: timeSlots,
      price: parseFloat(price),
    };

    try {
      await updateService(serviceId, updatedServiceData);
      onUpdate(updatedServiceData);
      setSuccessMessage("Service updated successfully!");
    } catch (error) {
      console.error("Failed to update service:", error);
      setErrors({
        ...errors,
        submit: "Failed to update service. Please try again.",
      });
    }

    // Reset fields after submission
    setFirstName("");
    setLastName("");
    setServiceName("");
    setDescription("");
    setDate("");
    setTimeSlots([]);
    setStartTime("");
    setEndTime("");
    setPrice("");
    setErrors({});
  };

  return (
    <div className="EditServiceForm-container">
      <Helmet>
        <title>Edit Service | AppointMe</title>
        <meta
          name="description"
          content="Manage services details like category, description along with date and time efficiently."
        />
        <meta
          name="keywords"
          content="edit services, service categories, edit date and time slots"
        />
      </Helmet>

      <form onSubmit={handleSubmit}>
        <h2>Edit Service Details</h2>

        {/* First Name Field */}
        <label className="BS-label" htmlFor="firstName">
          First Name
        </label>
        <div className="EditServiceForm-formGroup">
          <input
            type="text"
            id="firstName"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`EditServiceForm-input ${
              errors.firstName ? "is-invalid" : ""
            }`}
            required
          />
          <button
            type="button"
            className="EditServiceForm-voiceButton"
            onClick={() => handleVoiceInput(setFirstName)}
          >
            🎤
          </button>
          {errors.firstName && (
            <div className="EditServiceForm-errorMessage">
              {errors.firstName}
            </div>
          )}
        </div>

        {/* Last Name Field */}
        <label className="BS-label" htmlFor="lastName">
          Last Name
        </label>
        <div className="EditServiceForm-formGroup">
          <input
            type="text"
            id="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`EditServiceForm-input ${
              errors.lastName ? "is-invalid" : ""
            }`}
            required
          />
          <button
            type="button"
            className="EditServiceForm-voiceButton"
            onClick={() => handleVoiceInput(setLastName)}
          >
            🎤
          </button>
          {errors.lastName && (
            <div className="EditServiceForm-errorMessage">
              {errors.lastName}
            </div>
          )}
        </div>

        {/* Service Name Field */}
        <label className="BS-label" htmlFor="serviceName">
          Service Name
        </label>
        <div className="EditServiceForm-formGroup">
          <input
            type="text"
            id="serviceName"
            placeholder="Service Name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className={`EditServiceForm-input ${
              errors.serviceName ? "is-invalid" : ""
            }`}
            required
          />
          <button
            type="button"
            className="EditServiceForm-voiceButton"
            onClick={() => handleVoiceInput(setServiceName)}
          >
            🎤
          </button>
          {errors.serviceName && (
            <div className="EditServiceForm-errorMessage">
              {errors.serviceName}
            </div>
          )}
        </div>

        <label className="BS-label" htmlFor="category">
          Category
        </label>
        <div className="CreateServiceForm-formGroup">
          <select
            id="category"
            className={`CreateServiceForm-textarea ${
              errors.category ? "is-invalid" : ""
            }`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="technology">Technology</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>
          <button
            type="button"
            className="CreateServiceForm-voiceButton voiceButton-Category"
            onClick={() =>
              handleVoiceInput(setCategory, "category", [
                "Health",
                "Education",
                "Technology",
                "Entertainment",
                "Other",
              ])
            }
          >
            🎤
          </button>
          {errors.category && (
            <div className="CreateServiceForm-errorMessage">
              {errors.category}
            </div>
          )}
        </div>

        {/* Description Field */}
        <label className="BS-label" htmlFor="description">
          Description
        </label>
        <div className="EditServiceForm-formGroup">
          <textarea
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`EditServiceForm-textarea ${
              errors.description ? "is-invalid" : ""
            }`}
            required
          />
          <button
            type="button"
            className="EditServiceForm-voiceButton"
            onClick={() => handleVoiceInput(setDescription)}
          >
            🎤
          </button>
          {errors.description && (
            <div className="EditServiceForm-errorMessage">
              {errors.description}
            </div>
          )}
        </div>

        {/* Date Field */}
        <label className="BS-label" htmlFor="date">
          Date
        </label>
        <div className="EditServiceForm-formGroup">
          <input
            type="date"
            id="date"
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`EditServiceForm-input ${
              errors.date ? "is-invalid" : ""
            }`}
            required
          />
          <button
            type="button"
            className="EditServiceForm-voiceButton voiceButton-date"
            onClick={() => handleVoiceInput(setDate, "date")}
          >
            🎤
          </button>
          {errors.date && (
            <div className="EditServiceForm-errorMessage">{errors.date}</div>
          )}
        </div>

        {/* Time Slots */}
        <div className="EditServiceForm-timeSlotContainer">
          <div className="EditServiceForm-timeInput">
            <label htmlFor="startTime">Start Time</label>
            <div className="EditServiceForm-formGroup">
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="EditServiceForm-input"
              />
              <button
                type="button"
                className="EditServiceForm-voiceButton"
                onClick={() => handleVoiceInput(setStartTime, "time")}
              >
                🎤
              </button>
            </div>
          </div>
          <div className="EditServiceForm-timeInput">
            <label htmlFor="endTime">End Time</label>
            <div className="EditServiceForm-formGroup">
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="EditServiceForm-input"
              />
              <button
                type="button"
                className="EditServiceForm-voiceButton"
                onClick={() => handleVoiceInput(setEndTime, "time")}
              >
                🎤
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddTimeSlot}
            className="EditServiceForm-button"
          >
            Add Time Slot
          </button>
        </div>

        {timeSlots.map((slot) => (
          <div key={slot.date}>
            <h4>Date: {slot.date}</h4>
            <ul className="EditServiceForm-timeSlotList">
              {slot.slots.map((timeSlot, index) => (
                <li className="EditServiceForm-timeSlotItem" key={index}>
                  {timeSlot.startTime} - {timeSlot.endTime} (
                  {timeSlot.status || "Available"})
                  <button
                    className="EditServiceForm-removeTimeSlotButton"
                    onClick={() => handleRemoveTimeSlot(slot.date, index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Price Field */}
        <label className="BS-label" htmlFor="price">
          Price
        </label>
        <div className="EditServiceForm-formGroup">
          <input
            type="number"
            id="price"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`EditServiceForm-input ${
              errors.price ? "is-invalid" : ""
            }`}
            required
          />
          <button
            type="button"
            className="EditServiceForm-voiceButton"
            onClick={() => handleVoiceInput(setPrice)}
          >
            🎤
          </button>
          {errors.price && (
            <div className="EditServiceForm-errorMessage">{errors.price}</div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="EditServiceForm-button">
          Update Service
        </button>
        {successMessage && (
          <div className="EditServiceForm-successMessage">{successMessage}</div>
        )}
        {errors.submit && (
          <div className="EditServiceForm-errorMessage">{errors.submit}</div>
        )}
      </form>
    </div>
  );
};

export default EditService;
