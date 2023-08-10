import { defineStore } from "pinia";
import { getRadioConfig } from "@/services/api";

type Config = {
  title: string;
  picture: string;
  Live: {
    url: string;
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
      const config = await getRadioConfig();
      this.title = config.onair.tit;
      this.picture = config.onair.cover;
      this.Live = {
        url: config.onair.DiffLinkPath,
        type: config.onair.DiffLinkType,
        metadataUrl: config.onair.LiveMetadataURL,
      };
      this.Auto = {
        url: config.onair.AutoDiffLinkPath,
      };
    },
  },
});
