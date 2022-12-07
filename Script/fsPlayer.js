// fsPlayer for Livy WAPP
// Dev : Nicojqn


class fsPlayer {

    constructor(viditem = null) {

        let fs = this;

        if (viditem != null) this.attachItem(viditem)
        this.item = {};
        this.mediaEvent = {};
        this.mediaEvent.onPlay = () => { };
        this.mediaEvent.onPause = () => { };
        this.mediaEvent.onStop = () => { };
        this.mediaEvent.onSeekBackward = () => { };
        this.mediaEvent.onSeekForward = () => { };
        this.mediaEvent.onSeekTo = () => { };
        this.mediaEvent.onPreviousTrack = () => { };
        this.mediaEvent.onNextTrack = () => { };
        this.mediaEvent.onSkipAd = () => { };
        this.mediaEvent.onHangUp = () => { };

        // ERROR Code

        this.readonly = {};
        this.readonly.errorCode = {
            "1": { code: 'fsE1', fatal: true, msg: "Cannot attach to item provided" },
            "2": { code: 'fsE2', fatal: true, msg: "File is not accessible" },
            "3": { code: 'fsE3', fatal: true, msg: "Cannot Load before init" },
            "4": { code: 'fsE4', fatal: true, msg: "Unable to play because no one player can play this stuff" },
            "5": { code: 'fsE5', fatal: true, msg: "Cannot play without metadata" }
        }

        const actionHandlers = [
            [
                'play',
                () => {
                    navigator.mediaSession.playbackState = "playing";
                    fs.DOMitem.play();
                }
            ],
            [
                'pause',
                () => {
                    navigator.mediaSession.playbackState = "paused";
                    fs.DOMitem.pause();
                }
            ],
            [
                'stop',
                () => {
                    fs.DOMitem.pause();
                    fsB(false);
                    fs.destroy();
                }
            ],
        ]

        for (const [action, handler] of actionHandlers) {
            try {
                navigator.mediaSession.setActionHandler(action, handler);
            } catch (e) { }
        }

    }

    destroy() {
        try {
            var classItm = this;
            navigator.mediaSession.playbackState = "none";
            navigator.mediaSession = null;
            navigator.mediaSession.metadata = null;
            classItm.DOMitem.pause();
        } catch (e) { }

        try {
            var classItm = this;
            classItm.item.usedPlayer.api.destroy();

            classItm.DOMitem.src = "";

            delete(classItm.item.usedPlayer);

            classItm.item = {};
        } catch (e) { }

    }

    attachItem(item, call = () => { }) {
        try {
            item.src; // Test item
            this.DOMitem = item;
            var classItm = this;
            this.destroy();
            setTimeout(() => {
                call()
            }, 500);
        } catch (e) {
            call(this.readonly.errorCode["1"]);
        }
    }

    initVid(url, type = null, callback = () => { }, err = (err) => { }) {

        var item = this.item;
        this.item.mediaDataQuery = false;
        this.item.mediaData = {};
        this.item.metadata = false;
        this.item.liveLatency = 0;

        var classItm = this;

        if (type == null) {
            // Determine media type

            const medtype = (url) => {

                var med = new XMLHttpRequest();
                var classitm = this
                med.open("GET", url, true);
                try {
                    med.send();
                } catch (e) {
                    item.error = "File is not accessible"
                    callback(this.readonly.errorCode["2"])
                }

                med.onreadystatechange = () => {
                    if (med.readyState == 2) {

                        var type = med.getResponseHeader("Content-Type");
                        try {
                            item.type = type.split(";")[0];
                        } catch (e) { }

                        classitm.item.url = url;

                        classitm.tryPlay(type, callback);

                        med.abort();

                    }
                }

                med.onerror = function () {
                    // Cannot determine type with Head request

                    item.type = "video/" + url.split(".").pop();

                    item.url = url;

                    classitm.tryPlay("video/" + url.split(".").pop(), callback);
                    classitm.tryPlay("audio/" + url.split(".").pop(), callback);
                }
            }


            if (typeof (url) == "string") {

                medtype(url);


            } else if (typeof (url) == "object") {

                try {

                    var getUrl = new XMLHttpRequest();
                    getUrl.open("GET", url.url, true);
                    getUrl.onload = function () {

                        try {

                            var dat = JSON.parse(this.responseText);


                            eval("url.contentURL  =  dat" + url.query);


                            medtype(url.contentURL);

                        } catch (e) { err(tranString("fsPlayer.err.msg." + classItm.readonly.errorCode["2"].code)); }

                    }

                    getUrl.onerror = function () {

                        err(classItm.readonly.errorCode["2"]);

                    }

                    getUrl.send();

                } catch (e) { }

            }



        } else {
            this.item.url = url;
            this.tryPlay(type, callback);
        }

    }

    addOpts(opts) {
        this.item.itemOptions = opts;
    }

    addMetaData(meta, callback = () => { }) {
        this.item.metadata = meta;

        callback();
    }

    tryPlay(type, callback = () => { }) {

        var classItm = this

        // Check wich player can play this

        this.item.player = [];

        if (type.search("m3u8") != -1 || type.search("hls") != -1 || type.search("vnd.apple.mpegurl") != -1 || type.search("application/x-mpegURL") != -1) {

            // HLS.JS

            this.item.player.push("HLSJS")
            this.item.player.push("Shaka")

        } else if (type.search("dash") != -1 || type.search("mpd") != -1) {

            this.item.player.push("dashjs")
            this.item.player.push("Shaka")

        } else if (type.search("application/json") != -1 || type.search("AutoDiff") != -1) {

            this.item.player.push("AutoDiff");

        } else {

            this.item.player.push("Shaka")
            this.item.player.push("HTML5")

        }

        if ('mediaSession' in navigator) {
            if (this.item.mediaData.title != undefined) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: this.item.mediaData.title,
                    artist: this.item.mediaData.artist,
                    artwork: [{ src: this.item.mediaData.cover }]
                });
            } else if (this.item.metadata.title != undefined) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: this.item.metadata.title,
                    artist: this.item.metadata.subTit,
                    artwork: [{ src: this.item.metadata.coverMain }]
                });
            } else {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: "Untitled",
                    artist: "",
                    artwork: [{ src: '' }]
                });
            }
        }

        callback(this.item.player);

    }


    setMediaData(meta) {
        this.item.mediaData.title = meta.title;
        this.item.mediaData.artist = meta.artist;
        this.item.mediaData.cover = meta.cover;
        vuetify.fsPlayer.mediaData.title = meta.title;
        vuetify.fsPlayer.mediaData.artist = meta.artist;
        vuetify.fsPlayer.mediaData.cover = meta.cover;
        try{
            vuetify.fsPlayer.mediaData.timeStart = meta.timeStart,
            vuetify.fsPlayer.mediaData.timeEnd = meta.timeEnd,
            vuetify.fsPlayer.mediaData.duration = meta.duration
            } catch (e) {}
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata.artist = meta.artist;
            navigator.mediaSession.metadata.title = meta.title;
            navigator.mediaSession.metadata.artwork[0].src = meta.cover;
        }
    }


    autoLoad(loaded = () => { }, buffering = () => { }, stopBuffering = () => { }, idplayer = 0) {

        if (this.item.metadata == false) {
            loaded(this.readonly.errorCode["5"]);
            return false;
        }

        var classItm = this;

        // Auto Load Video

        if (Object.values(this.item).length == 0) return this.readonly.errorCode["3"];

        if (this.item.player.length == 0) return this.readonly.errorCode["4"];

        try {

            this[this.item.player[idplayer] + "Load"]((d) => {
                if (d.status == "error") {
                    if (classItm.item.player.length - 1 == idplayer) {
                        loaded(d.error);
                    } else {
                        setTimeout(() => { classItm.autoLoad(loaded, buffering, stopBuffering, idplayer + 1); }, 300);
                    }
                } else {

                    // All Good


                    if (d.options.live) {
                        if (d.options.video) {
                            classItm.item.itemType = "videoLive";
                        } else {
                            classItm.item.itemType = "musicLive";
                        }
                    } else {
                        if (d.options.video) {
                            classItm.item.itemType = "video";
                        } else {
                            classItm.item.itemType = "music";
                        }
                    }

                    classItm.item.usedPlayer = {};
                    classItm.item.usedPlayer.name = classItm.item.player[idplayer];
                    classItm.item.usedPlayer.api = d.api;
                    classItm.item.options = d.options;

                    loaded(d);
                }
            })

        } catch (e) {
            if (classItm.item.player.length - 1 == idplayer) {
                loaded(classItm.readonly.errorCode["4"])
            } else {
                this.autoLoad(loaded, idplayer += 1);
            }
        }


    }






    // ALL PLAYERS


    async ShakaLoad(loaded = () => { }) {

        var classItm = this;

        // Shaka Player Load Video

        if (Object.values(this.item).length == 0) return this.readonly.errorCode["3"];

        if (this.item.player.length == 0) return this.readonly.errorCode["4"];

        shaka.polyfill.installAll();

        if (shaka.Player.isBrowserSupported()) {

            const player = new shaka.Player(this.DOMitem);
            const eventManager = new shaka.util.EventManager();
            player.configure('manifest.availabilityWindowOverride', 3600); // 1hour timeshift

            try {
                await player.load(this.item.url);

                var pl = classItm.DOMitem;

                var opt = {
                    live: false,
                    video: true
                };


                eventManager.listenOnce(player, `timeandseekrangeupdated`, () => {
                    if (classItm.item.options.live && classItm.DOMitem.currentTime < classItm.DOMitem.duration - 60) {
                        classItm.DOMitem.currentTime = classItm.DOMitem.duration - 10;
                    }
                });

                player.addEventListener('buffering', (event) => {
                    if (event.buffering) {
                        buffering()
                    } else {
                        stopBuffering()
                    }

                })

                player.addEventListener('error', (event) => {
                    loaded({ status: "error", error: classItm.readonly.errorCode["2"], html5Error: e })
                })

                classItm.DOMitem.play().then(t => {

                    if (pl.duration == "Infinity" || (classItm.item.itemOptions != undefined && classItm.item.itemOptions.live != undefined && classItm.item.itemOptions.live)) opt.live = true;
                    if (pl.videoHeight == 0) opt.video = false;

                    loaded({ status: "good", api: player, options: opt });

                });
            } catch (e) {
                player.destroy();
                loaded({ status: "error", error: classItm.readonly.errorCode["2"], html5Error: e })
            }
        } else {
            loaded({ status: "error", error: classItm.readonly.errorCode["4"], html5Error: e })
            return undefined;
        }


    }



    AutoDiffLoad(loaded = () => { }) {

        var classItm = this;

        var adp = new AutoDiffPlayer();

        adp.loadSource(this.item.url);

        adp.attachMedia(classItm.DOMitem);



        adp.canPlay = (t) => {
            if (t != null) {
                classItm.DOMitem.currentTime = t;
            }
            classItm.DOMitem.play().then(t => {


                var pl = classItm.DOMitem;

                var opt = {
                    live: false,
                    video: true
                };
                if (pl.videoHeight == 0) opt.video = false;

                var getLatency = () => {
                    classItm.item.liveLatency = classItm.DOMitem.duration - classItm.DOMitem.currentTime;
                    if (classItm.DOMitem != null) setTimeout(getLatency, 500);
                }

                getLatency();


                loaded({ status: "good", api: adp, options: opt });
            })

                .catch(e => {
                    if (e.toString().search("interrupted") != -1) {
                        classItm.DOMitem.pause();
                        adp.destroy();
                        setTimeout(() => { classItm.AutoDiffLoad(loaded); }, 500);
                    } else {
                        loaded({ status: "error", msg: "Media not compatible", HLSJSError: e })
                    }
                });
        }


    }



    HTML5Load(loaded = () => { }) {

        try {

            var classItm = this;

            classItm.DOMitem.src = this.item.url;
            setTimeout(() => {
                try {


                    classItm.DOMitem.addEventListener('waiting', () => {
                        buffering()
                    });
                    classItm.DOMitem.addEventListener('playing', () => {
                        stopBuffering()
                    });


                    classItm.DOMitem.play().then(t => {

                        var pl = classItm.DOMitem;

                        var opt = {
                            live: false,
                            video: true
                        };

                        if (pl.duration == "Infinity") opt.live = true;
                        if (pl.videoHeight == 0) opt.video = false;


                        loaded({ status: "good", api: null, options: opt });
                    })

                        .catch(e => {
                            if (e.toString().search("interrupted") != -1) {
                                classItm.DOMitem.pause(); classItm.HTML5Load(loaded);
                            } else if (e.toString().search("no supported source") != -1) {
                                loaded({ status: "error", error: classItm.readonly.errorCode["2"], html5Error: e })
                            } else {
                                loaded({ status: "error", error: classItm.readonly.errorCode["4"], html5Error: e })
                            }

                        })

                } catch (error) {
                    loaded({ status: "error", msg: "Player Error", html5Error: error })
                }

            }, 50);


        } catch (error) {
            loaded({ status: "error", msg: "Player Error", html5Error: error })
        }

    }



    HLSJSLoad(loaded = () => { }) {

        var classItm = this;

        if (Hls.isSupported()) {
            var hls = new Hls();
            hls.config.startLevel = -1;
            if (fsv.item.itemOptions == undefined || fsv.item.itemOptions.timeshift == undefined || fsv.item.itemOptions.timeshift == false) {
                hls.config.liveMaxLatencyDuration = 60;
            }
            hls.loadSource(this.item.url);
            hls.attachMedia(this.DOMitem);
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            // try to recover network error
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            // cannot recover
                            break;
                    }
                }
                var errorType = data.type;
                var errorDetails = data.details;
                var errorFatal = data.fatal;
                if (errorDetails == "levelLoadError" || errorDetails == "manifestLoadError" || errorDetails == "manifestParsingError") {
                    buffering()
                    hls.destroy();
                    setTimeout(() => {
                        classItm.HLSJSLoad(loaded);
                    }, 500);

                }
                if (errorDetails == Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
                    buffering()
                }
            });

            hls.on(Hls.Events.MANIFEST_PARSED, function (e, d) {
                classItm.DOMitem.play().then(t => {

                    var pl = classItm.DOMitem;

                    var opt = {
                        live: false,
                        video: true
                    };
                    if (pl.videoHeight == 0) opt.video = false;


                    loaded({ status: "good", api: null, options: opt });
                })

                    .catch(e => {
                        if (e.toString().search("interrupted") != -1) {
                            classItm.DOMitem.pause();
                            hls.destroy();
                            setTimeout(() => { classItm.HLSJSLoad(loaded); }, 500);
                        } else {
                            loaded({ status: "error", msg: "Media not compatible", HLSJSError: e })
                        }
                    });
            });


            hls.on(window.Hls.Events.FRAG_BUFFERED, () => {
                stopBuffering()
            })


            hls.on(Hls.Events.LEVEL_UPDATED, function (e, data) {


                if (data.details.live && classItm.DOMitem.currentTime < classItm.DOMitem.duration - 600 && (fsv.item.itemOptions == undefined || fsv.item.itemOptions.timeshift == undefined || fsv.item.itemOptions.timeshift == false)) {
                    classItm.DOMitem.currentTime = classItm.DOMitem.duration - data.details.targetduration * 2;
                }

                var pl = classItm.DOMitem;

                var opt = {
                    live: data.details.live,
                    video: true
                };

                if (pl.videoHeight == 0) opt.video = false;

                fsv.item.liveLatency = classItm.DOMitem.duration - classItm.DOMitem.currentTime;


                loaded({ status: "good", api: hls, options: opt });
            });





        } else {
            loaded({ status: "error", msg: "HLS.JS not compatible" });
        }
    }



}


const testHLSJS = (url, itm, c) => {
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.config.manifestLoadingTimeOut = 1000;
        hls.loadSource(url);
        hls.attachMedia(itm);
        hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal == true) {
                hls.destroy();
                c(false);
            }
        })
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            hls.destroy();
            c(true);
        })
    }
}


const testShaka = async (url, itm, c) => {
    shaka.polyfill.installAll();

    if (shaka.Player.isBrowserSupported()) {

        const player = new shaka.Player(itm);

        try {
            await player.load(url);
            c(true);
            player.destroy()
        } catch (e) {
            c(false);
            player.destroy()
        }
    } else {
        c(false);
        return undefined;
    }


}