const querystring = require('querystring');

const clientId = '9c5f1ea0e977447baff898a5f4a9239f'; // Replace with your Spotify Client ID
const clientSecret = '6565f95f8f784aeeb43d9aff66f3090d'; // Replace with your Spotify Client Secret
const redirectUri = 'http://localhost:3000/api/spotify/callback'; // Update this as per your app's settings

// Generate a random string for the state parameter
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Spotify Login Endpoint
const login = (req, res) => {
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email user-read-playback-state user-read-currently-playing user-modify-playback-state';

  const authQueryParameters = querystring.stringify({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state: state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${authQueryParameters}`);
};


// Spotify Callback Endpoint
const callback = async (req, res) => {
  const code = req.query.code || null;
  const error = req.query.error || null;

  if (error) {
    // Handle authorization errors
    console.error('Authorization Error:', error);
    return res.status(400).json({ error: 'Authorization failed.' });
  }

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code.' });
  }

  try {
    // Exchange authorization code for an access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      // Handle HTTP errors
      const errorResponse = await tokenResponse.json();
      console.error('Token Exchange Error:', errorResponse);
      return res.status(500).json({ error: 'Failed to exchange authorization code.' });
    }

    const tokenData = await tokenResponse.json();

    // Extract access token and other details
    const { access_token, refresh_token, expires_in } = tokenData;

    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);
    console.log('Expires In:', expires_in);

    // Optionally, store tokens securely or send them to the frontend
    return res.status(200).json({
      message: 'Authorization successful!',
      access_token: access_token,
      refresh_token: refresh_token,
      expires_in: expires_in,
    });

  } catch (error) {
    // Handle network or unexpected errors
    console.error('Unexpected Error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

module.exports = { login, callback };
