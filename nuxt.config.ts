import vuetify from "vite-plugin-vuetify";

// PWA Config
const title = "Monkey";
const shortTitle = "Monkey";
const description =
  "Ici c'est Monkey ! Ecoutez et partagez vos musiques préférées sur votre radio...";
const image = "";
const url = "";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // import styles
  css: ["@/assets/main.scss"],
  // enable takeover mode
  typescript: { shim: false },
  build: {
    ssr: false,
    terser: {
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    },
    transpile: ["vuetify"]
  } as any,
  modules: [
    "@kevinmarrec/nuxt-pwa",
    async (options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) =>
        // @ts-ignore
        config.plugins.push(vuetify())
      );
    },
  ],

  app: {
    head: {
      title: "Monkey",
      titleTemplate: "%s | Monkey",
      link: [
        { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
        { rel: "preconnect", href: "https://rsms.me/" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "canonical", href: url },
      ],
      meta: [
        {
          hid: "description",
          name: "description",
          content: description,
        },
        { property: "og:site_name", content: title },
        { hid: "og:type", property: "og:type", content: "website" },
        {
          hid: "og:url",
          property: "og:url",
          content: url,
        },
        {
          hid: "og:image:secure_url",
          property: "og:image:secure_url",
          content: image,
        },
        {
          hid: "og:title",
          property: "og:title",
          content: title,
        },
        {
          hid: "og:description",
          property: "og:description",
          content: description,
        },
        {
          hid: "og:image",
          property: "og:image",
          content: image,
        }
      ],
    },
  },

  pwa: {
    meta: {
      name: shortTitle,
      author: "Monkey",
      theme_color: "#9d5762",
      description: description,
    },
    manifest: {
      name: shortTitle,
      short_name: shortTitle,
      theme_color: "#9d5762",
      description: description,
    },
  },

});
