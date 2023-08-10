import { useRadioConfig } from "@/stores/radioConfig";

export function playLive() {
  const radioConfig = useRadioConfig();

  playNewStuff(
    {
      type: radioConfig.Live.type,
      url: radioConfig.Live.url,
    },
    radioConfig.Live.metadataUrl,
    {
      title: "",
      subTitle: radioConfig.title,
      picture: radioConfig.picture,
    },
  );
}