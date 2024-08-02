import { Radio } from "@monkey-radio/api-client";
import { defineStore } from "pinia";
import { useAPI } from "@/services/api";

type Config = {
  radio?: Radio;
  title: string;
  picture: string;
  Live: {
    url: string;
    HQUrl: string;
    type: "hls" | "ice";
    metadataUrl: string;
  };
  Auto: {
    url: string;
  };
};

export const useRadioConfig = defineStore("radioConfig", {
  state(): Config {
    return {
      title: "",
      picture: "",
      Live: {
        url: "",
        HQUrl: "",
        type: "hls",
        metadataUrl: "",
      },
      Auto: {
        url: "",
      },
    };
  },
  actions: {
    async retrieveRadioConfig() {
      const api = useMonkeyRadioAPI();
      const domain = window.location.hostname;
      const config = await api.radios.fromDomain(domain);
      this.title = config.name;
      this.radio = config;
      this.radio.id = "66033ed8a012843dc7a92949";
      
      
      const oldApi = useAPI();
      const oldRadio = await oldApi.getRadioConfig();
      this.Live.metadataUrl = oldRadio.onair.LiveMetadataURL;
    },
  },
});
