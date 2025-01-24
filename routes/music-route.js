// routes/playback-state-route.js

const express = require('express');
const mediaControl = require('../controllers/music-controller.js');

const router = express.Router();

// Route to get the playback state
router.get('/:userId/playlists', mediaControl.getUserPlaylists);
router.get('/playback-state', mediaControl.getPlaybackState);
router.get('/current-track', mediaControl.getCurrentlyPlayingTrack);

router.put('/resume', mediaControl.playTrackOrAlbum);
router.put('/pause', mediaControl.pausePlayback);

router.post('/next', mediaControl.skipToNextTrack);
router.post('/previous', mediaControl.skipToPrevious);

module.exports = router;
