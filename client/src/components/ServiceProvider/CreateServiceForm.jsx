import React, { useState } from "react";
import { createService } from "../../api/services";
import { useAuth } from "../../utils/AuthContext";

const InputField = ({ type, placeholder, value, onChange, error }) => (
  <div className="CreateServiceForm-formGroup">
    <input
      className={`CreateServiceForm-input ${error ? "is-invalid" : ""}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
    {error && <div className="CreateServiceForm-errorMessage">{error}</div>}
  </div>
);

const CreateService = () => {
  const { user } = useAuth(); // Get user info from useAuth hook
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation for time slots
  const validateTimeSlot = (date, start, end) => {
    if (!date || !start || !end) return "Date and times must be provided.";
    const startDateTime = new Date(`${date}T${start}`);
    const endDateTime = new Date(`${date}T${end}`);
    const duration = (endDateTime - startDateTime) / (1000 * 60);
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
      setErrors((prev) => ({ ...prev, timeSlot: error }));
      return;
    }

    const newSlot = { date, start: startTime, end: endTime };
    setTimeSlots((prev) => [...prev, newSlot]);
    setErrors((prev) => ({ ...prev, timeSlot: null }));
  };

  const handleRemoveTimeSlot = (index) => {
    const newTimeSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(newTimeSlots);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
    const priceValue = parseFloat(price);
    if (isNaN(priceValue)) validationErrors.price = "Price is required.";
    if (priceValue < 0) validationErrors.price = "Price cannot be negative.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const serviceData = {
      firstName,
      lastName,
      serviceName,
      description,
      date,
      timeSlots,
      price: priceValue,
    };

    console.log("Submitting service data:", serviceData);

    try {
      await createService(serviceData);
      setSuccessMessage("Service created successfully!");
      console.log("Service Data:", serviceData);

      // Clear form after successful submission
      setFirstName(user?.firstName || "");
      setLastName(user?.lastName || "");
      setServiceName("");
      setDescription("");
      setDate("");
      setTimeSlots([]);
      setStartTime("");
      setEndTime("");
      setPrice("");
      setErrors({});
    } catch (error) {
      console.error("Error creating service:", error);
      setErrors({ submit: "Failed to create service. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="CreateServiceForm-container">
      <form onSubmit={handleSubmit}>
        <h2>Create a Service Now...</h2>
        <InputField
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={errors.firstName}
        />
        <InputField
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={errors.lastName}
        />
        <InputField
          type="text"
          placeholder="Service Name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          error={errors.serviceName}
        />
        <div>
          <textarea
            className={`CreateServiceForm-textarea ${
              errors.description ? "is-invalid" : ""
            }`}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {errors.description && (
            <div className="CreateServiceForm-errorMessage">
              {errors.description}
            </div>
          )}
        </div>
        <InputField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />
        <div className="CreateServiceForm-timeSlotContainer">
          <input
            className="CreateServiceForm-input CreateServiceForm-timeSlotInput"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required={!!date}
          />
          <input
            className="CreateServiceForm-input CreateServiceForm-timeSlotInput"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required={!!date}
          />
          <button
            className="CreateServiceForm-button"
            type="button"
            onClick={handleAddTimeSlot}
            disabled={!date}
          >
            Add Time Slot
          </button>
        </div>
        {errors.timeSlot && (
          <div className="CreateServiceForm-errorMessage">
            {errors.timeSlot}
          </div>
        )}
        {date && <h3>Time Slots for {date}</h3>}
        <ul className="CreateServiceForm-timeSlotList">
          {timeSlots
            .filter((slot) => slot.date === date)
            .map((slot, index) => (
              <li className="CreateServiceForm-timeSlotItem" key={index}>
                {slot.start} - {slot.end}
                <button
                  className="CreateServiceForm-removeTimeSlotButton"
                  type="button"
                  onClick={() => handleRemoveTimeSlot(index)}
                >
                  Remove
                </button>
              </li>
            ))}
        </ul>
        <InputField
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={errors.price}
        />
        <button
          className="CreateServiceForm-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Service"}
        </button>
        {successMessage && (
          <div className="CreateServiceForm-successMessage">
            {successMessage}
          </div>
        )}
        {errors.submit && (
          <div className="CreateServiceForm-errorMessage">{errors.submit}</div>
        )}
      </form>
    </div>
  );
};

export default CreateService;
