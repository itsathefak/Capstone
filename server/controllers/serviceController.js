const Service = require("../models/Service");
const User = require("../models/User");
const { validationResult } = require("express-validator");

// Create a new service
const createService = async (req, res) => {
  console.log("Received request:", req.body);

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Validation error", errors: errors.array() });
  }

  try {
    const { serviceName, category, description, price, timeSlots } = req.body;

    // Ensure provider ID is available
    const providerId = req.user._id;

    if (!providerId) {
      return res.status(400).json({ message: "Provider ID is required" });
    }

    // Fetch the provider's details
    const providerDetails = await User.findById(providerId);
    if (!providerDetails) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const newService = new Service({
      name: serviceName,
      description,
      category,
      price: Number(price),
      provider: providerId,
      providerFirstName: providerDetails.firstName,
      providerLastName: providerDetails.lastName,
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

    // Create a simplified service object for the response
    const serviceResponse = {
      id: newService._id,
      name: newService.name,
      description: newService.description,
      category: newService.category,
      price: newService.price,
      provider: {
        id: newService.provider,
        firstName: newService.providerFirstName,
        lastName: newService.providerLastName,
      },
      availability: newService.availability.map((availability) => ({
        date: availability.date,
        slots: availability.slots.map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: slot.status,
        })),
      })),
    };

    res.status(201).json({
      message: "Service created successfully",
      service: serviceResponse,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res
      .status(500)
      .json({ message: "Error creating service", error: error.message });
  }
};

// Fetch services for logged-in provider
const getServicesByProvider = async (req, res) => {
  const { providerId } = req.query;

  if (!providerId) {
    return res.status(400).json({ error: "Provider ID is required" });
  }

  try {
    // Fetch services from the database using the correct field
    const services = await Service.find({ provider: providerId }).populate(
      "provider",
      "firstName lastName"
    );

    // Log the services for debugging
    console.log("Fetched services:", services);

    return res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ error: "Failed to fetch services" });
  }
};

// Fetch a single service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "provider",
      "firstName lastName"
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service by ID:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a service
const updateService = async (req, res) => {
  const { serviceId } = req.params;
  const updatedData = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      updatedData,
      { new: true, runValidators: true }
    ).populate("provider", "firstName lastName");
    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createService,
  getServicesByProvider,
  getServiceById,
  updateService,
};
