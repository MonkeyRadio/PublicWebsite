import type { App } from "vue";
import { MonkeyRadioAPI } from "@monkey-radio/api-client";

let monkeyRadioAPI: MonkeyRadioAPI | undefined;

const createMonkeyRadioAPI = () => ({
  install: (app: App) => {
    monkeyRadioAPI = new MonkeyRadioAPI({
      baseUrl: useRuntimeConfig().public.apiUrl,
      diffusionUrl: useRuntimeConfig().public.diffusionUrl,
    });
    app.config.globalProperties.$monkeyRadioAPI = monkeyRadioAPI;
  },
});

export const getMonkeyRadioAPI = () => {
  if (!monkeyRadioAPI) {
    throw new Error("MonkeyRadioAPI plugin not installed");
  }
  return monkeyRadioAPI;
};


export default defineNuxtPlugin((app) => {
  const monkeyradioAPI = createMonkeyRadioAPI();

  app.vueApp.use(monkeyradioAPI);
});
