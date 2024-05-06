import { useRadioConfig } from "@/stores/radioConfig";

export async function playLive() {
  const radioConfig = useRadioConfig();

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
