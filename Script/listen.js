const loadingModal = new bootstrap.Modal(document.querySelector(".listen-loading"));
const listenparamModal = new bootstrap.Modal(document.querySelector(".listen-param"));
const listenErrormModal = new bootstrap.Modal(document.querySelector(".listen-error"));
listening = false;
linkSelected = 0;

function linkplus1() {
    return link[linkSelected]

}

function listen() {

    //Check If Playing
    if (listening == true) {
        ListenStopped();
        hls.destroy()
        audio.pause();
        audio.setAttribute("src", "");
        listening = false;
    } else {

        listening = true;
        loadingModal.show();
        listenErrormModal.hide();
        lnk = link[linkSelected];
        switch (lnk["type"]) {
            case "hls":
                playHLS(lnk);
                break;
            case "mp3":
                playMP3(lnk);
                break;
        }
    }
}



function playHLS(lnk) {
    // HLS Stock
    try {
        if (Hls.isSupported()) {
            log("HLS JS")
            hls.destroy()
            audio.setAttribute("src", "");
            hls = new Hls();
            hls.config.startLevel = -1;
            hls.config.liveSyncDuration = 4;
            //hls.config.liveMaxLatencyDuration = 50;
            hls.config.startFragPrefetch = true;
            hls.loadSource(lnk["link"]);
            hls.attachMedia(audio);
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            // try to recover network error
                            console.log('fatal network error encountered, try to recover');
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log('fatal media error encountered, try to recover');
                            hls.recoverMediaError();
                            break;
                        default:
                            // cannot recover
                            hls.destroy();
                            break;
                    }
                }
                var errorType = data.type;
                var errorDetails = data.details;
                var errorFatal = data.fatal;
                if (errorDetails == "bufferStalledError") {
                    loadingModal.show();
                }
                if (errorDetails == "levelLoadError" || errorDetails == "manifestLoadError" || errorDetails == "manifestParsingError") {
                    loadingModal.show();
                    hls.destroy(); setTimeout(() => { playHLS(linkplus1()) }, 600);
                }
                else if (listening == true && audio.paused) {
                    loadingModal.show();
                    log(errorType + errorDetails + errorFatal)
                    listening = false;
                    ListenStopped()
                }
                console.log("e1" + errorType + errorDetails + errorFatal)
            });
            hls.on(Hls.Events.FRAG_LOADED, () => {

                loadingModal.hide();
            })

            hls.on(Hls.Events.FRAG_CHANGED, function (event, data) {
                jsmediatags.read(data["frag"]["_url"], {
                    onSuccess: function (tag) {
                        id3tag = true;
                        tag["tags"]["TXXX"].forEach(e => {
                            tag["tags"][e["data"]["user_description"]] = e["data"]["data"];
                        })
                        eventradios["now"]["Type"] = tag["tags"]["eventType"];
                        eventradios["now"]["trackArtist"] = tag["tags"]["eventArtist"];
                        eventradios["now"]["trackTitle"] = tag["tags"]["eventTitle"];
                        eventradios["now"]["trackCover"] = tag["tags"]["WOAF"]["data"];
                        eventradios["now"]["trackTDur"] = parseInt(tag["tags"]["eventTDur"]);
                        eventradios["now"]["trackTStart"] = parseInt(tag["tags"]["eventTStart"]);
                        eventradios["now"]["trackTStop"] = parseInt(tag["tags"]["eventTStop"]);
                        eventradios["now"]["provider"] = "id3";
                        eventElapsed = parseInt(tag["tags"]["eventTElapsed"]);
                        setTimeout(trignewEvent,100);
                    },
                    onerror: function(err)
                    {
                        console.log(err)
                    }
                })
            })



            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                audio.play();
                listenPlayed();
            });
        } else if (!!audio.canPlayType && (audio.canPlayType('application/vnd.apple.mpegURL') != '' || audio.canPlayType('audio/mpegurl') != '')) {
            log("HLS Stock")
            audio.src = lnk["link"];
            audio.addEventListener('loadedmetadata', function () {
                audio.play();
                listenPlayed();
            });
        } else {
            // Not compatible
            loadingModal.hide();
            dispListenError({ "msg": "<h6>Le format de diffusion choisi (HLS) n'est pas compatible avec votre appareil :(</h6>" })
            return false;
        }
    } catch (e) {
        loadingModal.hide();
        dispListenError({ "msg": "<h6>Le format de diffusion choisi (HLS) n'est pas compatible avec votre appareil :(</h6>" })
        log(e)
    }
}

function playMP3(lnk) {
    try {
        hls.destroy()
        audio.setAttribute("src", "");
        audio.setAttribute("src", lnk["link"]);
        audio.play();
        listenPlayed();
    } catch (e) {
        loadingModal.hide();
        dispListenError({ "msg": "<h6>Le format de diffusion choisi (MP3) n'est pas compatible avec votre appareil :(</h6>" })
        log(e)
    }
}

audio.addEventListener("error", function (e) {
    if (listening == true && audio.paused) {
        loadingModal.hide();
        dispListenError({ "msg": "<h6>Impossible de démarrer la lecture :(</h6>" })
        log(JSON.stringify(e, ["message", "arguments", "type", "name"]))
        listening = false;
        ListenStopped()
    }
});



function dispListenError(err) {
    div = document.querySelector(".listenErrorDiv");
    html = err["msg"];
    div.innerHTML = html;
    listenErrormModal.show();
}

function listenPlayed() {
    document.querySelectorAll(".play").forEach(e => {
        e.style.display = "none"
    });
    document.querySelectorAll(".stop").forEach(e => {
        e.style.display = "block"
    });
    loadingModal.hide();
}

function ListenStopped() {
    id3tag = false;
    setTimeout(()=>{
        eventradios = JSON.parse(JSON.stringify(eventradiosSock));
        trignewEvent();
    },500);
    document.querySelectorAll(".play").forEach(e => {
        e.style.display = "block"
    });
    document.querySelectorAll(".stop").forEach(e => {
        e.style.display = "none"
    });
}

function verifpaused() {
    if (!audio.paused) {
        listenPlayed();
    } else {
        hls.destroy();
        ListenStopped();
    }
    setTimeout(verifpaused, 500);
}

verifpaused()

function getQuality() {
    try {
        document.querySelector(".quality-disp").innerHTML = Math.floor(hls.levels[hls.currentLevel]["bitrate"] / 1000) + " Kb";
    } catch (e) { }
    setTimeout(getQuality, 100);
}
getQuality();