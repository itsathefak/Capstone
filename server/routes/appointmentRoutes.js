const express = require("express");
const router = express.Router();
const { getAppointmentRequests, getUpcomingAppointments, acceptAppointment, rejectAppointment, getAppointmentHistory } = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");

// GET all appointment requests (only for logged-in service providers)
router.get("/requests", protect, getAppointmentRequests);

// GET upcoming appointments (only for logged-in service providers)
router.get("/upcoming", protect, getUpcomingAppointments);

// PUT call for accepting appointment requests (only for logged-in service providers)
router.put("/requests/accept", protect, acceptAppointment);

// PUT call for rejecting appointment requests (only for logged-in service providers)
router.put("/requests/reject", protect, rejectAppointment);

// GET appointment history (only for logged-in service providers)
router.get("/history", protect, getAppointmentHistory);

module.exports = router;