const Contact = require("../models/Contact");

// Handle contact form submission
exports.submitContactForm = async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  try {
    // Create a new contact document
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    // Save the contact message to the database
    await newContact.save();

    // Respond with success message immediately
    res.status(201).json({ message: "Contact form submitted successfully!" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ error: "Failed to submit contact form" });
  }
};
