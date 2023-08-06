import { defineStore } from "pinia";

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
    },
  }),
  actions: {
    setShow(show: Show) {
      this.show = show;
    },
    setTrack(track: Track) {
      this.track = track;
    },
  },
});
