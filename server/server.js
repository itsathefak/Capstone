const express = require("express");
const connectDB = require("./config/db");
const servicesRoutes = require("./routes/serviceRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());

app.use(express.json()); // Parse JSON requests

// Basic root route to check server status
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Use services route
app.use("/services", servicesRoutes);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
