
cdnURL = "https://cdn.monkeyradio.fr/";


SocketURL = "";
SocketDir = "";
BasicAPIURL = "";

document.addEventListener("VueLoadAPI", () => {
    var reqsocket = new XMLHttpRequest();
    reqsocket.open("GET", cdnURL + "?request=Service/Socket-API/0", true);

    reqsocket.onload = function () {

        SocketURL = JSON.parse(reqsocket.responseText)["ServiceAccessList"][0]["ServiceURL"];
        SocketDir = JSON.parse(reqsocket.responseText)["ServiceAccessList"][0]["ServiceDir"];

        var reqbasic = new XMLHttpRequest();
        reqbasic.open("GET", cdnURL + "?request=Service/Basic-API/0", true);

        reqbasic.onload = function () {

            BasicAPIURL = JSON.parse(reqbasic.responseText)["ServiceAccessList"][0]["ServiceURL"];

            socket = io.connect(SocketURL, {
                transports: ["websocket"],
                path: SocketDir
            });



            socket.on('onair', function (msg) {
                data = msg;



                // Initialisation Complete

                document.querySelector(".loadingSplash").style.opacity = 0;
                setTimeout(() => { document.querySelector(".loadingSplash").style.display = "none"; }, 300)
                document.querySelector("#app").style.display = "";

                monkeyLine.live1_HLS_Premium = {
                    meta: {
                        url: "https://fr-grav1.monkeyradio.fr/diffusion/prod/Monkey_AutoDiff_premium",
                        itemType: "AutoDiff",
                        metadata: {
                          title: data.smallTit,
                          subTit: 'Le Direct',
                          coverMain: data.cover
                        },
                        mediaData: {
                            url: BasicAPIURL + "?origin=MonkeyWeb_hls",
                            latency: {
                                param: "cur"
                            },
                            query: {
                                title: "['current']['trackTitle']",
                                artist: "['current']['trackArtist']",
                                cover: "['current']['trackCover']",
                                timeStart : "['current']['trackTStart']",
                                timeEnd : "['current']['trackTStop']",
                                duration: "['current']['trackTDur']",
                            }
                        }
                    }
                }

            });



            socket.on('event', function (d) {

                vuetify.radioEvents.now = d.now
                vuetify.radioEvents.epg = d.epg
                vuetify.radioEvents.epg.epgStartReadable = new Date(vuetify.radioEvents.epg.epgStart * 1000).getHours();
                vuetify.radioEvents.epg.epgStopReadable = new Date(vuetify.radioEvents.epg.epgStop * 1000).getHours();

            })





        }
        reqbasic.send();

    }


    reqsocket.send();



})


monkeyLine = {};


fsv = new fsPlayer();
fsv.mediaEvent.onPause = () => {
    vuetify.fsPlayer.playButton = "mdi-play";
}
fsv.mediaEvent.onPlay = () => {
    vuetify.fsPlayer.playButton = "mdi-pause";
}
fsv.mediaEvent.onStop = () => {
    vuetify.fsPlayer.playButton = "mdi-play";
    console.log("STOP")
    fsB(false);
}
fsv.mediaEvent.onSeekBackward = () => {
    console.log("coucou")
}

monkeyFSPlay = (idLine) => {

    fsB(true)

    meta = monkeyLine[idLine].meta;

    type = null;

    if (meta.itemType != undefined) { type = meta.itemType }

    fsv.attachItem(document.querySelector("audio"), () => {
        fsv.initVid(meta.url, type, () => {

            if (meta.mediaData != undefined) {
                fsv.item.mediaDataQuery = meta.mediaData;
            }
            fsv.item.idLine = idLine;
            monkeyFSGetMediaData();

            if (monkeyLine[idLine].opts != undefined) {
                fsv.addOpts(monkeyLine[idLine].opts);
            }

            fsv.addMetaData(
                {
                    title: meta.title,
                    subTit: meta.subTit,
                    desc: meta.desc,
                    coverMain: meta.coverMain,
                    coverSec: meta.coverSec
                }, () => {
                    fsv.autoLoad((e) => {
                        monkeyFSGetMediaData(true);
                    });
                });
        }, (err) => {

            vuetify.fsPlayer.err.dial.msg = err;
            vuetify.fsPlayer.err.dial.act = true;

        });
    });
}



monkeyLIVEPlay = () => {
    monkeyFSPlay("live1_HLS_Premium");
}

monkeyFSGetMediaData = (ti = false) => {

    var ti = ti;

    // TextTracks MediaData

    try {
        fsv.item.mediaMetaData = {};
        fsv.item.mediaMetaData.id3 = {};
        fsv.item.mediaMetaData.id3.parsed = {};
        fsv.item.mediaMetaData.id3.notParsed = {};
        mediaDataID3 = {};
        var cue = fsv.DOMitem.textTracks[0].activeCues;
        a = 0;
        while (fsv.DOMitem.textTracks[a] != undefined) {
            if (fsv.DOMitem.textTracks[a] != undefined) {
                if (fsv.DOMitem.textTracks[a].activeCues != undefined) {
                    cue = fsv.DOMitem.textTracks[a].activeCues;
                }
            }
            a++;
        }
        Object.values(cue).forEach(e => {
            fsv.item.mediaMetaData.id3.notParsed[e.value.key] = e.value.data;
            switch (e.value.key) {
                case "TIT2":
                    fsv.item.mediaMetaData.id3.parsed.title = e.value.data;
                    mediaDataID3.title = e.value.data;
                    break;
                case "TIT1":
                    fsv.item.mediaMetaData.id3.parsed.desc = e.value.data;
                    break;
                case "TIT3":
                    fsv.item.mediaMetaData.id3.parsed.subTitle = e.value.data;
                    break;
                case "TPE1":
                    fsv.item.mediaMetaData.id3.parsed.artist = e.value.data;
                    mediaDataID3.artist = e.value.data;
                    break;
                case "TPE2":
                    newfsv.item.mediaMetaData.parsed.id3meta.artist = e.value.data;
                    break;
                case "WXXX":
                    fsv.item.mediaMetaData.id3.parsed[e.value.info] = e.value.data;
                    mediaDataID3.cover = e.value.data;
                    break;
                default:
                    fsv.item.mediaMetaData.id3.parsed[e.value.key] = e.value.data;
                    break;
            }
        })

    } catch (e) { }


    if (fsv.item.mediaDataQuery != false) {

        try {

            var url = fsv.item.mediaDataQuery.url;

            if (fsv.item.mediaDataQuery.latency != undefined) {
                if (fsv.item.mediaDataQuery.url.split("?").length > 1) {
                    url = fsv.item.mediaDataQuery.url + "&" + fsv.item.mediaDataQuery.latency.param + "=" + Math.floor(fsv.item.liveLatency);
                } else {
                    url = fsv.item.mediaDataQuery.url + "?" + fsv.item.mediaDataQuery.latency.param + "=" + Math.floor(fsv.item.liveLatency);
                }
            }

            getd = new XMLHttpRequest();
            getd.open("GET", url, true);
            getd.onload = function () {

                try {

                    dat = JSON.parse(this.responseText);

                    fdat = {};

                    Object.keys(fsv.item.mediaDataQuery.query).forEach(e => {
                        eval("fdat['" + e + "'] =  dat" + fsv.item.mediaDataQuery.query[e]);
                    })

                    fsv.setMediaData(fdat);

                } catch (e) { }

                if (ti) { setTimeout(monkeyFSGetMediaData, 5000, true); }
            }

            getd.send();

        } catch (e) {
            if (ti) { setTimeout(monkeyFSGetMediaData, 300, true); }
        }

    } else if (Object.keys(fsv.item.mediaMetaData.id3.parsed).length == 0) {
        if (fsv.item.itemType == "musicLive") {
            fdat = {
                title: fsv.item.metadata.subTit,
                artist: fsv.item.metadata.title,
                cover: fsv.item.metadata.coverMain
            }
            fsv.setMediaData(fdat);
        }
        if (ti) { setTimeout(monkeyFSGetMediaData, 300, true); }
    } else {

        // Media Data ID3

        fsv.setMediaData(mediaDataID3);

        if (ti) { setTimeout(monkeyFSGetMediaData, 300, true); }
    }
}

const locPrompt = () => {
    navigator.geolocation.getCurrentPosition((position) => {

        fsv.item.usedPlayer.api.lat = position.coords.latitude;
        fsv.item.usedPlayer.api.lon = position.coords.longitude;
        fsv.item.usedPlayer.api.pos = true;
    });
}
