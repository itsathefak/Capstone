const express = require("express");
const router = express.Router();
const {
  submitContactForm,
  getAllContacts,
} = require("../controllers/contactController");

// Route to submit contact form
router.post("/", submitContactForm);

// Route to fetch all contact submissions for the admin panel
router.get("/admin/contacts", getAllContacts);

module.exports = router;
