import { useStorage } from "@vueuse/core";
import { useRadioConfig } from "@/stores/radioConfig";
import { usePlayerStore } from "@/stores/playerStore";

export async function playLive(mode = "auto") {
  const radioConfig = useRadioConfig();
  const playerStore = usePlayerStore();
  const config = useRuntimeConfig();

  const session = useStorage("sessionId", crypto.randomUUID());

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
    } catch (e) {}
  }

  const stream = radioConfig.radio?.liveStream.find((s) => s.details === "live");
  const availableType = ["hls", "ice"];
  if (!stream || !availableType.includes(stream.containerType)) {
    throw new Error("No live stream found");
  }
  const url = `${config.public.diffusionUrl}/v1/diffusion/${stream.containerType}/${radioConfig.radio?.id}/${stream?.diffusionLink}?webapp-uuid=${session.value}`;

  await playNewStuff(
    {
      type: stream.containerType as "hls" | "ice",
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
