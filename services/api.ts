let apiURL = "";

const ping = async () => {
  try {
    const c = await fetch(`${apiURL}/?ping`, {
      method: "GET",
    });
    if ((await c.text()) !== "pong") throw new Error("Can't ping API");
    return true;
  } catch (e) {
    throw new Error("Can't ping API");
  }
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

const getCurrentShow = async (): Promise<Show> => {
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
  trackAlbum: string;
  trackYearRelease: number;
  EncodedMediaKey: string;
};

const getCurrentTrack = async (): Promise<Track> => {
  const dataTrack: {
    current: Track;
  } = await $fetch(`${apiURL}/?cur`);
  return dataTrack.current;
};

const getMetadataWithEncodedDelay = async (url: string, delay: number): Promise<Track> => {
  let decodedUrl = url;
  const includeDelay = decodedUrl.includes("${delay}"); // eslint-disable-line
  if (includeDelay) decodedUrl = decodedUrl.replaceAll("${delay}", delay.toString()); // eslint-disable-line
  const dataTrack: {
    current: Track;
  } = await $fetch(`${apiURL}${decodedUrl}`);
  return dataTrack.current;
};

export type Onair = {
  tit: string;
  cover: string;
  DiffLinkPath: string;
  radioUrl: string;
  smallTit: string;
  DiffLinkType: "hls" | "ice";
  AutoDiffLinkPath: string;
  IceDiffLinkPath: string;
  WebDisTit: string;
  LiveMetadataURL: string;
  LiveLinkPathSQ: string;
  LiveLinkPathHQ: string;
};

const getRadioConfig = (): Promise<{
  onair: Onair;
}> => {
  return $fetch(`${apiURL}/?onair`);
};

const haveMediaPicture = (encodedMediaKey: string): Promise<boolean> => {
  const picture = new Image();
  return new Promise((resolve, _reject) => {
    picture.onload = () => {
      resolve(true);
    };
    picture.onerror = () => {
      resolve(false);
    };
    picture.src = `${apiURL}/MediaPicture?EncodedMediaKey=${encodeURIComponent(encodedMediaKey)}`;
  });
};

const getMediaPicture = (encodedMediaKey: string): string => {
  return `${apiURL}/MediaPicture?EncodedMediaKey=${encodeURIComponent(encodedMediaKey)}`;
};

export const useAPI = () => {
  apiURL = useRuntimeConfig().public.apiUrl;

  return {
    ping,
    getCurrentShow,
    getCurrentTrack,
    getMetadataWithEncodedDelay,
    getRadioConfig,
    haveMediaPicture,
    getMediaPicture,
  };
};
