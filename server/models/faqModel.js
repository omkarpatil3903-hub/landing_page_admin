const mongoose = require("mongoose");
const faqItemSchema = new mongoose.Schema({
  question: String,
  answer: String,
});
const faqSchema = new mongoose.Schema({
  items: [faqItemSchema],
});
module.exports = mongoose.model("Faq", faqSchema, "faq");
