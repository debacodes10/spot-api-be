// routes/playback-state-route.js

const express = require('express');
const mediaControl = require('../controllers/music-controller.js');

const router = express.Router();

// Route to get the playback state
router.get('/:userId/playlists', mediaControl.getUserPlaylists);
router.get('/playback-state', mediaControl.getPlaybackState);
router.get('/current-track', mediaControl.getCurrentlyPlayingTrack);
router.get('/queue', mediaControl.getQueue);
router.get('/track-search', mediaControl.searchSong);

router.put('/resume', mediaControl.playTrackOrAlbum);
router.put('/pause', mediaControl.pausePlayback);
router.put('/set-volume', mediaControl.setPlaybackVolume);
router.put('/seek', mediaControl.seekTrackPosition)

router.post('/next', mediaControl.skipToNextTrack);
router.post('/previous', mediaControl.skipToPrevious);

module.exports = router;

