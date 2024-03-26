import { defineStore } from "pinia";
import { useAPI } from "@/services/api";

type Config = {
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
      const api = useAPI();
      const config = await api.getRadioConfig();
      this.title = config.onair.tit;
      this.picture = config.onair.cover;
      this.Live = {
        url: config.onair.LiveLinkPathSQ,
        HQUrl: config.onair.LiveLinkPathHQ,
        type: config.onair.DiffLinkType,
        metadataUrl: config.onair.LiveMetadataURL,
      };
      this.Auto = {
        url: config.onair.AutoDiffLinkPath,
      };
    },
  },
});
