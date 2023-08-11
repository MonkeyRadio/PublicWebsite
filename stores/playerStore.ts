import { defineStore } from "pinia";
import type { Ref } from "vue";

type State = {
  playing: boolean;
  ref: Ref<HTMLAudioElement> | undefined;
  loading: boolean;
};

type Show = {
  name: string;
  subName: string;
  picture: string;
};

type Track = {
  title: string;
  artist: string;
  picture: string;
  ts: {
    start: number;
    duration: number;
    end: number;
  };
};

type PlayerStoreState = {
  fired: boolean;
  fullscreen: boolean;
  show: Show;
  track: Track;
  volume: number;
  state: State;
};

type setMetadata = Omit<Omit<PlayerStoreState, "state">, "volume">;

export const usePlayerStore = defineStore("player", {
  state(): PlayerStoreState {
    return {
      fired: false,
      fullscreen: false,
      show: {
        name: "",
        picture: "",
        subName: "",
      },
      track: {
        artist: "",
        picture: "",
        title: "",
        ts: {
          start: 0,
          duration: 0,
          end: 0,
        },
      },
      volume: 50,
      state: {
        playing: false,
        ref: undefined,
        loading: false,
      },
    };
  },
  actions: {
    bindAudioRef(ref: Ref<HTMLAudioElement>) {
      // @ts-ignore
      this.state.ref = ref;
    },
    getAudioRef(): HTMLAudioElement {
      return this.state.ref as HTMLAudioElement;
    },
    setMetadata(arg: setMetadata) {
      this.show = arg.show;
      this.track = arg.track;
    },
    setShow(arg: Show) {
      this.show = arg;
    },
    setTrack(arg: Track) {
      this.track = arg;
    },
    playPause() {
      if (this.state.playing) this.pause();
      else this.play();
    },
    playing() {
      this.state.playing = true;
      navigator.mediaSession.playbackState = "playing";
    },
    pausing() {
      this.state.playing = false;
      navigator.mediaSession.playbackState = "paused";
    },
    play() {
      this.getAudioRef().play();
    },
    pause() {
      this.getAudioRef().pause();
    },
    setVolume(volume: number) {
      this.volume = volume;
      this.getAudioRef().volume = this.volume / 100;
    },
  },
});
