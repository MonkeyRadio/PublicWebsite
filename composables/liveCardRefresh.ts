import { getCurrentShow, getCurrentTrack } from "@/services/api";
import { useLiveMetaStore } from "@/stores/liveMetaStore";


export async function liveCardRefresh() {
    const LiveMetaStore = useLiveMetaStore();
    const currentShow = await getCurrentShow();
    const currentTrack = await getCurrentTrack();
    LiveMetaStore.setShow({
        title: currentShow.epgTitle,
        description: currentShow.epgDesc,
        image: currentShow.epgCover,
        ts: {
            start: currentShow.epgStart * 1000,
            end: currentShow.epgStop * 1000,
        },
    });
    LiveMetaStore.setTrack({
        title: currentTrack.trackTitle,
        artist: currentTrack.trackArtist,
        cover: currentTrack.trackCover,
    });
}