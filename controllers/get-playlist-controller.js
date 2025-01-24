require('dotenv').config()

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const getToken = async () => {
    try {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
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
        // Fetch token
        const token = await getToken();

        // Example user ID for testing. Replace with `req.params.userId` for dynamic user info.
        const userId = req.params.userId;

        // Fetch user's playlists
        const result = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'GET',
            headers: { Authorization: 'Bearer ' + token },
        });

        const data = await result.json();

        if (result.status !== 200) {
            return res.status(result.status).json({ error: data.error || 'Failed to fetch playlists' });
        }

        // Return playlists as JSON
        res.status(200).json({ playlists: data.items });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred: ' + error.message });
    }
};

module.exports = { getUserPlaylists };

