const express = require("express");
const router = express.Router();
const { getAppointmentRequests, getUpcomingAppointments, acceptAppointment, rejectAppointment } = require("../controllers/appointmentController");

// GET all appointment requests (only for logged-in service providers)
router.get("/requests", getAppointmentRequests);

// GET upcoming appointments (only for logged-in service providers)
router.get("/upcoming", getUpcomingAppointments);

// PUT call for accepting appointment requests (only for logged-in service providers)
router.put("/requests/accept", acceptAppointment);

// PUT call for rejecting appointment requests (only for logged-in service providers)
router.put("/requests/reject", rejectAppointment);

module.exports = router;