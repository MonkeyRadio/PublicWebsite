import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    defaults,
    // add theme
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
      // add color variations
      //   variations: {
      //     colors: ["primary", "secondary"],
      //     lighten: 3,
      //     darken: 3,
      //   },
    },
    // Add the custom iconset
    icons: {
      defaultSet: "custom",
      sets: {
      },
    },
  });

  app.vueApp.use(vuetify);
});
