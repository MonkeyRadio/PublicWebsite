import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  state() {
    return {
      loader: false,
      errorModal: {
        model: false,
        title: "",
        message: "",
      },
    };
  },
  actions: {
    load() {
      this.loader = true;
    },
    finishLoad() {
      this.loader = false;
    },
    newError(title: string, message: string) {
      this.errorModal.title = title;
      this.errorModal.message = message;
      this.errorModal.model = true;
    },
  },
});
