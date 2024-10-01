const express = require("express");
const router = express.Router();
const { createService } = require("../controllers/serviceController");

// POST route to create a service
router.post(
  "/create",
  (req, res, next) => {
    console.log("Incoming request to /create:", req.body); // Log incoming request for Debugging
    next();
  },
  createService
);

module.exports = router;
