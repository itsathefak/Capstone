const Appointment = require("../models/Appointment");
const User = require("../models/User");

// find appointments with status pending and populate details of customer
exports.getAppointmentRequests = async (req, res) => {
  try {
    const appointmentRequests = await Appointment.find({
      providerId: "66f1dcefb52c37be859d0056",
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
    const currentTime = new Date();

    const upcomingAppointments = await Appointment.find({
      providerId: "66f1dcefb52c37be859d0056",
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
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

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
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment rejected", appointment });
  } catch (error) {
    console.error("Error rejecting the appointment:", error);
    res.status(500).json({
      message: "Failed to reject the appointment",
      details: error.message,
    });
  }
};