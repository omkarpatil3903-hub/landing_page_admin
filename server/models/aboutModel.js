const mongoose = require("mongoose");
const journeyStepSchema = new mongoose.Schema({
  icon: String,
  title: String,
  desc: String,
});
const aboutSchema = new mongoose.Schema({
  subtitle: String,
  title: String,
  description: String,
  journey: [journeyStepSchema],
});
module.exports = mongoose.model("About", aboutSchema);
