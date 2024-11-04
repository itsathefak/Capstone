const Appointment = require("../models/Appointment");
const Service = require("../models/Service");
const emailService = require("../utils/emailService");

// Book a service
exports.bookService = async (req, res) => {
  const {
    serviceId,
    date,
    startTime,
    endTime,
    note,
    firstName,
    lastName,
    email,
  } = req.body;

  try {
    const customerId = req.user._id;

    // Find the service by ID to get the provider's information
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    // Check for slot availability
    const availability = service.availability.find((avail) => {
      return (
        avail.date.toISOString().split("T")[0] ===
        new Date(date).toISOString().split("T")[0]
      );
    });

    if (!availability) {
      return res
        .status(400)
        .json({ message: "No availability for the selected date." });
    }

    const slot = availability.slots.find((slot) => {
      return (
        slot.startTime === startTime &&
        slot.endTime === endTime &&
        slot.status === "Available"
      );
    });

    if (!slot) {
      return res
        .status(400)
        .json({ message: "Selected time slot is not available." });
    }

    // Create a new appointment using provided names and details
    const appointment = new Appointment({
      customerId: customerId,
      providerId: service.provider,
      serviceId: serviceId,
      date: date,
      startTime: startTime,
      endTime: endTime,
      note: note,
      status: "Pending",
      price: service.price,
      firstName: firstName,
      lastName: lastName,
      email: email,
    });

    await appointment.save();

    // Update the slot status to "Booked"
    slot.status = "Booked";
    await service.save();

    // Send confirmation email to the provided email address
    await emailService.sendConfirmationEmail({
      email: email,
      firstName: firstName,
      lastName: lastName,
      serviceId: serviceId,
      date: date,
      startTime: startTime,
      endTime: endTime,
      note: note,
      price: service.price,
      serviceName: service.name,
      providerName: service.providerName,
      status: "Pending"
    });

    return res
      .status(201)
      .json({ message: "Booking request sent successfully.", appointment });
  } catch (error) {
    console.error("Error booking service:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
