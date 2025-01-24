// routes/playback-state-route.js

const express = require('express');
const { getPlaybackState, getCurrentlyPlayingTrack, playTrackOrAlbum, pausePlayback } = require('../controllers/playback-state-controller.js');

const router = express.Router();

// Route to get the playback state
router.get('/playback-state', getPlaybackState);
router.get('/current-track', getCurrentlyPlayingTrack)
router.put('/resume', playTrackOrAlbum)
router.put('/pause', pausePlayback)

module.exports = router;

