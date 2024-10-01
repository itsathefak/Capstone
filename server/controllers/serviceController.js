const Service = require("../models/Service");

// Create a new service
const createService = async (req, res) => {
  console.log("Received request:", req.body); // Log the incoming request
  try {
    const { serviceName, description, price, timeSlots } = req.body;

    const newService = new Service({
      name: serviceName,
      description,
      price: Number(price),
      provider: req.providerId, // Set to null if no provider for now
      availability: timeSlots.map((slot) => ({
        date: slot.date,
        slots: [
          {
            startTime: slot.start,
            endTime: slot.end,
            status: "Available",
          },
        ],
      })),
    });

    await newService.save();
    res
      .status(201)
      .json({ message: "Service created successfully", service: newService });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: "Error creating service", error });
  }
};

module.exports = {
  createService,
};
