require('dotenv').config()

const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth-routes.js');
const playbackRoutes = require("./routes/playback-state-route.js")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing JSON (if needed for other purposes)
app.use(express.json());

// API routes
app.use('/api/spotify', authRoutes);
app.use('/api/playback', playbackRoutes);

// Root endpoint for testing
app.get('/', (req, res) => {
    res.send('Spotify API Backend is running...');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

