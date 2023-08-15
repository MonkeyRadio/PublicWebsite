import { defineStore } from "pinia";
import type { Ref } from "vue";
import type Hlsjs from "@/services/hls.js";
import { usePlayerStorage } from "@/localStorage/playerPreferences";

type State = {
  playing: boolean;
  ref: Ref<HTMLAudioElement> | undefined;
  hlsjsInstance: Hlsjs | undefined;
  loading: boolean;
  delay: number;
  uhd: boolean;
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
  qualitySwitchable: boolean;
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
      qualitySwitchable: false,
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
        hlsjsInstance: undefined,
        loading: false,
        delay: 0,
        uhd: false,
      },
    };
  },
  actions: {
    reset() {
      const saveAudioRef = this.state.ref;
      const saveAudioVolume = this.volume;
      this.$reset();
      this.state.ref = saveAudioRef;
      this.volume = saveAudioVolume;
    },
    bindAudioRef(ref: Ref<HTMLAudioElement>) {
      // @ts-ignore
      this.state.ref = ref;
      const playerPreferences = usePlayerStorage();
      this.volume = playerPreferences.get("volume");
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
      const playerPreferences = usePlayerStorage();
      this.volume = volume;
      this.getAudioRef().volume = this.volume / 100;
      playerPreferences.set("volume", volume);
    },
  },
});
