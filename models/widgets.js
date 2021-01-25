const mongoose = require('mongoose');

const { ObjectId } = mongoose.SchemaTypes;

const Schema = new mongoose.Schema({
  name: String,
  tagline: String,
  icon: String,        // url to cdn
  description: String, // allow markdown
  apiUrl: String,
  apiKey: String,
  refreshRate: Number,
  author: {
    type: ObjectId,
    ref: 'users'
  },
}, {
  timestamps: true, // creates createdAt and updatedAt
});


const Model = mongoose.model('widgets', Schema);
module.exports = Model;
