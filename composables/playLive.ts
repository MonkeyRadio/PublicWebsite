import { useRadioConfig } from "@/stores/radioConfig";
import { useAPI } from "@/services/api";
import { usePlayerStore } from "@/stores/playerStore";
import { useStorage } from '@vueuse/core'

export async function playLive(mode: string = "auto") {
  const radioConfig = useRadioConfig();
  const api = useAPI();
  const playerStore = usePlayerStore();
  const config = useRuntimeConfig();
  
  const session = useStorage("sessionId", crypto.randomUUID())

  if (playerStore.fired) {
    playerStore.fullscreen = true;
    return;
  }

  if (mode !== "audio") {
    try {
      if (!radioConfig.radio?.videoLiveUrl) throw new Error("No live url found");
      stopStuff();
      playerStore.fired = true;
      playerStore.fullscreen = true;
      return;
    }
    catch (e) {}
  }

  const stream = radioConfig.radio?.liveStream.find((s) => s.details === "live");
  if (!stream) {
    throw new Error("No live stream found");
  }
  const url = `${config.public.diffusionUrl}/v1/diffusion/${stream.containerType}/${radioConfig.radio?.id}/${stream?.diffusionLink}?webapp-uuid=${session.value}`;

  await playNewStuff(
    {
      type: "hls",
      url,
    },
    radioConfig.Live.metadataUrl,
    {
      title: "",
      subTitle: radioConfig.title,
      picture: radioConfig.picture,
    },
  );
}
