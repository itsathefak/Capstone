import React, { useState, useEffect } from "react";
import { updateService } from "../../api/services";

const EditService = ({ service, onCancel }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Populate form with existing service data
  useEffect(() => {
    if (service) {
      setFirstName(service.firstName);
      setLastName(service.lastName);
      setServiceName(service.serviceName);
      setDescription(service.description);
      setDate(service.date);
      setTimeSlots(service.timeSlots || []);
      setPrice(service.price);
    }
  }, [service]);

  // Validation for time slots
  const validateTimeSlot = (date, start, end) => {
    if (!date || !start || !end) return "Date and times must be provided.";

    const startDateTime = new Date(`${date}T${start}`);
    const endDateTime = new Date(`${date}T${end}`);
    const duration = (endDateTime - startDateTime) / (1000 * 60); // duration in minutes

    if (duration < 30) return "Time slots must be at least 30 minutes long.";

    for (const slot of timeSlots) {
      if (slot.date === date) {
        if (
          (start >= slot.start && start < slot.end) ||
          (end > slot.start && end <= slot.end) ||
          (start <= slot.start && end >= slot.end)
        ) {
          return "Time slots cannot overlap.";
        }
      }
    }

    return null;
  };

  // Handle adding time slots
  const handleAddTimeSlot = () => {
    const error = validateTimeSlot(date, startTime, endTime);
    if (error) {
      setErrors({ ...errors, timeSlot: error });
      return;
    }

    const newSlot = { date, start: startTime, end: endTime };
    setTimeSlots([...timeSlots, newSlot]);

    setErrors({ ...errors, timeSlot: null });
  };

  const handleRemoveTimeSlot = (index) => {
    const newTimeSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(newTimeSlots);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for required fields
    const validationErrors = {};
    if (!firstName) validationErrors.firstName = "First name is required.";
    if (!lastName) validationErrors.lastName = "Last name is required.";
    if (!serviceName)
      validationErrors.serviceName = "Service name is required.";
    if (!description) validationErrors.description = "Description is required.";
    if (!date) validationErrors.date = "Date is required.";
    if (timeSlots.length === 0)
      validationErrors.timeSlot = "Please add at least one time slot.";
    if (price === "") validationErrors.price = "Price is required.";
    if (price < 0) validationErrors.price = "Price cannot be negative.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const serviceData = {
      firstName,
      lastName,
      serviceName,
      description,
      date,
      timeSlots,
      price,
    };

    try {
      await updateService(service.id, serviceData); // Passing service ID for updating
      setSuccessMessage("Service updated successfully!");

      // Clear form after successful submission
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
    } catch (error) {
      console.error("Error updating service:", error);
      setErrors({ submit: "Failed to update service. Please try again." });
    }
  };

  return (
    <div className="EditServiceForm-container">
      <form onSubmit={handleSubmit}>
        <h2>Edit Service Details</h2>
        <div className="EditServiceForm-nameContainer">
          <div className="EditServiceForm-formGroup">
            <input
              className={`EditServiceForm-input ${
                errors.firstName ? "is-invalid" : ""
              }`}
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            {errors.firstName && (
              <div className="EditServiceForm-errorMessage">
                {errors.firstName}
              </div>
            )}
          </div>
          <div className="EditServiceForm-formGroup">
            <input
              className={`EditServiceForm-input ${
                errors.lastName ? "is-invalid" : ""
              }`}
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            {errors.lastName && (
              <div className="EditServiceForm-errorMessage">
                {errors.lastName}
              </div>
            )}
          </div>
        </div>

        <div>
          <input
            className={`EditServiceForm-input ${
              errors.serviceName ? "is-invalid" : ""
            }`}
            type="text"
            placeholder="Service Name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
          {errors.serviceName && (
            <div className="EditServiceForm-errorMessage">
              {errors.serviceName}
            </div>
          )}
        </div>

        <div>
          <textarea
            className={`EditServiceForm-textarea ${
              errors.description ? "is-invalid" : ""
            }`}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {errors.description && (
            <div className="EditServiceForm-errorMessage">
              {errors.description}
            </div>
          )}
        </div>

        <div>
          <input
            className={`EditServiceForm-input ${
              errors.date ? "is-invalid" : ""
            }`}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          {errors.date && (
            <div className="EditServiceForm-errorMessage">{errors.date}</div>
          )}
        </div>

        <div className="EditServiceForm-timeSlotContainer">
          <input
            className="EditServiceForm-input EditServiceForm-timeSlotInput"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required={!!date}
          />
          <input
            className="EditServiceForm-input EditServiceForm-timeSlotInput"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required={!!date}
          />
          <button
            className="EditServiceForm-button"
            type="button"
            onClick={handleAddTimeSlot}
            disabled={!date}
          >
            Add Time Slot
          </button>
        </div>

        {errors.timeSlot && (
          <div className="EditServiceForm-errorMessage">{errors.timeSlot}</div>
        )}

        {date && <h3>Time Slots for {date}</h3>}
        <ul className="EditServiceForm-timeSlotList">
          {timeSlots
            .filter((slot) => slot.date === date)
            .map((slot, index) => (
              <li className="EditServiceForm-timeSlotItem" key={index}>
                {slot.start} - {slot.end}
                <button
                  className="EditServiceForm-removeTimeSlotButton"
                  type="button"
                  onClick={() => handleRemoveTimeSlot(index)}
                >
                  Remove
                </button>
              </li>
            ))}
        </ul>

        <div>
          <input
            className={`EditServiceForm-input ${
              errors.price ? "is-invalid" : ""
            }`}
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          {errors.price && (
            <div className="EditServiceForm-errorMessage">{errors.price}</div>
          )}
        </div>

        <button className="EditServiceForm-button" type="submit">
          Update Service
        </button>

        <button
          className="EditServiceForm-button"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>

        {successMessage && (
          <div className="EditServiceForm-successMessage">{successMessage}</div>
        )}
      </form>
    </div>
  );
};

export default EditService;
