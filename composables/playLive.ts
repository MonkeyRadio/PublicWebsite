import { useRadioConfig } from "@/stores/radioConfig";
import { useAPI } from "@/services/api";
import { usePlayerStore } from "@/stores/playerStore";

export async function playLive(mode: string = "auto") {
  const radioConfig = useRadioConfig();
  const api = useAPI();
  const playerStore = usePlayerStore();

  if (playerStore.fired) {
    playerStore.fullscreen = true;
    return;
  }

  if (mode !== "audio") {
    try {
      const { videoLiveUrl: liveUrl } = await api.newApi.radio.getByDomain();
      if (!liveUrl) throw new Error("No live url found");
      stopStuff();
      playerStore.fired = true;
      playerStore.fullscreen = true;
      return;
    }
    catch (e) {}
  }


  await playNewStuff(
    {
      type: radioConfig.Live.type,
      url: radioConfig.Live.url,
      urlHQ: radioConfig.Live.HQUrl,
    },
    radioConfig.Live.metadataUrl,
    {
      title: "",
      subTitle: radioConfig.title,
      picture: radioConfig.picture,
    },
  );
}
