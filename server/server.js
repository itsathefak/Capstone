const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const servicesRoutes = require("./routes/serviceRoutes");
const registerUser = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userServiceRoutes = require("./routes/userServiceRoutes");
const contactRoutes = require("./routes/contactRoutes");
const generateSitemap = require("./utils/sitemapGenerator");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Scheduler for updating completed appointments
require("./schedulers/completedAppointment");

const allowedOrigins = [
  "http://localhost:3000",
  "https://appointme-rust.vercel.app",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON requests
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Basic root route to check server status
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Test route to check cookies
app.get("/test-cookies", (req, res) => {
  console.log(req.cookies);
  res.send("Check the console for cookies.");
});

// Register Routes
app.use("/user", registerUser);
app.use("/services", servicesRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/userService", userServiceRoutes);
app.use("/contact", contactRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  generateSitemap();
});
