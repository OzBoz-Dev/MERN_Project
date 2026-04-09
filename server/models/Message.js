const mongoose = require("mongoose");

//Schema for private messages
const messageSchema = new mongoose.Schema(
    {
      author_username: { type: String },
      content: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
