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
    },
    methods: {
    },
    data: () => ({

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
                trackCover: "https://i.scdn.co/image/ab67616d00001e0258ba1ea637001f9a15e55a92",
                trackTitle: "Ensemble",
                trackArtist: "ORELSAN"
            },
            epg: {
                
            }

        }

    })
})