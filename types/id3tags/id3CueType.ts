import type { id3TagType } from "./id3TagType";

export interface id3CueType extends VTTCue {
  value: id3TagType;
}
