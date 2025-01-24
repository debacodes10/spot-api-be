const express = require('express');
const authController = require('../controllers/auth-controller');

const router = express.Router();

// Routes for Spotify authentication
router.get('/login', authController.login);
router.get('/callback', authController.callback);

module.exports = router;

