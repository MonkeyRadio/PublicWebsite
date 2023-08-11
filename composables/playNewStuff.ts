import Hls from "@/services/hls.js";
import { usePlayerStore } from "@/stores/playerStore";
import { useRadioConfig } from "@/stores/radioConfig";
import { useUiStore } from "@/stores/uiStore";
import type { Track } from "@/services/api";

export type stuffMeta = {
  title: string;
  subTitle: string;
  picture: string;
};

let player: Hls | undefined;

function setTrackMetadata(track: Track) {
  const PlayerStore = usePlayerStore();
  const radioConfig = useRadioConfig();
  PlayerStore.setTrack({
    title: track.trackTitle,
    artist: track.trackArtist,
    picture: track.trackCover,
    ts: {
      start: track.trackTStart * 1000,
      duration: track.trackTDur * 1000,
      end: track.trackTStop * 1000,
    },
  });
  if (player)
    player.updateMediaSession({
      title: track.trackTitle,
      artist: track.trackArtist,
      album: radioConfig.title,
      artwork: track.trackCover,
    });
}

function onStopStuff() {
  const PlayerStore = usePlayerStore();
  PlayerStore.fired = false;
  PlayerStore.getAudioRef().pause();
  PlayerStore.getAudioRef().src = "";
  PlayerStore.getAudioRef().load();
}

export async function playNewStuff(
  opt: {
    type: "hls" | "ice";
    url: string;
  },
  metadataFetchUrl: string,
  stuffMetadata: stuffMeta,
) {
  stopStuff();
  const PlayerStore = usePlayerStore();
  const uiStore = useUiStore();
  PlayerStore.fired = true;
  player = new Hls(PlayerStore.getAudioRef());
  player.setDestroyEvent(onStopStuff);
  player.setMetadataUrl(metadataFetchUrl, setTrackMetadata);
  PlayerStore.setShow({
    name: stuffMetadata.title,
    subName: stuffMetadata.subTitle,
    picture: stuffMetadata.picture,
  });
  player.setShow(stuffMetadata);
  try {
    await player.load(opt.url, opt.type);
    PlayerStore.getAudioRef().play();
    PlayerStore.getAudioRef().volume = PlayerStore.volume / 100;
  } catch (e) {
    uiStore.newError(
      "Lecture impossible",
      "Une erreur est survenue lors de la récupération de ce contenu sur nos serveurs !",
    );
    PlayerStore.fired = false;
  }
}

export function stopStuff() {
  if (player) {
    player.destroy();
    player = undefined;
  }
  onStopStuff();
}
