<script setup lang="ts">
import { brandConfig } from "@/constants/brandConfig";
import { isIOS } from "@vueuse/core";
import { useRadioConfig } from "@/stores/radioConfig";
import { useNewPlayerStore } from "~/stores/newPlayerStore";

const radioConfig = useRadioConfig();
const playerStore = useNewPlayerStore();

const now = useNow();

const videoMode = ref<boolean>(false);

const opened = computed({
  get() {
    return playerStore.fullscreen;
  },
  set(val) {
    playerStore.fullscreen = val;
  },
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

const volumePrependIcon = computed(() => {
  if (playerStore.muted) return "mdi-volume-mute";
  if (playerStore.volume === 0) return "mdi-volume-mute";
  if (playerStore.volume <= 35) return "mdi-volume-low";
  if (playerStore.volume <= 70) return "mdi-volume-medium";
  return "mdi-volume-high";
});

const trackElapsed = computed(() => {
  if (playerStore.state === "playing") return playerStore.getId3TrackElapsed(now.value.getTime());
  return playerStore.savedId3TrackElapsed;
});

const timingDisplayable = computed(
  () =>
    playerStore.id3Track &&
    playerStore.id3Track.duration &&
    playerStore.id3TrackDurationMs &&
    trackElapsed.value &&
    trackElapsed.value <= playerStore.id3TrackDurationMs,
);

const percentElapsed = computed(() => {
  if (trackElapsed.value && playerStore.id3TrackDurationMs)
    return (trackElapsed.value * 100) / playerStore.id3TrackDurationMs;
  return 0;
});
</script>

<template>
  <VDialog v-model="opened" eager fullscreen :scrim="false" transition="dialog-bottom-transition">
    <VCard color="primary">
      <VToolbar dark color="primary" class="card-toolbox" @click="playerStore.fullscreen = false">
        <VBtn icon dark @click="playerStore.fullscreen = false">
          <VIcon>mdi-chevron-down</VIcon>
        </VBtn>
        <VToolbar-title class="font-primary">{{ radioConfig.title }}</VToolbar-title>
        <v-spacer />
      </VToolbar>
      <div class="container-full">
        <div v-if="!videoMode" class="audio-mode container-full">
          <div v-if="playerStore.id3Track" class="track">
            <CardsPictureCard
              v-if="playerStore.id3Track.artworkUrl"
              :src="playerStore.id3Track.artworkUrl"
            />
            <img
              v-else
              class="brand-logo"
              :src="brandConfig.transparentLogo"
              :alt="`${brandConfig.brandName}'s logo'`"
            >
            <div class="summary">
              <h4 class="track-title">{{ playerStore.id3Track.title }}</h4>
              <h4 v-if="playerStore.id3Track.artist" class="track-artist">{{ playerStore.id3Track.artist }}</h4>
              <h4 v-else-if="radioConfig.radio" class="track-artist">{{ radioConfig.radio.name }}</h4>
              <h6
                v-if="playerStore.id3Track.album && playerStore.id3Track.year"
                class="track-album"
              >
                {{ playerStore.id3Track.album }} • {{ playerStore.id3Track.year }}
              </h6>
            </div>
          </div>
          <div class="track-timing-container">
            <div class="track-timing">
              <p><TimeDuration v-if="trackElapsed" :duration="trackElapsed" /></p>
              <p>
                <TimeDuration v-if="timingDisplayable" :duration="playerStore.id3TrackDurationMs" />
              </p>
            </div>
            <NewPlayerTrackProgressBar
              class="bar"
              :value="percentElapsed"
            />
          </div>
          <NewPlayerActionsComponent class="actions-component-container" />
        </div>
        <div v-show="videoMode" class="video-mode container-full">
          <VideoPlayer v-if="playerStore.link" :link="playerStore.link" :poster="''" />
          <div>
            <h4 v-if="playerStore.id3Track" class="mt-0 mb-0">{{ playerStore.id3Track.title }}</h4>
          </div>
        </div>
        <div class="videoModeToggle">
          <!-- <VBtn v-if="liveVideoUrl" variant="text" @click="videoMode = !videoMode">
            <span v-if="!videoMode">Switch to video mode</span>
            <span v-else>Switch to audio mode</span>
          </VBtn> -->
        </div>
      </div>
      <div v-if="!isIOS && !videoMode" class="center">
        <VSlider
          v-model="volume"
          class="volume-slider"
          :prepend-icon="volumePrependIcon"
          hide-details
          @click:prepend="playerStore.muted = !playerStore.muted"
        />
      </div>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.card-toolbox {
  cursor: pointer;
}

.container-full {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .brand-logo {
    width: 300px;
    height: 300px;
  }

  > * {
    margin: 10px 0px;
  }

  .track {
    display: flex;
    flex-direction: column;
    align-items: center;

    .summary {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 15px 0px;

      h4 {
        margin: 2px 0px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      .track-artist,
      .track-album {
        color: rgb(196, 196, 196);
      }

      .track-album {
        margin: 4px 0px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
  }

  .track-timing-container {
    width: 90%;
    max-width: 600px;

    .track-timing {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 30px;
      padding: 0px 2px;
    }

    .bar {
      width: 100%;
      border-radius: 5px;
      margin-top: 0px;
      margin-bottom: 20px;
    }
  }

  .actions-component-container {
    width: 80%;

    @media only screen and (min-width: 700px) {
      width: 400px;
    }
  }
}

.center {
  display: flex;
  justify-content: center;
  width: 100%;

  .volume-slider {
    width: 80%;
    max-width: 300px;
  }
}

.video-mode {
  height: 50vh;
  width: auto;
  max-width: calc(100% - 3rem);
  aspect-ratio: 16/9;
}

@media only screen and (min-width: 700px) {
  .video-mode {
    height: 70vh;
  }
}
</style>
