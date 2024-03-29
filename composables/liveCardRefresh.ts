import { useAPI } from "@/services/api";
import { useLiveMetaStore } from "@/stores/liveMetaStore";

export async function liveCardRefresh() {
  const LiveMetaStore = useLiveMetaStore();
  const api = useAPI();
  const currentShow = await api.getCurrentShow();
  const currentTrack = await api.getCurrentTrack();
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
    encodedMediaKey: currentTrack.EncodedMediaKey,
  });
}
