const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load .env values
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route (to verify backend works)
app.get('/', (req, res) => {
    res.send('DoDeck Backend is working!');
});

// Routes (you'll create these files later)
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/tasks'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected!');
        app.listen(process.env.PORT, () =>
            console.log(`Server running on http://localhost:${process.env.PORT}...`)
        );
    })
    .catch(err => console.error(err));
