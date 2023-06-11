async function convertImage(artworkUrl, x, y) {
    let blobURL;
    const image = new Image();
    image.crossOrigin="anonymous"
    image.src = artworkUrl;
    return new Promise((resolve, reject) => {
        image.addEventListener('load', async () => {
            const canvas = document.createElement('canvas');
            canvas.width = x;
            canvas.height = y;
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        resolve({
                            url: artworkUrl,
                            type: "image/png",
                            sizes: {x: x, y: y}
                        });
                        return;
                    }   
                    if (blobURL) URL.revokeObjectURL(blobURL);
                    blobURL = URL.createObjectURL(blob);
                    resolve({
                        url: blobURL,
                        type: blob.type,
                        sizes: {x: canvas.width, y: canvas.height}
                    });
                });
            }));
        }); 
    })
    
}

async function setMediaSession(title, artist, album, artwork) {
    let image64 = await convertImage(artwork, 64, 64);
    let image128 = await convertImage(artwork, 128, 128);
    let image256 = await convertImage(artwork, 256, 256);
    let image512 = await convertImage(artwork, 512, 512);
    navigator.mediaSession.metadata.album = album;
    navigator.mediaSession.metadata.title = title;
    navigator.mediaSession.metadata.artist = artist;
    navigator.mediaSession.metadata.artwork = [
        {
            src: image256.url,
            sizes: `${image256.sizes.x}x${image256.sizes.y}`,
            type: image256.type,
        },
        {
            src: artwork,
            sizes: `200x200`,
            type: "image/png"
        },
        {
            src: image64.url,
            sizes: `${image64.sizes.x}x${image64.sizes.y}`,
            type: image64.type,
        },
        {
            src: image128.url,
            sizes: `${image128.sizes.x}x${image128.sizes.y}`,
            type: image128.type,
        },
        {
            src: image512.url,
            sizes: `${image512.sizes.x}x${image512.sizes.y}`,
            type: image512.type,
        }
    ]
}

async function forceUpdateSession() {
    if ("mediaSession" in navigator) {
        setMediaSession("Monkey", "MonkeyRadio", "MonkeyRadio", "assets/monkeyPNG.png");
        await new Promise(r => setTimeout(r, 500));
        await setMediaSession(eventradios.now.trackTitle, eventradios.now.trackArtist, "MonkeyRadio", eventradios.now.trackCover);
        log("Media Session Force Updated");
    }
}


async function updateMediaSession(title, artist, album, artwork) {
    superlog("MediaSession");
    if ("mediaSession" in navigator && !navigator.mediaSession.metadata) {
        navigator.mediaSession.playbackState = "playing";
        let image64 = await convertImage(artwork, 64, 64);
        let image128 = await convertImage(artwork, 128, 128);
        let image256 = await convertImage(artwork, 256, 256);
        let image512 = await convertImage(artwork, 512, 512);
        navigator.mediaSession.metadata = new MediaMetadata({
            title: title,
            artist: artist,
            album: album,
            artwork: [
                {
                    src: image256.url,
                    sizes: `${image256.sizes.x}x${image256.sizes.y}`,
                    type: image256.type,
                },
                {
                    src: image64.url,
                    sizes: `${image64.sizes.x}x${image64.sizes.y}`,
                    type: image64.type,
                },
                {
                    src: image128.url,
                    sizes: `${image128.sizes.x}x${image128.sizes.y}`,
                    type: image128.type,
                },
                {
                    src: artwork,
                    sizes: `200x200`,
                    type: "image/png"
                },
                {
                    src: image512.url,
                    sizes: `${image512.sizes.x}x${image512.sizes.y}`,
                    type: image512.type,
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
    navigator.mediaSession.playbackState = "none";
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

