const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Appointment = require("../models/Appointment");
const Service = require("../models/Service");
const emailService = require("../utils/emailService");

exports.bookService = async (req, res) => {
  const {
    serviceId,
    selectedDate,
    selectedTime,
    note,
    firstName,
    lastName,
    email,
    paymentIntentId,
  } = req.body;

  try {
    const customerId = req.user._id;

    console.log("Payload received:", req.body);

    // Validate payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment verification failed." });
    }

    // Find the service by ID
    const service = await Service.findById(serviceId).populate(
      "provider",
      "firstName lastName"
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    const providerId = service.provider._id;
    const providerName = `${service.provider.firstName} ${service.provider.lastName}`;

    // Check for slot availability
    const availability = service.availability.find(
      (avail) =>
        new Date(avail.date).toISOString().split("T")[0] === selectedDate
    );

    if (!availability) {
      return res
        .status(400)
        .json({ message: "No availability for the selected date." });
    }

    if (!selectedTime || !selectedTime.includes("-")) {
      return res.status(400).json({ message: "Invalid selected time format." });
    }

    const [startTime, endTime] = selectedTime.split("-");
    const slot = availability.slots.find(
      (slot) =>
        slot.startTime === startTime &&
        slot.endTime === endTime &&
        slot.status === "Available"
    );

    if (!slot) {
      console.log("Available slots:", availability.slots); // Debugging log
      console.log("Selected timeslot:", { startTime, endTime }); // Debugging log
      return res
        .status(400)
        .json({ message: "Selected time slot is not available." });
    }

    // Atomic update for slot status
    const updatedService = await Service.findOneAndUpdate(
      {
        _id: serviceId,
        "availability.date": selectedDate,
        "availability.slots._id": slot._id,
        "availability.slots.status": "Available",
      },
      {
        $set: { "availability.$[date].slots.$[slot].status": "Booked" },
      },
      {
        arrayFilters: [{ "date.date": selectedDate }, { "slot._id": slot._id }],
        new: true,
      }
    );

    if (!updatedService) {
      return res
        .status(400)
        .json({ message: "Selected time slot is not available." });
    }

    // Create a new appointment
    const appointment = new Appointment({
      customerId,
      providerId,
      serviceId,
      date: selectedDate,
      startTime,
      endTime,
      status: "Pending",
      price: service.price,
      comments: note,
      paymentIntentId,
    });

    await appointment.save();

    // Send confirmation email
    await emailService.sendConfirmationEmail({
      email,
      firstName,
      lastName,
      serviceName: service.name,
      providerName,
      date: selectedDate,
      startTime,
      endTime,
      note,
      price: service.price,
      status: "Pending",
    });

    return res.status(201).json({
      message: "Booking request sent successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Error booking service:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.createPaymentIntent = async (req, res) => {
  const { amount, paymentType } = req.body; // `paymentType` identifies "booking" or "creation"

  try {
    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount provided." });
    }

    if (!paymentType || !["booking", "creation"].includes(paymentType)) {
      return res
        .status(400)
        .json({ message: "Invalid payment type provided." });
    }

    // Stripe requires amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      payment_method_types: ["card"],
    });

    return res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      paymentType, // Include payment type for clarity
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({
      message: "Internal server error while creating payment intent.",
    });
  }
};
