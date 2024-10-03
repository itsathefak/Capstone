const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/userController");

// Register User
router.post(
  "/register",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  registerUser
);

// Login User
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);

module.exports = router;
