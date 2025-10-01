const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import your routes file
const contentRoutes = require("./routes/contentRoutes");

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5001;

// --- Middlewares (Setup) ---
app.use(cors());
app.use(express.json());

// This makes the 'public' folder accessible to the browser.
app.use(express.static("public"));

// --- Database Connection ---
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- API Routes ---
// Tell Express to use your routes for any URL that starts with /api/content
app.use("/api/content", contentRoutes);

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
