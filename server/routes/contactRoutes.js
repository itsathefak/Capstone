const express = require("express");
const router = express.Router();
const { submitContactForm } = require("../controllers/contactController");

// Route to submit contact form
router.post("/", submitContactForm);

module.exports = router;
