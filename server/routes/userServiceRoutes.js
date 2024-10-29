const express = require("express");
const router = express.Router();
const userServiceController = require("../controllers/userServiceController");

// Route to get all services with user image and details
router.get(
  "/services-with-user-image",
  userServiceController.getServicesWithUserImage
);
