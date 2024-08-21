type Media = {
  title: string;
  artist: string;
  artwork: string;
  album?: string;
};

type Handlers = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seekBackward: () => void;
  seekForward: () => void;
};

const createMediaSession = (media: Media) => {
  if (
    !navigator.mediaSession.metadata ||
    navigator.mediaSession.metadata.title !== media.title ||
    navigator.mediaSession.metadata.artist !== media.artist ||
    navigator.mediaSession.metadata.album !== media.album ||
    navigator.mediaSession.metadata.artwork[0].src !== media.artwork
  ) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: media.title,
      artist: media.artist,
      album: media.album,
      artwork: [
        {
          src: media.artwork,
          sizes: `800x800`,
          type: "image/png",
        },
      ],
    });
  }
};

export const useMediaSession = () => ({
  create: (media: Media, handlers: Handlers) => {
    createMediaSession(media);
    navigator.mediaSession.setActionHandler("play", () => {
      handlers.play();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      handlers.pause();
    });
    navigator.mediaSession.setActionHandler("stop", () => {
      handlers.stop();
    });
    navigator.mediaSession.setActionHandler("seekbackward", () => {
      handlers.seekBackward();
    });
    navigator.mediaSession.setActionHandler("seekforward", () => {
      handlers.seekForward();
    });
  },
  update: (media: Media) => {
    createMediaSession(media);
  },
  hasMediaSession: () => !!navigator.mediaSession.metadata,
  clear: () => {
    navigator.mediaSession.metadata = null;
  }
});
