// Vue Instance Creation
// Dev : Nicojqn

VueLoad = new Event("VueLoad");
VueLoadAPI = new Event("VueLoadAPI");

vuetify = new Vue({
    el: '#app',
    vuetify: new Vuetify({
        theme: {
            themes: {
                light: {
                    primary: '#9d5762',
                    secondary: '#b0bec5',
                    accent: '#8c9eff',
                    error: '#b71c1c',
                },
                dark: {
                    primary: '#9d5762',
                },
            },
        },
    }),
    mounted: function () {
        this.$vuetify.theme.dark = true;
        document.dispatchEvent(VueLoad);
        setTimeout(() => { document.dispatchEvent(VueLoadAPI) }, 50);
        document.querySelector(".loadingSplash").style.opacity = 0;
        setTimeout(() => { document.querySelector(".loadingSplash").style.display = "none"; }, 300)
        document.querySelector("#app").style.display = "";
    },
    methods: {
    },
    data: () => ({


        // FS Player

        stopDev: true,

        fsPlayer: {
            err: {
                msg: "",
                dial: {
                    act: false,
                    title: "Une Erreur est survenue",
                    msg: "",
                    ok: "OK"
                }
            },
            txt: {
                live: "Direct"
            },
            metadata: {
                title: "",
                subTit: "",
                desc: "",
                episodeNum: "",
                seasonNum: "",
                channelTit: "",
                coverMain: "",
                background: "",
                coverSec: ""
            },
            mediaData: {
                active: false,
                title: "",
                artist: "",
                cover: "",
                timeStart: 0,
                timeEnd: 0,
                duration: 0,
            },
            shown: true,
            pBar: 0,
            iconType: "mdi-circle",
            type: "Direct",
            playButton: "mdi-play",
            fullScreenIcon: "mdi-fullscreen",
            volIcon: "mdi-volume-high",
            vol: 50,
            duration: "",
            currentTime: ""
        },

        nav: false,

        navigation: [
            {
                title: "Radio",
                embed: "home",
            },
            {
                title: "Emissions",
                embed: "grille"
            }
        ],

        radioEvents: {

            now: {
                trackCover: "",
                trackTitle: "",
                trackArtist: ""
            },
            epg: {

            }

        },

        locPrompt: false,

    })
})
