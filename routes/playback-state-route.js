// routes/playback-state-route.js

const express = require('express');
const mediaControl = require('../controllers/playback-state-controller.js');

const router = express.Router();

// Route to get the playback state
router.get('/playback-state', mediaControl.getPlaybackState);
router.get('/current-track', mediaControl.getCurrentlyPlayingTrack)
router.put('/resume', mediaControl.playTrackOrAlbum)
router.put('/pause', mediaControl.pausePlayback)

module.exports = router;

