const express = require('express');
const router = express.Router();
const { getUserPlaylists } = require('../controllers/get-playlist-controller.js');

// Define route for fetching user playlists
router.get('/:userId/playlists', getUserPlaylists);

module.exports = router;

