const apiURL = "https://api.monkeyradio.fr";

export const api = {
  ping: async () => {
    try {
      const c = await fetch(`${apiURL}/?ping`, {
        method: "GET",
      });
      if ((await c.text()) !== "pong") throw new Error("Can't ping API");
      return true;
    } catch (e) {
      throw new Error("Can't ping API");
    }
  },
};

export type Show = {
  epgBann: string;
  epgCover: string;
  epgDesc: string;
  epgHosts: string;
  epgStart: number;
  epgStop: number;
  epgTitle: string;
};

export const getCurrentShow = async (): Promise<Show> => {
  const dataShow: {
    epgNow: Show;
  } = await $fetch(`${apiURL}/?epgnow`);
  return dataShow.epgNow;
};

export type Track = {
  Type: string;
  late: number;
  trackArtist: string;
  trackCover: string;
  trackTDur: number;
  trackTStart: number;
  trackTStop: number;
  trackTitle: string;
};

export const getCurrentTrack = async (): Promise<Track> => {
  const dataTrack: {
    current: Track;
  } = await $fetch(`${apiURL}/?cur`);
  return dataTrack.current;
};

export const getMetadataWithEncodedDelay = async (url: string, delay: number): Promise<Track> => {
  let decodedUrl = url;
  if (decodedUrl.includes("${delay}"))
    decodedUrl = decodedUrl.replaceAll("${delay}", delay.toString());
  const dataTrack: {
    current: Track;
  } = await $fetch(`${apiURL}${decodedUrl}`);
  return dataTrack.current;
}

export type Onair = {
  tit: string;
  cover: string;
  DiffLinkPath: string;
  radioUrl: string;
  smallTit: string;
  DiffLinkType: "hls" | "ice";
  AutoDiffLinkPath: string
  IceDiffLinkPath: string;
  WebDisTit: string;
  LiveMetadataURL: string
}

export const getRadioConfig = async (): Promise<{
  onair: Onair;
}> => {
  return $fetch(`${apiURL}/?onair`);
}