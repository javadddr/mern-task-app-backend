require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const messageRoutes = require('./routes/messageRoutes');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Ensure this path matches your project structure

const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors({
    origin:["http://localhost:3000","https://mern-task-app.onrender.com"]
}));

// Middleware to parse JSON
app.use(express.json());

// Use user routes
app.use(userRoutes);
app.use(messageRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB:', err));

// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Listen on a port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
