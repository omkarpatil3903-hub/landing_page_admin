const mongoose = require("mongoose");

const testimonialItemSchema = new mongoose.Schema({
  author: { type: String, required: true },
  location: { type: String },
  quote: { type: String },
  rating: { type: Number },
});

const testimonialSchema = new mongoose.Schema({
  items: [testimonialItemSchema],
});

module.exports = mongoose.model(
  "Testimonial",
  testimonialSchema,
  "testimonials"
);
