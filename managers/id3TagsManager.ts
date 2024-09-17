import type { id3CueType } from "~/types/id3tags/id3CueType";
import type { id3TrackType } from "~/types/id3tags/id3TrackType";
import type { CDN } from "@/composables/useCDN";

export class id3TagsManager {
  private customTags: Record<string, unknown> = {};
  private tags: Record<string, string> = {};
  private _artworkUrl: string | undefined = undefined;

  public async update(id3tracks: TextTrackCueList, radioId: string, cdn: CDN) {
    const cues: id3CueType[] = [];
    for (let i = 0; i < id3tracks.length; i++) {
      const cue = id3tracks[i] as id3CueType;
      cues.push(cue);
    }
    cues.sort((el1, el2) => el1.startTime - el2.startTime);
    this.tags = {};
    for (const cue of cues) {
      const tag = cue.value;
      this.tags[tag.key] = tag.data;
    }
    const oldInternalId = this.internalId;
    try {
      this.customTags = JSON.parse(this.comment || "{}");
    } catch {
      this.customTags = {};
    }
    if (this.internalId !== oldInternalId) await this.fetchArtworkUrl(radioId, cdn);
  }

  private async fetchArtworkUrl(radioId: string, cdn: CDN) {
    const trackUrl = cdn.radio.getTrackCover(radioId, this.internalId || "");
    const response = await fetch(trackUrl, { method: "HEAD" });
    if (response.ok) return (this._artworkUrl = trackUrl);
    const radioUrl = cdn.radio.getTrackCover(radioId, radioId);
    const radioResponse = await fetch(radioUrl, { method: "HEAD" });
    if (radioResponse.ok) return (this._artworkUrl = radioUrl);
  }

  public clear(): void {
    this.tags = {};
    this.customTags = {};
    this._artworkUrl = undefined;
  }

  public get title(): string | undefined {
    return this.tags["TIT2"];
  }

  public get artist(): string | undefined {
    return this.tags["TPE1"];
  }

  public get album(): string | undefined {
    return this.tags["TALB"];
  }

  public get tsPosted(): number | undefined {
    return Number(this.tags["TDAT"]) || undefined;
  }

  public get year(): number | undefined {
    return Number(this.tags["TYER"]) || undefined;
  }

  private get comment(): string | undefined {
    return this.tags["COMM"];
  }

  public get internalId(): string | undefined {
    if (!this.customTags) return;
    return this.customTags["internalId"] as string;
  }

  public get type(): id3TrackType | undefined {
    if (!this.customTags) return;
    return this.customTags["type"] as id3TrackType;
  }

  public get video(): boolean {
    if (!this.customTags) return false;
    return (this.customTags["video"] as boolean) || false;
  }

  public get displayMetadata(): boolean {
    if (!this.customTags) return false;
    return (this.customTags["displayMetadata"] as boolean) || false;
  }

  public get tsUpdated(): number | undefined {
    if (!this.customTags) return;
    return this.customTags["tsUpdated"] as number;
  }

  public get duration(): number | undefined {
    if (!this.customTags) return;
    return this.customTags["duration"] as number;
  }

  public get artworkUrl(): string | undefined {
    return this._artworkUrl;
  }

  public toResponse() {
    return {
      title: this.title,
      artist: this.artist,
      album: this.album,
      tsPosted: this.tsPosted,
      year: this.year,
      internalId: this.internalId,
      type: this.type,
      video: this.video,
      displayMetadata: this.displayMetadata,
      tsUpdated: this.tsUpdated,
    };
  }

  public getElapsed(timestamp: number, delay: number): number {
    if (!this.tsPosted) return 0;
    return timestamp - this.tsPosted - 1000 - delay;
  }
}
