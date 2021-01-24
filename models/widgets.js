const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: String,
  tagline: String,
  description: String, // allow markdown
  apiUrl: String,
  apiKey: String,
  refreshRate: Number,
  // author
}, {
  timestamps: true, // creates createdAt and updatedAt
});


const Model = mongoose.model('widgets', Schema);
module.exports = Model;
