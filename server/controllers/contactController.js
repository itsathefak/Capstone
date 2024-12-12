const Contact = require("../models/Contact");
const {
  sendContactConfirmationEmail,
} = require("../utils/contactEmailService");

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

    // Send a confirmation email in the background
    sendContactConfirmationEmail({ firstName, lastName, email, message }).catch(
      (error) => console.error("Error sending confirmation email:", error)
    );
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ error: "Failed to submit contact form" });
  }
};

// Fetch all contact form submissions for the admin panel
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json({ contacts });
  } catch (error) {
    console.error("Error fetching contact forms:", error);
    res.status(500).json({ error: "Failed to fetch contact forms" });
  }
};
