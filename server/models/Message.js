const mongoose = require("mongoose");

//Schema for private messages
const messageSchema = new mongoose.Schema(
  {
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
