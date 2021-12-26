const loadingModal = new bootstrap.Modal(document.querySelector(".listen-loading"));
const listenparamModal = new bootstrap.Modal(document.querySelector(".listen-param"));
const listenErrormModal = new bootstrap.Modal(document.querySelector(".listen-error"));
listening = false;
linkSelected = 0;

function listen() {

    //Check If Playing
    if (listening == true) {
        ListenStopped();
        hls.destroy()
        audio.pause();
        audio.setAttribute("src", "");
        listening = false;
    } else {

        loadingModal.toggle();
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
            hls.config.startLevel = 1;
            hls.loadSource(lnk["link"]);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                audio.play();
                listenPlayed();
            });
        }
        else if (!!audio.canPlayType && (audio.canPlayType('application/vnd.apple.mpegURL') != '' || audio.canPlayType('audio/mpegurl') != '')) {
            log("HLS Stock")
            audio.src = lnk["link"];
            audio.addEventListener('loadedmetadata', function () {
                audio.play();
                listenPlayed();
            });
        } else {
            // Not compatible
            loadingModal.toggle();
            dispListenError({ "msg": "<h6>Le format de diffusion choisi (HLS) n'est pas compatible avec votre appareil :(</h6>" })
            return false;
        }
    } catch (e) {
        loadingModal.toggle();
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
        loadingModal.toggle();
        dispListenError({ "msg": "<h6>Le format de diffusion choisi (MP3) n'est pas compatible avec votre appareil :(</h6>" })
        log(e)
    }
}

audio.onerror=function(e){
    if(listening==true){
    dispListenError({ "msg": "<h6>Impossible de démarrer la lecture :(</h6>" })
    log(e)
    listening=false;
    ListenStopped()
    }
}
audio.addEventListener("error", function(e) { 
    if(listening==true){
        dispListenError({ "msg": "<h6>Impossible de démarrer la lecture :(</h6>" })
        log(e)
        listening=false;
        ListenStopped()
        }
     });


function dispListenError(err) {
    div = document.querySelector(".listenErrorDiv");
    html = err["msg"];
    div.innerHTML = html;
    listenErrormModal.toggle();
}

function listenPlayed() {
    document.querySelectorAll(".play").forEach(e => {
        e.style.display = "none"
    });
    document.querySelectorAll(".stop").forEach(e => {
        e.style.display = "block"
    });
    setTimeout(() => { loadingModal.toggle() }, 500);
    listening = true;
}

function ListenStopped() {
    document.querySelectorAll(".play").forEach(e => {
        e.style.display = "block"
    });
    document.querySelectorAll(".stop").forEach(e => {
        e.style.display = "none"
    });
}