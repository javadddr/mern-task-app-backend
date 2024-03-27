const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app); // Create an HTTP server instance
const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "https://mern-task-app-backend-ks55.onrender.com"], // Update this to match your actual client's URL
      methods: ["GET", "POST"],
    },
  });
  

app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(messageRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected: ' + socket.id);
    });

    // Listen for sendMessage event from clients
    socket.on('sendMessage', (message) => {
        // Broadcast message to all clients
        io.emit('receiveMessage', message);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => { // Make sure to change `app.listen` to `server.listen`
    console.log(`Server is running on port ${PORT}`);
});
