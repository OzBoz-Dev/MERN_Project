const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String },
    body: { type: String },
    likes: [{ type: String }],
    array_tags: [{ type: String, ref: "Tag" }],
    author_username: { type: String, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
