const express = require("express");
const router = express.Router();
const Message = require("../models/Message"); //imports model

//reads all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//create a message
router.post("/", async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(200).json(message);
  } catch (err) {
    resizeBy.status(500).json({ error: err.message });
  }
});

//edit a message
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(id, req.body);

    //ensures the updated message is displayed
    //const updatedMessage = await Message.findById(id);

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete a message
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndDelete(id, req.body);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
