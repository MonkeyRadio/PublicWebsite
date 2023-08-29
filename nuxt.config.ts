import vuetify from "vite-plugin-vuetify";

// PWA Config
const title = "Monkey";
const shortTitle = "Monkey";
const description =
  "Ici c'est Monkey ! Ecoutez et partagez vos musiques préférées sur votre radio...";
const image = "https://monkeyradio.fr/large-icon.png";
const url = "https://monkeyradio.fr";

export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_vars.scss" as *;',
        },
      },
    },
  },
  // import styles
  css: ["@/assets/main.scss"],
  // enable takeover mode
  typescript: { shim: false },
  build: {
    ssr: false,
    terser: {
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    transpile: ["vuetify"],
  } as any,
  modules: [
    "@kevinmarrec/nuxt-pwa",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) =>
        // @ts-ignore
        config.plugins.push(vuetify()),
      );
    },
    "@pinia/nuxt",
  ],

  app: {
    head: {
      title: "Monkey",
      titleTemplate: "%s | Monkey",
      link: [
        { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
        { rel: "preconnect", href: "https://rsms.me/" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#9d5762" },
        { rel: "canonical", href: url },
      ],
      meta: [
        { name: "apple-mobile-web-app-title", content: "MonkeyRadio" },
        { name: "application-name", content: "MonkeyRadio" },
        { name: "msapplication-TileColor", content: "#9d5762" },
        { name: "theme-color", content: "#9d5762" },
        {
          hid: "twitter:card",
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          hid: "twitter:url",
          name: "twitter:url",
          content: url,
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: title,
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: description,
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: image,
        },
        {
          hid: "title",
          name: "title",
          content: title,
        },
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
        },
      ],
    },
  },

  pwa: {
    meta: {
      name: shortTitle,
      author: "Monkey",
      theme_color: "#9d5762",
      description,
    },
    manifest: {
      name: shortTitle,
      short_name: shortTitle,
      theme_color: "#9d5762",
      description,
    },
  },
});
