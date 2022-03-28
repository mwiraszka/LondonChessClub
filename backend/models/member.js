const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  firstName: { type: String, required: true, max: [30, '30-character limit'] },
  lastName: { type: String, required: true, max: [50, '50-character limit'] },
  city: { type: String, required: true, max: [30, '30-character limit'] },
  phoneNumber: {
    type: String,
    required: false,
    default: null,
    max: [20, '20-character limit'],
  },
  email: { type: String, required: true, max: [50, '50-character limit'] },
  dateJoined: { type: String, required: true },
  rating: { type: Number, required: true, maxlength: [4, '4-digit limit'] },
  peakRating: { type: Number, required: true, maxlength: [4, '4-digit limit'] },
});

module.exports = mongoose.model('Member', memberSchema);
