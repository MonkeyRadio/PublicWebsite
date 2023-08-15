<script setup lang="ts">
import { useRadioConfig } from "@/stores/radioConfig";
import { usePlayerStore } from "@/stores/playerStore";

const radioConfig = useRadioConfig();
const playerStore = usePlayerStore();

const percentageElapsed = ref(0);

const opened = computed({
  get() {
    return playerStore.fullscreen && playerStore.fired;
  },
  set(val) {
    playerStore.fullscreen = val;
  },
});

function getPercentageElapsed() {
  const elapsed = new Date().getTime() - playerStore.track.ts.start;
  return (elapsed * 100) / playerStore.track.ts.duration;
}

const volume = computed({
  get() {
    return playerStore.volume;
  },
  set(value) {
    playerStore.setVolume(value);
  },
});

const volumePrependIcon = computed(() => {
  if (playerStore.volume === 0) return "mdi-volume-mute";
  if (playerStore.volume <= 35) return "mdi-volume-low";
  if (playerStore.volume <= 70) return "mdi-volume-medium";
  return "mdi-volume-high";
});

const trackTimingElapsed = ref("");
const trackTimingDuration = ref("");

function getTrackTiming() {
  const elapsed = new Date().getTime() - playerStore.track.ts.start;
  const duration = playerStore.track.ts.duration;
  if (elapsed > 600000) trackTimingElapsed.value = new Date(elapsed).toISOString().slice(14, 19);
  else trackTimingElapsed.value = new Date(elapsed).toISOString().slice(15, 19);
  if (duration > 600000) trackTimingDuration.value = new Date(duration).toISOString().slice(14, 19);
  else trackTimingDuration.value = new Date(duration).toISOString().slice(15, 19);
}

onMounted(() => {
  setInterval(() => {
    if (!playerStore.state.playing || playerStore.state.loading) return;
    percentageElapsed.value = getPercentageElapsed();
    getTrackTiming();
  }, 100);
});
</script>

<template>
  <v-dialog v-model="opened" fullscreen :scrim="false" transition="dialog-bottom-transition">
    <v-card color="primary">
      <v-toolbar dark color="primary" class="card-toolbox" @click="playerStore.fullscreen = false">
        <v-btn icon dark @click="playerStore.fullscreen = false">
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
        <v-toolbar-title>{{ radioConfig.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div class="container-full">
        <div class="track">
          <CardsPictureCard :src="playerStore.track.picture" />
          <div class="summary">
            <h4 class="track-title">{{ playerStore.track.title }}</h4>
            <h4 class="track-artist">{{ playerStore.track.artist }}</h4>
          </div>
        </div>
        <div class="track-timing-container">
          <div class="track-timing">
            <p>{{ trackTimingElapsed }}</p>
            <p>{{ trackTimingDuration }}</p>
          </div>
          <PlayerTrackProgressBar class="bar" :value="percentageElapsed" />
        </div>
        <PlayerActionsComponent class="actions-component-container" />
      </div>
      <div v-if="!isIOSDevice()" class="center">
        <v-slider
          v-model="volume"
          class="volume-slider"
          :prepend-icon="volumePrependIcon"
          hide-details
          @click:prepend="volume = 0"
        ></v-slider>
      </div>
    </v-card>
  </v-dialog>
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
        -webkit-box-orient: vertical;
      }

      .track-artist {
        color: rgb(196, 196, 196);
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
</style>
