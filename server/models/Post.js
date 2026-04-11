const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String },
    body: { type: String },
    attachments: { type: String }, //Will store the URL or file path
    likes: [{ type: String }],
    array_tags_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    author_username: { type: String, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);

module.exports = mongoose.model("Post", postSchema);
