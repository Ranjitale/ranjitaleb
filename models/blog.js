const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, required: true }
},{timestamps:true});

module.exports = mongoose.model('Blog', blogSchema);
