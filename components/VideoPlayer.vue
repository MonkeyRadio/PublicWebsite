<template>
  <VideoPlayer
    ref="videojs"
    :src="url"
    :poster="poster"
    :loop="loop"
    :fluid="fluid"
    :aspect-ratio="aspectRatio"
    :autoplay="autoplay"
    :volume="playerStore.volume / 100"
    :muted="playerStore.muted"
    :html5="techConfig"
    :plays-inline="true"
    @ready="emit('ready')"
    @loadstart="onLoading"
    @playing="onPlaying"
    @pause="onPause"
  >
    <template #default="{ player, state }">
      <div v-if="controls" class="player-controls-container">
        <div class="bar bottom-bar">
          <div class="bar progress-bar">
            <VSlider
              v-if="state.ready && !state.isLive"
              v-model="state.currentTime"
              thumb-size="10"
              hide-details
              :max="state.duration"
              step="0.1"
            />
            <VSlider
              v-else
              v-model="state.currentTime"
              readonly
              thumb-size="0"
              hide-details
              :max="state.duration"
              step="0.1"
            />
          </div>

          <div class="bar control-bar align-center">
            <div class="left-controls d-flex v-col-4 align-center">
              <span
                class="icon-pointer v-col-auto"
                @click="state.playing ? player.pause() : player.play()"
              >
                <VIcon v-if="state.playing" size="35">mdi-pause</VIcon>
                <VIcon v-else size="35">mdi-play</VIcon>
              </span>

              <div class="d-flex v-col pa-0">
                <span
                  class="icon-pointer v-col-auto"
                  @click="playerStore.muted = !playerStore.muted"
                >
                  <VIcon v-if="state.muted" size="32">mdi-volume-off</VIcon>
                  <VIcon v-else-if="state.volume < 0.25" size="35">mdi-volume-low</VIcon>
                  <VIcon v-else-if="state.volume < 0.75" size="35">mdi-volume-medium</VIcon>
                  <VIcon v-else size="35">mdi-volume-high</VIcon>
                </span>
                <VSlider v-model="volume" thumb-size="10" hide-details />
              </div>
            </div>

            <span
              class="icon-pointer"
              @click="state.isFullscreen ? player.exitFullscreen() : player.requestFullscreen()"
            >
              <VIcon v-if="!state.isFullscreen" size="35">mdi-fullscreen</VIcon>
              <VIcon v-else size="35">mdi-fullscreen-exit</VIcon>
            </span>
          </div>
        </div>
      </div>
    </template>
  </VideoPlayer>
</template>

<script setup lang="ts">
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";
import { useNewPlayerStore } from "~/stores/newPlayerStore";
import { useRadioConfig } from "~/stores/radioConfig";
import { useStorage } from "@vueuse/core";
import type { DiffusionLink } from "@monkey-radio/api-client";
import "videojs-contrib-hls.js";
import { id3TagsManager } from "~/managers/id3TagsManager";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const videojs = ref<any | null>(null);

const props = withDefaults(
  defineProps<{
    link: DiffusionLink;
    poster: string;
    controls?: boolean;
    loop?: boolean;
    fluid?: boolean;
    aspectRatio?: string;
    autoplay?: boolean;
  }>(),
  {
    controls: true,
    loop: true,
    fluid: true,
    aspectRatio: "16:9",
    autoplay: true,
  },
);

const emit = defineEmits(["ready"]);

const radioConfig = useRadioConfig();
const playerStore = useNewPlayerStore();

const uuidGenerator = useUUIDGenerator();
const mediaSession = useMediaSession();

const cdn = useCDN();
const now = useNow();

const session = useStorage("sessionId", uuidGenerator.generate());

const url = computed(() => {
  const radioConfig = useRadioConfig();
  const config = useRuntimeConfig();
  if (!radioConfig.radio || !props.link) return;
  return `${config.public.diffusionUrl}/v1/diffusion/${props.link.containerType}/${radioConfig.radio.id}/${props.link.diffusionLink}?webapp-uuid=${session.value}`;
});

const volume = computed({
  get() {
    if (playerStore.muted) return 0;
    return playerStore.volume;
  },
  set(value) {
    if (value === 0) playerStore.muted = true;
    else playerStore.muted = false;
    playerStore.volume = value;
  },
});

const techConfig = computed(() => ({
  nativeTextTracks: true,
}));

const videoEl = computed<HTMLVideoElement | undefined>(() => {
  if (!videojs.value) return;
  return videojs.value.$el.player.tech_.el_;
});

const onPlaying = () => {
  playerStore.state = "playing";
  playerStore.updateSeekable();
};

const trackElapsed = computed(() => playerStore.getId3TrackElapsed(now.value.getTime()));

const saveId3Elapsed = () => {
  if (playerStore.id3Track && trackElapsed.value) {
    playerStore.savedId3TrackElapsed = trackElapsed.value;
  }
};

const onPause = () => {
  playerStore.state = "paused";
  playerStore.updateSeekable();
  saveId3Elapsed();
};

const onLoading = () => {
  playerStore.state = "loading";
  saveId3Elapsed();
};

const updateId3Tags = async (activeCues: TextTrackCueList) => {
  if (!radioConfig.radio?.id || playerStore.state !== "playing") return;
  if (!playerStore.id3Track)
    playerStore.id3Track = new id3TagsManager();
  await playerStore.id3Track.update(activeCues, radioConfig.radio.id, cdn);
  if (mediaSession.hasMediaSession())
    mediaSession.update({
      title: playerStore.id3Track.title || "No title",
      artist: playerStore.id3Track.artist || "No artist",
      album: playerStore.id3Track.album,
      artwork: playerStore.id3Track.artworkUrl || "",
    });
  else
    mediaSession.create(
      {
        title: playerStore.id3Track.title || "No title",
        artist: playerStore.id3Track.artist || "No artist",
        album: playerStore.id3Track.album,
        artwork: playerStore.id3Track.artworkUrl || "",
      },
      {
        play: () => playerStore.play(),
        pause: () => playerStore.pause(),
        stop: () => (playerStore.link = undefined),
        seekBackward: () => playerStore.seekBackward(10),
        seekForward: () => playerStore.seekForward(10),
      },
    );
};

const cueChange = () => {
  if (
    videoEl.value?.textTracks[0]?.activeCues &&
    videoEl.value.textTracks[0].activeCues.length > 0
  )
  return updateId3Tags(videoEl.value.textTracks[0].activeCues);
};

const addId3Event = () => {
  if (videoEl.value && videoEl.value.textTracks.length > 0)
      videoEl.value.textTracks[0].addEventListener("cuechange", cueChange);
};

onMounted(() => {
  if (videoEl.value)
    videoEl.value.textTracks.addEventListener("addtrack", addId3Event);
  playerStore.el = videoEl.value;
  if (!playerStore.id3Track)
    playerStore.id3Track = new id3TagsManager();
});

onBeforeUnmount(() => {
  if (videoEl.value)
    videoEl.value.textTracks.removeEventListener("addtrack", addId3Event);
  if (playerStore.id3Track) playerStore.id3Track.clear();
  mediaSession.clear();
  if (videoEl.value && videoEl.value.textTracks[0])
    videoEl.value.textTracks[0].removeEventListener("cuechange", cueChange);
});
</script>

<style scoped lang="scss">
.player-controls-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  .bar {
    display: flex;
    justify-content: space-between;

    &.bottom-bar {
      position: absolute;
      width: 100%;
      bottom: 0;
      flex-direction: column;
      padding: 0.5rem;
    }

    &.progress-bar {
      width: 100%;
    }
  }

  .icon-pointer {
    cursor: pointer;
    color: #ffffffb6;
    transition: color 0.2s ease-in-out;
    padding: 0 0.5rem;

    &:hover {
      color: #fff;
    }
  }
}
</style>
