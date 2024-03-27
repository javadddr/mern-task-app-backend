const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const messageRoutes = require('./routes/messageRoutes');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Ensure this path matches your project structure

const app = express(); // Define the app before using it to create the server

const server = http.createServer(app); // Use app to create the server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://mern-task-appjavad.onrender.com"],
    methods: ["GET", "POST"],
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message); // Emit the message to all connected clients
  });
});

app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(messageRoutes);

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB:', err));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Use server.listen instead of app.listen
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
