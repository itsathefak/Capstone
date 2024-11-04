const Appointment = require("../models/Appointment");
const User = require("../models/User");
const emailService = require("../utils/emailService");

// find appointments with status pending and populate details of customer
exports.getAppointmentRequests = async (req, res) => {
  try {
    const providerId = req.user._id;

    if (!providerId) {
      return res.status(400).json({ message: "Provider ID is required" });
    }

    const appointmentRequests = await Appointment.find({
      providerId: providerId,
      status: "Pending",
    })
      .populate("customerId", "firstName lastName email")
      .populate("serviceId", "name")
      .sort({ date: 1 })
      .exec();

    const data = appointmentRequests.map((appointment) => ({
      _id: appointment._id,
      userName: `${appointment.customerId.firstName} ${appointment.customerId.lastName}`,
      userEmail: appointment.customerId.email,
      serviceName: appointment.serviceId.name,
      date: appointment.date.toLocaleDateString(),
      timeslot: `${appointment.startTime}-${appointment.endTime}`,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Error reading appointment requests:", error);
    res.status(500).json({
      message: "Failed to read appointment requests",
      details: error.message,
    });
  }
};

// find appointments with status confirmed, date in future and populate details of customer
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const providerId = req.user._id;

    if (!providerId) {
      return res.status(400).json({ message: "Provider ID is required" });
    }

    const currentTime = new Date();

    const upcomingAppointments = await Appointment.find({
      providerId: providerId,
      status: "Confirmed",
      date: { $gt: currentTime },
    })
      .populate("customerId", "firstName lastName email")
      .populate("serviceId", "name")
      .sort({ date: 1 })
      .exec();

    const data = upcomingAppointments.map((appointment) => ({
      _id: appointment._id,
      userName: `${appointment.customerId.firstName} ${appointment.customerId.lastName}`,
      userEmail: appointment.customerId.email,
      serviceName: appointment.serviceId.name,
      date: appointment.date.toLocaleDateString(),
      timeslot: `${appointment.startTime}-${appointment.endTime}`,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Error reading upcoming appointments:", error);
    res.status(500).json({
      message: "Failed to read upcoming appointments",
      details: error.message,
    });
  }
};

// find and update appointments to status confirmed
exports.acceptAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "Confirmed" },
      { new: true }
    )
    .populate("customerId", "firstName lastName email")
    .populate("serviceId", "name")
    .populate("providerId", "firstName lastName");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const customer = appointment.customerId;
    const service = appointment.serviceId;
    const provider = appointment.providerId;

    if (!customer || !service || !provider) {
      return res.status(404).json({ message: "Customer, Service or Provider details not found" });
    }

    // send confirmed email to the provided email address
    await emailService.sendConfirmationEmail({
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      date: appointment.date.toISOString().split("T")[0],
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      price: appointment.price,
      serviceName: service.name,
      providerName: `${provider.firstName} ${provider.lastName}`,
      status: "Confirmed"
    });

    res.status(200).json({ message: "Appointment accepted", appointment });
  } catch (error) {
    console.error("Error accepting the appointment:", error);
    res.status(500).json({
      message: "Failed to accept the appointment",
      details: error.message,
    });
  }
};

// find and update appointments to status rejected
exports.rejectAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "Rejected" },
      { new: true }
    ).populate("customerId", "firstName lastName email")
    .populate("serviceId", "name")
    .populate("providerId", "firstName lastName");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const customer = appointment.customerId;
    const service = appointment.serviceId;
    const provider = appointment.providerId;

    if (!customer || !service || !provider) {
      return res.status(404).json({ message: "Customer, Service or Provider details not found" });
    }

    // send confirmed email to the provided email address
    await emailService.sendConfirmationEmail({
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      date: appointment.date.toISOString().split("T")[0],
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      price: appointment.price,
      serviceName: service.name,
      providerName: `${provider.firstName} ${provider.lastName}`,
      status: "Rejected"
    });

    res.status(200).json({ message: "Appointment rejected", appointment });
  } catch (error) {
    console.error("Error rejecting the appointment:", error);
    res.status(500).json({
      message: "Failed to reject the appointment",
      details: error.message,
    });
  }
};

// find appointments with status completed, past date and populate details of customer
exports.getAppointmentHistory = async (req, res) => {
  try {
    const customerId = req.user._id;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const currentTime = new Date();

    const appointmentHistory = await Appointment.find({
      customerId: customerId,
      status: "Completed",
      date: { $lt: currentTime },
    })
      .populate("serviceId", "name")
      .populate("providerId", "firstName lastName email")
      .sort({ date: -1 })
      .exec();

    const data = appointmentHistory.map((appointment) => ({
      _id: appointment._id,
      serviceName: appointment.serviceId.name,
      providerName: `${appointment.providerId.firstName} ${appointment.providerId.lastName}`,
      providerEmail: appointment.providerId.email,
      date: appointment.date.toLocaleDateString(),
      timeslot: `${appointment.startTime}-${appointment.endTime}`,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Error reading appointment history:", error);
    res.status(500).json({
      message: "Failed to read appointment history",
      details: error.message,
    });
  }
};