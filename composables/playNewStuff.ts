import Hls from "@/services/hls.js";
import { usePlayerStore } from "@/stores/playerStore";
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
  PlayerStore.setTrack(
    {
      title: track.trackTitle,
      artist: track.trackArtist,
      picture: track.trackCover,
      ts: {
        start: track.trackTStart * 1000,
        duration: track.trackTDur * 1000,
        end: track.trackTStop * 1000,
      },
      album: track.trackAlbum,
      year: track.trackYearRelease,
      encodedMediaKey: track.EncodedMediaKey,
    },
    (track) => {
      if (player)
        player.updateMediaSession({
          title: track.title,
          artist: track.artist,
          album: track.album,
          artwork: track.picture,
        });
    },
  );
  if (player)
    player.updateMediaSession({
      title: track.trackTitle,
      artist: track.trackArtist,
      album: track.trackAlbum,
      artwork: track.trackCover,
    });
}

function onStopStuff() {
  const PlayerStore = usePlayerStore();
  PlayerStore.reset();
  PlayerStore.getAudioRef().pause();
  PlayerStore.getAudioRef().src = "";
  PlayerStore.getAudioRef().load();
}

export async function playNewStuff(
  opt: {
    type: "hls" | "ice";
    url: string;
    urlHQ?: string;
  },
  metadataFetchUrl: string,
  stuffMetadata: stuffMeta,
) {
  const PlayerStore = usePlayerStore();
  if (PlayerStore.fired) {
    PlayerStore.fullscreen = true;
    return;
  }
  stopStuff();
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
  PlayerStore.state.hlsjsInstance = player;
  player.setShow(stuffMetadata);
  PlayerStore.fullscreen = true;
  try {
    await player.load(opt.url, opt.type, opt.urlHQ);
    if (opt.urlHQ) PlayerStore.qualitySwitchable = true;
    PlayerStore.getAudioRef().play();
    PlayerStore.getAudioRef().volume = PlayerStore.volume / 100;
  } catch {
    uiStore.newError(
      "Lecture impossible",
      "Une erreur est survenue lors de la récupération de ce contenu sur nos serveurs !",
    );
    PlayerStore.fired = false;
  }
}

export function stopStuff() {
  if (player) {
    const PlayerStore = usePlayerStore();
    PlayerStore.videoMode = false;
    player.destroy();
    player = undefined;
  }
  onStopStuff();
}
