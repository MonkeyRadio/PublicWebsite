import Hls from 'hls.js'
import type { Track } from '@/services/api'
import { getMetadataWithEncodedDelay } from '@/services/api'

export default class Hlsjs {

    private hls: Hls | null = null
    private metadataUrl: string = ""
    private onMetadataUpdated: ((track: Track) => void) | null = null

    constructor(private video: HTMLAudioElement) {
        this.hls = new Hls()
        this.hls.attachMedia(video)
    }

    load(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.hls?.loadSource(url);
            this.hls?.on(Hls.Events.MANIFEST_PARSED, () => {
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
        this.hls?.destroy()
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

}