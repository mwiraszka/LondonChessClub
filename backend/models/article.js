const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: { type: String, required: true, max: [80, '80-character limit'] },
  subtitle: { type: String, required: true, max: [200, '200-character limit'] },
  headerImage: { type: String, required: true },
  authorUserId: { type: String, required: true, max: [30, '30-character limit'] },
  dateCreated: { type: String, required: true },
  dateEdited: { type: String, required: true },
  body: {
    type: String,
    required: true,
    min: [100, '100-character minimum'],
    max: [5000, '5000-character limit'],
  },
});

module.exports = mongoose.model('Article', articleSchema);
