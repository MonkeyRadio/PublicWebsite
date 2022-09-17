class AutoDiffPlayer {

    #control;

    constructor() {
        this.selectedMed = "";
        this.currentRegion = "";
        this.nextRegion = "";
        this.config = { regionSwitchDelay: 900000 };
        this.#control = [];

        this.hls;

        this.buffering = () => { };
        this.stopBuffering = () => { };
        this.canPlay = () => { };

        this.#controling(this);

        var CI = this;

        this.pos = false;

        navigator.geolocation.getCurrentPosition((position) => {

            CI.lat = position.coords.latitude;
            CI.lon = position.coords.longitude;

            CI.pos = true;

        });
    }

    loadSource(url) {
        this.url = url;

        var CI = this;

        var callback = callback;

        var l = new XMLHttpRequest();

        l.open("GET", url, true);

        l.onload = function () {

            var m = JSON.parse(this.responseText);

            CI.parsedMetadata = m;

            CI.preferredMedia = m.preferred_media;

            CI.media = {};

            // Parse Metadata

            Object.keys(m.media).forEach(element => {
                var e2 = m.media[element]
                if (typeof (e2) == "object") {


                    CI.media[element] = {};
                    CI.media[element].media = [];

                    CI.media[element].main_media = e2.main_media;

                    if (typeof (e2.region_switch) && e2.region_switch == true) {
                        CI.media[element].regionSwitch = true;
                        // Get All URLs

                        Object.keys(e2.media).forEach(me => {
                            var me2 = e2.media[me];

                            var reuri = e2.region_main_url.replaceAll("[userid]", m.infos.userid);

                            reuri = reuri.replaceAll("[region]", me);

                            me2.url = reuri;
                            CI.media[element].media[me] = me2;
                        })

                    } else {

                        CI.media[element].regionSwitch = false;

                        Object.keys(e2.media).forEach(me => {
                            var me2 = e2.media[me];

                            var reuri = me2.url.replaceAll("[userid]", m.infos.userid);

                            reuri = reuri.replaceAll("[region]", me);

                            me2.url = reuri;
                            CI.media[element].media[me] = me2;
                        })

                    }

                    if (CI.selectedMed == "") {
                        CI.selectedMed = CI.preferredMedia;
                    }
                    CI.#control.push("loadSRC")

                }
            });

        }

        l.send();

    }

    attachMedia(dom) {
        this.DomItem = dom;
        this.#control.push("mediaAtt");
    }



    #controling(i) {

        if (i.#control.includes("loadSRC") && i.#control.includes("mediaAtt")) {
            i.#play()
            i.#checkRegion(i);
        } else {
            setTimeout(() => { i.#controling(i) }, 100);
        }

    }


    selectRegion(f = null) {

        var CI = this;

        navigator.geolocation.getCurrentPosition((position) => {

            CI.lat = position.coords.latitude;
            CI.lon = position.coords.longitude;

            CI.pos = true;

        });

        var reg = this.media[this.selectedMed].main_media

        var da = -1;

        Object.keys(CI.media[CI.selectedMed].media).forEach(e => {

            if (CI.media[CI.selectedMed].media[e].location[0] != 0 && CI.media[CI.selectedMed].media[e].location[1] != 0) {

                const R = 6371e3; // metres
                const φ1 = CI.lat * Math.PI / 180; // φ, λ in radians
                const φ2 = CI.media[CI.selectedMed].media[e].location[0] * Math.PI / 180;
                const Δφ = (CI.media[CI.selectedMed].media[e].location[0] - CI.lat) * Math.PI / 180;
                const Δλ = (CI.lon - CI.media[CI.selectedMed].media[e].location[1]) * Math.PI / 180;

                const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                const d = Math.round(R * c / 1000); // in Kmetres

                if ((d < da || da == -1) && !isNaN(d)) {
                    da = d;
                    reg = e;
                }

            }

        })

        if (da > CI.config.maxDistanceRegion) {
            reg = this.media[this.selectedMed].main_media
        }



        if (f == true) {
            this.currentRegion, this.nextRegion = reg;
            return reg;
        } else {
            this.nextRegion = reg;
        }

        if (CI.pos == false || !this.media[this.selectedMed].regionSwitch) {
            setTimeout(() => { this.selectRegion() }, 1000);
        } else {
            setTimeout(() => { this.selectRegion() }, this.config.regionSwitchDelay);
        }
    }


    #checkRegion(CI) {

        if (CI.currentRegion != CI.nextRegion) {
            CI.currentRegion = CI.nextRegion;
            var t = CI.DomItem.currentTime * 100 / CI.DomItem.duration;
            CI.destroy();
            CI.#play(CI.currentRegion, t);
        }

        setTimeout(() => { CI.#checkRegion(CI) }, 150)
    }


    destroy() {
        this.hls.destroy();
        this.DomItem.src = "";
        this.DomItem.pause();
    }


    #play(reg = null, currentTime = null) {

        var CI = this;

        var media = this.media[this.selectedMed];

        if (media.regionSwitch) {
            if (reg == null) {
                var reg = this.selectRegion(true);
                var me = media.media[reg];
            } else {
                var me = media.media[reg];
            }

        } else {
            var me = media.media[media.main_media];
        }

        switch (me.package) {

            case "hls":

                this.hls = new Hls();
                this.hls.config.startLevel = -1;
                this.hls.loadSource(me.url);
                this.hls.attachMedia(CI.DomItem);
                this.hls.on(Hls.Events.ERROR, function (event, data) {
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
                        CI.buffering()
                        CI.hls.destroy();
                        setTimeout(() => {
                            CI.#play()
                        }, 500);

                    }
                    if (errorDetails == Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
                        CI.buffering()
                    }
                });

                this.hls.on(Hls.Events.MANIFEST_PARSED, function (e, d) {
                    if (currentTime != null && !isNaN(currentTime)) {
                        CI.canPlay(currentTime * me.timeshift / 100)
                    } else {
                        CI.canPlay(null);
                    }
                });


                this.hls.on(window.Hls.Events.FRAG_BUFFERED, () => {
                    CI.stopBuffering()
                })
                break;

        }


    }



}