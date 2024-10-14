const express = require("express");
const router = express.Router();
const {
  createService,
  getServicesByProvider,
  updateService,
  getServiceById,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

// POST route to create a service
router.post(
  "/create",
  protect,
  (req, res, next) => {
    console.log("Incoming request to /create:", req.body); // For debugging
    next();
  },
  createService
);

// GET route to fetch services by provider
router.get("/", protect, getServicesByProvider);

// GET route to fetch a service by ID
router.get("/:id", protect, getServiceById);

// Update Service Route
router.put("/:serviceId", protect, updateService);

module.exports = router;
