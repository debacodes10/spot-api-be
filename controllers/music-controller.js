require('dotenv').config()

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const getToken = async () => {
    try {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
            },
            body: 'grant_type=client_credentials',
        });

        const data = await result.json();
        return data.access_token;
    } catch (error) {
        throw new Error('Failed to fetch token: ' + error.message);
    }
};

const getUserPlaylists = async (req, res) => {
    try {
        const token = await getToken();
        const userId = req.params.userId;
        const result = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'GET',
            headers: { Authorization: 'Bearer ' + token },
        });

        const data = await result.json();

        if (result.status !== 200) {
            return res.status(result.status).json({ error: data.error || 'Failed to fetch playlists' });
        }

        res.status(200).json({ playlists: data.items });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred: ' + error.message });
    }
};

const getPlaybackState = async (req, res) => {
    try {
        // Access token should be passed by the user after they authenticate (or via session)
        const token = req.headers['authorization']?.split(' ')[1]; // Using optional chaining for safety

        if (!token) {
            return res.status(400).json({ error: 'Access token is required.' });
        }

        // Spotify API endpoint for the current playback state of the user
        const result = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (result.status !== 200) {
            const errorData = await result.json();
            return res.status(result.status).json({ error: errorData || 'Failed to fetch playback state' });
        }

        const data = await result.json();

        // Return the playback state as JSON
        res.status(200).json({ playbackState: data });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred: ' + error.message });
    }
};

// Get Currently Playing Track
const getCurrentlyPlayingTrack = async (req, res) => {
    const accessToken = req.headers.authorization?.split(' ')[1]; // Extract access token safely

    if (!accessToken) {
        return res.status(401).json({ error: 'Missing access token.' });
    }

    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 204) {
            return res.status(200).json({ message: 'No track currently playing.' });
        }

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error fetching currently playing track:', errorResponse);
            return res.status(response.status).json(errorResponse);
        }

        const trackData = await response.json();

        return res.status(200).json({
            message: 'Currently playing track fetched successfully!',
            track: {
                name: trackData.item.name,
                artist: trackData.item.artists.map(artist => artist.name).join(', '),
                album: trackData.item.album.name,
                duration: trackData.item.duration_ms,
                progress: trackData.progress_ms,
                isPlaying: trackData.is_playing,
            },
        });
    } catch (error) {
        console.error('Unexpected Error:', error);
        return res.status(500).json({ error: 'An unexpected error occurred while fetching the currently playing track.' });
    }
};

// Function to play a specific album/track
const playTrackOrAlbum = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get the access token safely

    if (!token) {
        return res.status(401).json({ error: 'Access token is required.' });
    }

    try {
        // Send the PUT request to Spotify API to resume playback
        const response = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            // No need to pass context_uri, offset, or position_ms - simply resume the current track
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            return res.status(response.status).json({ error: errorResponse || 'Failed to resume playback' });
        }

        return res.status(200).json({
            message: 'Playback resumed successfully.',
        });
    } catch (error) {
        console.error('Unexpected Error:', error);
        return res.status(500).json({ error: 'An unexpected error occurred while resuming playback.' });
    }
};

// Function to pause the playback on the user's device
const pausePlayback = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get the access token safely

    if (!token) {
        return res.status(401).json({ error: 'Access token is required.' });
    }

    try {
        // Send the PUT request to Spotify API to pause the playback
        const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            return res.status(response.status).json({ error: errorResponse || 'Failed to pause playback' });
        }

        return res.status(200).json({
            message: 'Playback paused successfully.',
        });
    } catch (error) {
        console.error('Unexpected Error:', error);
        return res.status(500).json({ error: 'An unexpected error occurred while pausing playback.' });
    }
};

// Function to skip to the next track
const skipToNextTrack = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        // Call Spotify's API to skip to the next track
        const response = await fetch('https://api.spotify.com/v1/me/player/next', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          return res.status(response.status).json({ error: errorResponse || 'Failed to skip current track.' });
        }

        return res.status(204).json({
          message: 'Skipped current track succcessfully.'  
        });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred: ' + error.message });
    }
};

const skipToPrevious = async (req, res) => {
  try {

    const token = req.headers['authorization']?.split(' ')[1];

    const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return res.status(response.status).json({ error: errorResponse || 'Failed to skip current track.' });
    }

    return res.status(204).json({
      message: "Skipped to previous track successfully."
    });

  } catch (error) {
      res.status(500).json({ error: 'An error occured: ' + error.message });
  }
}

// Changing Playback Volume
const setPlaybackVolume = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract the access token from the Authorization header

    const { volume_percent } = req.query; // Extract volume percentage from the query parameters

    if (!volume_percent || volume_percent < 0 || volume_percent > 100) {
        return res.status(400).json({ error: 'Invalid or missing volume_percent. It should be between 0 and 100.' });
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume_percent}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`
            }
        });
          if (!response.ok) {
            const errorResponse = await response.json();
            return res.status(response.status).json({ error: errorResponse || 'Failed to set volume.' });
          }

          return res.status(204).json({
            message: `Volume set to ${volume_percent} successfully.`
          });

            } catch (error) {
        console.error('Unexpected Error:', error);
        return res.status(500).json({ error: 'An unexpected error occurred while setting playback volume.' });
    }
};

// Seek to position of track
const seekTrackPosition = async (req, res) => {

  const token = req.headers['authorization']?.split(' ')[1];

  const { position_ms } = req.query;

  try {
    const response = await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${position_ms}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return res.status(response.status).json({error: errorResponse || 'Failed to set track position.' })
    }

    return res.status(204).json({
      message: `Set track position to ${position_ms} ms successfully.`
    });

  } catch (error) {
    console.error('Unexpected Error:', error);;
    return res.status(500).json({ error: "An unexpected error occured while setting track position." });
  }
}

const getQueue = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  try{
    
    const response = await fetch('https://api.spotify.com/v1/me/player/queue', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return res.status(response.status).json({ error: errorResponse || `Failed to fetch user's queue.` });
    }
    
    const data = await response.json();

    return res.status(200).json({
      message: `Successfully fetched user's queue.`, 
      currently_playing: data.currently_playing,
      queue: data.queue,
    });

  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.statu(500).json({ error: "An unexpected error occured while fetching the user's queue." })
  }
}

const searchSong = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const songName = req.query.q; // Get the song name from the query parameter

  if (!token) {
    return res.status(401).json({ error: 'Authorization token is missing' });
  }

  if (!songName) {
    return res.status(400).json({ error: 'Song name is required' });
  }

  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(songName)}&type=track&limit=3`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return res.status(response.status).json({ error: errorResponse.error || 'Failed to fetch track search' });
    }

    const data = await response.json();
    return res.status(200).json({
      message: `Fetched song search results`,
      data: data.tracks.items.map(track => ({
        name: track.name,
        id: track.id,
        artists: track.artists.map(artist => artist.name),
        album: track.album.name,
        url: track.external_urls.spotify
      }))
    });
  } catch (error) {
    console.error("Unexpected error: ", error);
    return res.status(500).json({ error: "An error occurred while trying to fetch track search." });
  }
};

module.exports = {
  getUserPlaylists, 
  getPlaybackState, 
  getCurrentlyPlayingTrack, 
  playTrackOrAlbum, 
  pausePlayback,
  skipToNextTrack,
  skipToPrevious,
  setPlaybackVolume,
  seekTrackPosition,
  getQueue,
  searchSong,
};
