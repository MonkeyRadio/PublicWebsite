import type { DiffusionLink } from "@monkey-radio/api-client";
import { defineStore } from "pinia";

import type { id3TagsManager } from "~/managers/id3TagsManager";

export const useNewPlayerStore = defineStore("new-player", {
  state(): {
    el: HTMLVideoElement | undefined;
    link: DiffusionLink | undefined;
    fullscreen: boolean;
    volume: number;
    muted: boolean;
    id3Track: id3TagsManager | undefined;
    savedId3TrackElapsed: number;
    showVideo: boolean;
    state: "playing" | "paused" | "loading";
    event:
      | {
          title: string;
          subtitle: string;
          picture: string;
        }
      | undefined;
    seekable_: {
      backward: number;
      forward: number;
      latency: number;
    };
  } {
    return {
      el: undefined,
      link: undefined,
      fullscreen: false,
      volume: 50,
      muted: false,
      id3Track: undefined,
      savedId3TrackElapsed: 0,
      showVideo: true,
      state: "loading",
      event: undefined,
      seekable_: {
        backward: 0,
        forward: 0,
        latency: 0,
      },
    };
  },
  actions: {
    play() {
      if (this.el) this.el.play();
    },
    pause() {
      if (this.el) this.el.pause();
    },
    toggle() {
      if (this.state === "playing") return this.pause();
      return this.play();
    },
    seekForward(sec: number) {
      if (this.el && this.seekable(sec)) this.el.currentTime += sec;
      this.updateSeekable();
    },
    seekBackward(sec: number) {
      if (this.el && this.seekable(-sec)) this.el.currentTime -= sec;
      this.updateSeekable();
    },
    seekToLive() {
      if (!this.el) return;
      this.seekForward(this.seekable_.latency - 10);
      this.updateSeekable();
    },
    updateSeekable() {
      if (this.el)
        this.seekable_ = {
          backward: this.el.seekable.start(0),
          forward: this.el.seekable.end(0),
          latency: this.el.seekable.end(0) - this.el.currentTime,
        };
    },
    seekable(sec: number) {
      if (!this.el) return false;
      if (sec < 0) return this.el.currentTime + sec >= 0;
      return this.el.currentTime + sec <= this.seekable_.forward;
    },
    getId3TrackElapsed(timestamp: number) {
      if (!this.el) return 0;
      return this.id3Track?.getElapsed(timestamp, this.seekable_.latency * 1000);
    },
  },
  getters: {
    id3TrackDurationMs(state) {
      if (!state.id3Track?.duration) return 0;
      return state.id3Track.duration * 1000;
    },
  },
});
