const multer = require('multer');
const express = require('express');
const Message = require('../models/Message'); // Adjust the path as necessary
const verifyToken = require('../authMiddleware'); // Ensure the path to your authMiddleware is correct

const router = express.Router();

// Route to send a new message
router.post('/messages', verifyToken, async (req, res) => {
  try {
    const { from, to, text, pic } = req.body;
    const newMessage = new Message({
      from,
      to,
      text,
      pic
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
// Route to get messages between two users
router.get('/messages/:user1Id/:user2Id', verifyToken, async (req, res) => {
  const { user1Id, user2Id } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { from: user1Id, to: user2Id },
        { from: user2Id, to: user1Id }
      ]
    }).sort({ date: 1 }); // Sort by date in ascending order

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching messages");
  }
});

module.exports = router;
