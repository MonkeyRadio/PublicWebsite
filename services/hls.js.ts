import Hls from 'hls.js'
import type { Track } from '@/services/api'
import { getMetadataWithEncodedDelay } from '@/services/api'
import { stuffMeta } from 'composables/playNewStuff'

type Media = {
    title: string;
    artist: string;
    album?: string;
    artwork: string;
}

export default class Hlsjs {

    private hls: Hls | null = null
    private metadataUrl: string = ""
    private onMetadataUpdated: ((track: Track) => void) | null = null
    private show: stuffMeta | undefined = undefined
    private onDestroy: (() => void) | null = null

    constructor(private video: HTMLAudioElement) {
        this.hls = new Hls()
        this.hls.attachMedia(video)
    }

    load(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.hls?.loadSource(url);
            this.hls?.on(Hls.Events.MANIFEST_PARSED, () => {
                this.createMediaSession();
                resolve()
            });
            this.hls?.on(Hls.Events.ERROR, (event, data) => {
                reject(data)
            });
        })
    }

    play() {
        this.video.play()
    }

    pause() {
        this.video.pause()
    }

    destroy() {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = "none";
        if (this.hls)
            this.hls.destroy()
        if (this.onDestroy)
            this.onDestroy()
    }

    private async fetchMetadata(latency: number) {
        const track = await getMetadataWithEncodedDelay(this.metadataUrl, latency);
        if (this.onMetadataUpdated) this.onMetadataUpdated(track);
    }

    setMetadataUrl(url: string, onMetadataUpdated?: (track: Track) => void) {
        this.metadataUrl = url;
        this.hls?.on(Hls.Events.FRAG_CHANGED, (event, data) => {
            if (!this.hls?.media) return;
            const latency = this.hls?.media?.duration - this.hls?.media?.currentTime;
            this.fetchMetadata(Math.round(latency));
        });
        if (onMetadataUpdated) this.onMetadataUpdated = onMetadataUpdated;
    }

    setShow(show: stuffMeta) {
        this.show = show;
    }

    private createMediaSession() {
        if (!this.show) return;
        this.updateMediaSession({
            title: this.show.title,
            artist: this.show.subTitle,
            artwork: this.show.picture
        });
        try {
            navigator.mediaSession.setActionHandler("play", () => {
                navigator.mediaSession.playbackState = "playing";
                this.video.play();
            });
            navigator.mediaSession.setActionHandler("pause", () => {
                navigator.mediaSession.playbackState = "paused";
                this.video.pause();
            });
            navigator.mediaSession.setActionHandler("stop", () => {
                this.destroy();
            });
        }
        catch (e) {
            console.error("Media Session API is not supported", e);
         }
    }

    updateMediaSession(media: Media) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: media.title,
            artist: media.artist,
            album: media.album,
            artwork: [
                {
                    src: media.artwork,
                    sizes: `200x200`,
                    type: "image/png"
                }
            ],
        });
    }

    setDestroyEvent(event: () => void) {
        this.onDestroy = event;
    }

}