import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    defaults,
    theme: {
      defaultTheme: "dark",
      themes: {
        light,
        dark: {
          dark: true,
          colors: {
            primary: "#9d5762",
            secondary: "#ff8c00",
            accent: "#9c27b0",
          },
        },
      },
    },
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
  });

  app.vueApp.use(vuetify);
});
