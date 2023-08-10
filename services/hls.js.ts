import Hls from "hls.js";
import type { Track } from "@/services/api";
import { getMetadataWithEncodedDelay } from "@/services/api";
import { stuffMeta } from "composables/playNewStuff";

type Media = {
  title: string;
  artist: string;
  album?: string;
  artwork: string;
};

export default class Hlsjs {
  private hls: Hls | null = null;
  private metadataUrl = "";
  private onMetadataUpdated: ((track: Track) => void) | null = null;
  private show: stuffMeta | undefined = undefined;
  private onDestroy: (() => void) | null = null;
  private hlsReady = false;
  private bootActions = false;

  constructor(private media: HTMLAudioElement) {
    if (Hls.isSupported()) this.hlsReady = true;
    this.hls = new Hls();
    this.hls.attachMedia(media);
  }

  private _loadSource(url: string, _type: "hls" | "ice") {
    if (this.hlsReady && this.hls) this.hls?.loadSource(url);
    else {
      this.media.src = url;
      this.media.load();
    }
  }

  private _onManifestParsed(resolve: () => void = () => {}) {
    if (this.hlsReady && this.hls)
      this.hls?.on(Hls.Events.MANIFEST_PARSED, () => {
        if (this.bootActions) return;
        this.bootActions = true;
        this.createMediaSession();
        resolve();
      });
    else
      this.media.oncanplay = () => {
        if (this.bootActions) return;
        this.bootActions = true;
        this.createMediaSession();
        resolve();
      };
  }

  private _onError(reject: (reason?: any) => void = () => {}) {
    if (this.hlsReady && this.hls)
      this.hls?.on(Hls.Events.ERROR, (_event, data) => {
        reject(data);
      });
    else
      this.media.onerror = (event) => {
        reject(event);
      };
  }

  load(url: string, type: "hls" | "ice"): Promise<void> {
    if (type === "ice") this.hlsReady = false;
    return new Promise((resolve, reject) => {
      this._loadSource(url, type);
      this._onManifestParsed(resolve);
      this._onError(reject);
    });
  }

  play() {
    this.media.play();
  }

  pause() {
    this.media.pause();
  }

  destroy() {
    navigator.mediaSession.metadata = null;
    navigator.mediaSession.playbackState = "none";
    if (this.hls) this.hls.destroy();
    if (this.onDestroy) this.onDestroy();
  }

  private async fetchMetadata(latency: number) {
    const track = await getMetadataWithEncodedDelay(this.metadataUrl, latency);
    if (this.onMetadataUpdated) this.onMetadataUpdated(track);
  }

  private _onFragChanged() {
    if (this.hlsReady && this.hls)
      this.hls?.on(Hls.Events.FRAG_CHANGED, () => {
        if (!this.hls?.media) return;
        const latency = this.hls?.media?.duration - this.hls?.media?.currentTime;
        this.fetchMetadata(Math.round(latency));
      });
    else
      this.media.ontimeupdate = () => {
        if (!this.media) return;
        const latency = this.media.duration - this.media.currentTime;
        this.fetchMetadata(Math.round(latency));
      };
  }

  setMetadataUrl(url: string, onMetadataUpdated?: (track: Track) => void) {
    this.metadataUrl = url;
    this._onFragChanged();
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
      artwork: this.show.picture,
    });
    try {
      navigator.mediaSession.setActionHandler("play", () => {
        navigator.mediaSession.playbackState = "playing";
        this.media.play();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        navigator.mediaSession.playbackState = "paused";
        this.media.pause();
      });
      navigator.mediaSession.setActionHandler("stop", () => {
        this.destroy();
      });
    } catch (e) {}
  }

  updateMediaSession(media: Media) {
    if (
      !navigator.mediaSession.metadata ||
      navigator.mediaSession.metadata.title !== media.title ||
      navigator.mediaSession.metadata.artist !== media.artist ||
      navigator.mediaSession.metadata.album !== media.album ||
      navigator.mediaSession.metadata.artwork[0].src !== media.artwork
    )
      navigator.mediaSession.metadata = new MediaMetadata({
        title: media.title,
        artist: media.artist,
        album: media.album,
        artwork: [
          {
            src: media.artwork,
            sizes: `200x200`,
            type: "image/png",
          },
        ],
      });
  }

  setDestroyEvent(event: () => void) {
    this.onDestroy = event;
  }
}
