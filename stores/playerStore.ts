import { defineStore } from "pinia";

type State = {
  playing: boolean;
};

type PlayerStoreState = {
  progressed: number;
  show: {
    name: string;
    subName: string;
    picture: string;
  };
  track: {
    title: string;
    artist: string;
    picture: string;
  };
  volume: number;
  state: State;
};

type setMetadata = Omit<Omit<PlayerStoreState, "state">, "volume">;

export const usePlayerStore = defineStore("player", {
  state(): PlayerStoreState {
    return {
      progressed: 0,
      show: {
        name: "",
        picture: "",
        subName: "",
      },
      track: {
        artist: "",
        picture: "",
        title: "",
      },
      volume: 50,
      state: {
        playing: false,
      },
    };
  },
  actions: {
    setMetadata(arg: setMetadata) {
      this.progressed = arg.progressed;
      this.show = arg.show;
      this.track = arg.track;
    },
    playPause() {
      this.state.playing = !this.state.playing;
    },
  },
});
