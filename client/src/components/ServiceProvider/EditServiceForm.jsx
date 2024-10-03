import React, { useState, useEffect } from "react";

const EditService = ({ serviceData, onUpdate }) => {
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

  useEffect(() => {
    if (serviceData) {
      setFirstName(serviceData.firstName);
      setLastName(serviceData.lastName);
      setServiceName(serviceData.serviceName);
      setDescription(serviceData.description);
      setDate(serviceData.date);
      setTimeSlots(serviceData.timeSlots);
      setPrice(serviceData.price);
    }
  }, [serviceData]);

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
    setStartTime("");
    setEndTime("");
  };

  const handleRemoveTimeSlot = (index) => {
    const newTimeSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(newTimeSlots);
  };

  // Handle form submission
  const handleSubmit = (e) => {
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
    if (isNaN(price)) validationErrors.price = "Price must be a number.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedServiceData = {
      firstName,
      lastName,
      serviceName,
      description,
      date,
      timeSlots,
      price: parseFloat(price),
    };
    console.log("Updated Service Data:", updatedServiceData);

    onUpdate(updatedServiceData);

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
    setSuccessMessage("Service updated successfully!");
  };

  return (
    <div className="EditServiceForm-container">
      <form onSubmit={handleSubmit}>
        <h2>Edit Service Details</h2>
        <div className="EditServiceForm-formGroup">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`EditServiceForm-input ${
              errors.firstName ? "is-invalid" : ""
            }`}
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
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`EditServiceForm-input ${
              errors.lastName ? "is-invalid" : ""
            }`}
            required
          />
          {errors.lastName && (
            <div className="EditServiceForm-errorMessage">
              {errors.lastName}
            </div>
          )}
        </div>
        <div className="EditServiceForm-formGroup">
          <input
            type="text"
            placeholder="Service Name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className={`EditServiceForm-input ${
              errors.serviceName ? "is-invalid" : ""
            }`}
            required
          />
          {errors.serviceName && (
            <div className="EditServiceForm-errorMessage">
              {errors.serviceName}
            </div>
          )}
        </div>
        <div className="EditServiceForm-formGroup">
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`EditServiceForm-textarea ${
              errors.description ? "is-invalid" : ""
            }`}
            required
          />
          {errors.description && (
            <div className="EditServiceForm-errorMessage">
              {errors.description}
            </div>
          )}
        </div>
        <div className="EditServiceForm-formGroup">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`EditServiceForm-input ${
              errors.date ? "is-invalid" : ""
            }`}
            required
          />
          {errors.date && (
            <div className="EditServiceForm-errorMessage">{errors.date}</div>
          )}
        </div>
        <div className="EditServiceForm-timeSlotContainer">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="EditServiceForm-input"
            required={!!date}
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="EditServiceForm-input"
            required={!!date}
          />
          <button
            type="button"
            onClick={handleAddTimeSlot}
            className="EditServiceForm-button"
            disabled={!date}
          >
            Add Time Slot
          </button>
          {errors.timeSlot && (
            <div className="EditServiceForm-errorMessage">
              {errors.timeSlot}
            </div>
          )}
        </div>
        {date && <h3>Time Slots for {date}</h3>}
        <ul className="EditServiceForm-timeSlotList">
          {timeSlots
            .filter((slot) => slot.date === date)
            .map((slot, index) => (
              <li key={index} className="EditServiceForm-timeSlotItem">
                {slot.start} - {slot.end}
                <button
                  type="button"
                  onClick={() => handleRemoveTimeSlot(index)}
                  className="EditServiceForm-removeTimeSlotButton"
                >
                  Remove
                </button>
              </li>
            ))}
        </ul>
        <div className="EditServiceForm-formGroup">
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`EditServiceForm-input ${
              errors.price ? "is-invalid" : ""
            }`}
            required
          />
          {errors.price && (
            <div className="EditServiceForm-errorMessage">{errors.price}</div>
          )}
        </div>
        <button type="submit" className="EditServiceForm-button">
          Update Service
        </button>
        {successMessage && (
          <div style={{ color: "green" }}>{successMessage}</div>
        )}
      </form>
    </div>
  );
};

export default EditService;
