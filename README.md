
## API Calls 

- [x]
#### Get user's playlists (GET) :
```bash
curl --request GET \
  --url http://localhost:3000/api/playback/:userId/playlists
```

- [x]
#### Get playback state (GET) :
```bash 
curl --request GET \
  --url http://localhost:3000/api/playback/playback-state \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

- [x]
#### Get currently playing track (GET) :
```bash
curl --request GET \
  --url http://localhost:3000/api/playback/current-track \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

- [ ]
#### Play a specific track/album (PUT) :
```bash
curl --request PUT \
  --url http://localhost:3000/api/playback/play-track \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "context_uri": "CONTEXT_URI",
    "position": 0,
    "position_ms": 0
}'
```

- [x]
#### Resume playback (PUT) :
```bash 
curl --request PUT \
  --url http://localhost:3000/api/playback/resume \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  --header 'Content-Type: application/json'
```

- [x]
#### Pause playback (PUT) :
```bash
curl --request PUT \
  --url http://localhost:3000/api/playback/pause \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

-[x]
#### Skip to next track (POST) :
```bash
curl --request POST \
  --url http://localhost:3000/api/playback/next \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

- [x]
#### Skip to previous track (POST) :
```bash
curl --request POST \
  --url http://localhost:3000/api/playback/previous \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

- [x]
#### Seek to a position in the current track (PUT) :
```bash
curl --request PUT \
  --url 'http://localhost:3000/api/playback/seek?position_ms=200000' \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

- [x]
#### Set playback volume (PUT) :
```bash
curl --request PUT \
  --url 'http://localhost:3000/api/playback/set-volume?volume_percent=50' \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' 
