const User = require("../models/User");
const Service = require("../models/Service");

// Controller to fetch services with associated user images
const getServicesWithUserImage = async (req, res) => {
  try {
    const services = await Service.find().populate(
      "provider",
      "userImage firstName lastName"
    );
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};
