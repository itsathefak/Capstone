import React, { useState } from "react";
import { createService } from "../../api/services";
import { useAuth } from "../../utils/AuthContext";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const InputField = ({
  type,
  placeholder,
  value,
  onChange,
  error,
  onVoiceInput,
}) => (
  <div className="CreateServiceForm-formGroup">
    <input
      className={`CreateServiceForm-input ${error ? "is-invalid" : ""}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {onVoiceInput && (
      <button
        type="button"
        className="CreateServiceForm-voiceButton"
        onClick={onVoiceInput}
      >
        🎤
      </button>
    )}
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
  const [category, setCategory] = useState("");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
          const [_, hours, minutes, period] = match;
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
      } else if (type === "category") {
        
        const normalizedSpokenText = spokenText.trim().toLowerCase();
        const matchedOption = options.find(
          (category) => {
            return category.toLowerCase() === normalizedSpokenText
          }
        );

        if (matchedOption) {
          setFieldValue(matchedOption.toLowerCase());
        } else {
          const utterance = new SpeechSynthesisUtterance(
            `The spoken category does not match any available options. Please try again.`
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
    if (!category) validationErrors.category = "Please select a category.";

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
      category,
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
        <label className="BS-label" htmlFor="firstName">
          First Name
        </label>
        <InputField
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          onVoiceInput={() => handleVoiceInput(setFirstName)}
          error={errors.firstName}
        />
        <label className="BS-label" htmlFor="lastName">
          Last Name
        </label>

        <InputField
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          onVoiceInput={() => handleVoiceInput(setLastName)}
          error={errors.lastName}
        />

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

        <label className="BS-label" htmlFor="serviceName">
          Service Name
        </label>
        <InputField
          type="text"
          placeholder="Service Name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          onVoiceInput={() => handleVoiceInput(setServiceName)}
          error={errors.serviceName}
        />

        <label className="BS-label" htmlFor="description">
          Description
        </label>
        <div className="CreateServiceForm-formGroup">
          <textarea
            className={`CreateServiceForm-textarea ${
              errors.description ? "is-invalid" : ""
            }`}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="button"
            className="CreateServiceForm-voiceButton"
            onClick={() => handleVoiceInput(setDescription)}
          >
            🎤
          </button>
          {errors.description && (
            <div className="CreateServiceForm-errorMessage">
              {errors.description}
            </div>
          )}
        </div>
        <label className="BS-label" htmlFor="date">
          Select Date
        </label>
        <div className="CreateServiceForm-formGroup">
          <input
            type="date"
            className="dateinput"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            onVoiceInput={() => handleVoiceInput(setDate, "date")}
            error={errors.date}
          />
          <button
            type="button"
            className="CreateServiceForm-voiceButton voiceButton-date"
            onClick={() => handleVoiceInput(setDate, "date")}
          >
            🎤
          </button>
        </div>
        <div className="CreateServiceForm-timeSlotContainer">
          <div className="CreateServiceForm-timeInput">
            <label htmlFor="startTime">Start Time</label>
            <div className="CreateServiceForm-formGroup">
              <input
                className="CreateServiceForm-input CreateServiceForm-timeSlotInput"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <button
                type="button"
                className="CreateServiceForm-voiceButton"
                onClick={() => handleVoiceInput(setStartTime, "time")}
              >
                🎤
              </button>
            </div>
          </div>
          <div className="CreateServiceForm-timeInput">
            <label htmlFor="endTime">End Time</label>
            <div className="CreateServiceForm-formGroup">
              <input
                className="CreateServiceForm-input CreateServiceForm-timeSlotInput"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <button
                type="button"
                className="CreateServiceForm-voiceButton"
                onClick={() => handleVoiceInput(setEndTime, "time")}
              >
                🎤
              </button>
            </div>
          </div>
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

        <label className="BS-label" htmlFor="price">
          Price
        </label>

        <InputField
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onVoiceInput={() => handleVoiceInput(setPrice)}
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
