const mongoose = require('mongoose');

const { ObjectId } = mongoose.SchemaTypes;

const Schema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  avatar: { type: String, default: 'https://cdn.monitoring.app/avatars/default.png' },
}, {
  timestamps: true, // creates createdAt and updatedAt
});


const Model = mongoose.model('users', Schema);
module.exports = Model;
