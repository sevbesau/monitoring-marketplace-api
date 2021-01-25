const mongoose = require('mongoose');

const { ObjectId } = mongoose.SchemaTypes;

const Schema = new mongoose.Schema({
  user: { type: ObjectId, ref: 'users' },
  country: String,
  ua: String,
  isMobile: Boolean,
  version: String,
  browser: String,
  os: String,
  platform: String,
  ip: String,
  active: { type: Boolean, default: true }, // "logout"
  method: String, // EMAIL | FACEBOOK | APPLE | GOOGLE | ...
}, {
  timestamps: true, // creates createdAt and updatedAt
});


const Model = mongoose.model('sessions', Schema);
module.exports = Model;
