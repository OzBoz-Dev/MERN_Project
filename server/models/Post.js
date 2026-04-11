const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    username: { type: String, ref: "User" }, //changed post_id to username
    title: { type: String },
    content: { type: String },
    likes: { type: String },
    array_tags_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
