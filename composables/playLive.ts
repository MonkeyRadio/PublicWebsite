import { usePlayerStore } from '@/stores/playerStore'
import { useRadioConfig } from '@/stores/radioConfig'

export async function playLive() {
    const PlayerStore = usePlayerStore();
    const radioConfig = useRadioConfig();

    playNewStuff({
        type: radioConfig.Live.type,
        url: radioConfig.Live.url
    }, radioConfig.Live.metadataUrl, {
        title: "",
        subTitle: radioConfig.title,
        picture: radioConfig.picture
    });
}