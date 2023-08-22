import Hls from "hls.js";
import type { Track } from "@/services/api";
import { getMetadataWithEncodedDelay } from "@/services/api";
import { stuffMeta } from "composables/playNewStuff";
import { usePlayerStore } from "@/stores/playerStore";
import { usePlayerStorage } from "@/localStorage/playerPreferences";

type Media = {
  title: string;
  artist: string;
  album?: string;
  artwork: string;
};

export default class Hlsjs {
  private hls: Hls | null = null;
  private type: "hls" | "ice" = "hls";
  private url = "";
  private hqUrl = "";
  private isHQ = false;
  private metadataUrl = "";
  private onMetadataUpdated: ((track: Track) => void) | null = null;
  private show: stuffMeta | undefined = undefined;
  private onDestroy: (() => void) | null = null;
  private hlsReady = false;
  private bootActions = false;
  private latency = -1;

  private _construct() {
    if (Hls.isSupported()) this.hlsReady = true;
    this.hls = new Hls();
    this.hls.config.startLevel = -1;
    this.hls.config.liveSyncDurationCount = 3;
    this.hls.attachMedia(this.media);
  }

  constructor(private media: HTMLAudioElement) {
    this._construct();
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

  private _recoverOnNetworkError(hls: Hlsjs) {
    if (hls.hlsReady && hls.hls) {
      hls.hls.recoverMediaError();
      if (usePlayerStore().state.playing) hls.media.play();
    }
  }

  private _onError(reject: (reason?: any) => void = () => {}) {
    if (this.hlsReady && this.hls)
      this.hls?.on(Hls.Events.ERROR, (_event, data) => {
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) this._recoverOnNetworkError(this);
        reject(data);
      });
    else
      this.media.onerror = (event) => {
        reject(event);
      };
  }

  load(url: string, type: "hls" | "ice", hqUrl?: string): Promise<void> {
    this.url = url;
    this.type = type;
    if (hqUrl) this.hqUrl = hqUrl;
    if (type === "ice") this.hlsReady = false;
    const playerStorage = usePlayerStorage();
    if (playerStorage.get("HQ") && hqUrl) {
      const playerStore = usePlayerStore();
      playerStore.state.uhd = true;
      url = hqUrl;
    }
    return new Promise((resolve, reject) => {
      this._loadSource(url, type);
      this._onManifestParsed(resolve);
      this._onError(reject);
    });
  }

  switchQuality(isHQ?: boolean): Promise<void> {
    if (this.hqUrl === "") return new Promise(() => {});
    if (this.hls) this.hls.destroy();
    this._construct();
    navigator.mediaSession.metadata = null;
    navigator.mediaSession.playbackState = "none";
    this.bootActions = false;
    if (isHQ === undefined) isHQ = !this.isHQ;
    else this.isHQ = isHQ;
    return new Promise((_resolve, reject) => {
      this._loadSource(isHQ ? this.hqUrl : this.url, this.type);
      this._onManifestParsed(async () => {
        await this.media.play();
        this._onFragChanged();
      });
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
    usePlayerStore().state.delay = latency;
    const track = await getMetadataWithEncodedDelay(this.metadataUrl, latency);
    if (this.onMetadataUpdated) this.onMetadataUpdated(track);
  }

  private updateSeekingPossibilities() {
    try {
      const playerStore = usePlayerStore();
      playerStore.state.seekable.backward = this.media.currentTime > 10;
      playerStore.state.seekable.forward = this.media.seekable.end(0) >= this.media.currentTime + 5;
    } catch (e) {}
  }

  private _refreshMetadata(increaseLatency = 0) {
    try {
      let latency = 0;
      if (this.hlsReady && this.hls) {
        latency = this.hls.latency;
        if (this.hls.playingDate) {
          latency = (new Date().getTime() - this.hls.playingDate.getTime()) / 1000;
        }
      } else {
        const computedDuration = this.media.buffered.end(0);
        latency = Math.ceil(computedDuration - this.media.currentTime);
      }
      if (
        isNaN(this.latency) ||
        this.latency === -1 ||
        this.latency > latency + 1 ||
        this.latency < latency + 1
      )
        this.latency = latency;
      this.fetchMetadata(this.latency + increaseLatency);
    } catch (e) {}
  }

  private _onFragChanged() {
    if (this.hlsReady && this.hls) {
      this.hls?.on(Hls.Events.FRAG_CHANGED, () => {
        this._refreshMetadata();
      });
      this.media.onseeking = () => {
        this.updateSeekingPossibilities();
      };
      this.media.onplay = () => {
        this.updateSeekingPossibilities();
        this._refreshMetadata();
      };
    } else {
      this.media.onstalled = () => {
        this._refreshMetadata(4);
      };
      this.media.onseeking = () => {
        this._refreshMetadata(4);
        this.updateSeekingPossibilities();
      };
      this.media.onplay = () => {
        this._refreshMetadata(4);
        this.updateSeekingPossibilities();
      };
    }
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
