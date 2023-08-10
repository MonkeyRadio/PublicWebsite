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
