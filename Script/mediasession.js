function setMediaSession (title, artist, album, artwork) {
        navigator.mediaSession.metadata.album = album;
        navigator.mediaSession.metadata.title = title;
        navigator.mediaSession.metadata.artist = artist;
        navigator.mediaSession.metadata.artwork = [
            {
                src: artwork,
                sizes: "200x200",
                type: "image/png",
            },
            {
                src: artwork,
                sizes: "512x512",
                type: "image/png",
            }
        ]
}

async function forceUpdateSession()
{
    if ("mediaSession" in navigator) {
        setMediaSession("Monkey", "MonkeyRadio", "MonkeyRadio", "assets/monkeyPNG.png");
        await new Promise(r => setTimeout(r, 500));
        setMediaSession(eventradios.now.trackTitle, eventradios.now.trackArtist, "MonkeyRadio", eventradios.now.trackCover);
        log("Media Session Force Updated");
    }
}

async function updateMediaSession(title, artist, album, artwork) {
    if ("mediaSession" in navigator && !navigator.mediaSession.metadata) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: title,
            artist: artist,
            album: album,
            artwork: [
                {
                    src: artwork,
                    sizes: "200x200",
                    type: "image/png",
                },
                {
                    src: artwork,
                    sizes: "512x512",
                    type: "image/png",
                }
            ],
        });
        log("Media Session Created");
    } else if ("mediaSession" in navigator) {
        setMediaSession(title, artist, album, artwork);
        log("Media Session Updated");
    }
}

function destroyMediaSession() {
    navigator.mediaSession.metadata = null;
    log("Media Session destroyed");
}

function setMediaSessionHandler() {
    try {
        navigator.mediaSession.setActionHandler("play", () => {
            navigator.mediaSession.playbackState = "playing";
            audio.play();
        });
        navigator.mediaSession.setActionHandler("pause", () => {
            navigator.mediaSession.playbackState = "paused";
            audio.pause();
        });
        navigator.mediaSession.setActionHandler("stop", () => {
            destroyMediaSession();
            killListen();
        });
    }
    catch (e) {
        log("Media Session not supported");
    }
}

