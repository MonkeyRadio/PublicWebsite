import type { MonkeyRadioAPI } from "@monkey-radio/api-client";

export const useMonkeyRadioAPI = (): MonkeyRadioAPI => {
  const instance = getCurrentInstance();
  if (!instance) throw new Error("useMonkeyRadioAPI must be called within a setup function");
  return instance.appContext.app.config.globalProperties.$monkeyRadioAPI as MonkeyRadioAPI;
};
