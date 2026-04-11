const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Message = require("../models/Message"); //imports model

//add: likes feature

//reads all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//reads by id (route logic is essential for update and delete)
router.get("/:_id", async (req, res) => {
  try {
    const messages = await Message.findById(req.params._id);

    if (!messages) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//create a message
router.post("/", async (req, res) => {
  try {
    const message = await Message.create({ ...req.body, author_username: req.user.username });
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//edit a message
router.put("/:_id", async (req, res) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params._id, //If :_id, it's req.params._id, otherwise is req.body._id
      req.body,
      {
        new: true,
      },
    );

    if (!updatedMessage) {
      res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json(updatedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//deletes a message
router.delete("/:_id", async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params._id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
