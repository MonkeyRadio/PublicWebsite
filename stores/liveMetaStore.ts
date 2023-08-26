import { defineStore } from "pinia";
import { haveMediaPicture, getMediaPicture } from "@/services/api";

type Show = {
  title: string;
  description: string;
  image: string;
  ts: {
    start: number;
    end: number;
  };
};

type Track = {
  title: string;
  artist: string;
  cover: string;
  encodedMediaKey: string;
};

export type LiveMeta = {
  show: Show;
  track: Track;
};

export const useLiveMetaStore = defineStore("liveMeta", {
  state: (): LiveMeta => ({
    show: {
      title: "",
      description: "",
      image: "",
      ts: {
        start: 0,
        end: 0,
      },
    },
    track: {
      title: "",
      artist: "",
      cover: "",
      encodedMediaKey: "",
    },
  }),
  actions: {
    setShow(show: Show) {
      this.show = show;
    },
    async setTrack(track: Track) {
      if (track.encodedMediaKey !== this.track.encodedMediaKey) {
        this.track = track;
        if (track.encodedMediaKey !== null && (await haveMediaPicture(track.encodedMediaKey))) {
          track.cover = getMediaPicture(track.encodedMediaKey);
        }
      } else {
        track.cover = this.track.cover;
      }
      this.track = track;
      this.track = track;
    },
  },
});
