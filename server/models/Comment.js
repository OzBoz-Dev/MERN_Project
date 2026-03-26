const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  body:           { type: String },
  likes:          { type: String },
  post_id_belong: { type: String }
});

module.exports = mongoose.model('Comment', commentSchema);