import hls from '@/services/hls.js'
import { usePlayerStore } from '@/stores/playerStore'
import type { Track } from '@/services/api'

type stuffMeta = {
    title: string;
    subTitle: string;
    picture: string;
}

let player: hls | undefined = undefined;

function setTrackMetadata (track: Track) {
    const PlayerStore = usePlayerStore();
    PlayerStore.setTrack({
        title: track.trackTitle,
        artist: track.trackArtist,
        picture: track.trackCover,
        ts: {
            start: track.trackTStart * 1000,
            duration: track.trackTDur * 1000,
            end: track.trackTStop * 1000,
        }
    });
}

export async function playNewStuff(opt: {
    type: "hls" | "ice";
    url: string
}, metadataFetchUrl: string, stuffMetadata: stuffMeta) {
    const PlayerStore = usePlayerStore();
    player = new hls(PlayerStore.getAudioRef());
    player.setMetadataUrl(metadataFetchUrl, setTrackMetadata);
    await player.load(opt.url);
    PlayerStore.getAudioRef().play();
    PlayerStore.getAudioRef().volume = PlayerStore.volume / 100;
    PlayerStore.setShow({
        name: stuffMetadata.title,
        subName: stuffMetadata.subTitle,
        picture: stuffMetadata.picture
    });
    PlayerStore.fired = true;
}

export async function stopStuff() {
    const PlayerStore = usePlayerStore();
    if (player) {
        player.destroy();
        player = undefined;
    }
    PlayerStore.fired = false;
    PlayerStore.getAudioRef().pause();
    PlayerStore.getAudioRef().src = "";
    PlayerStore.getAudioRef().load();
}
