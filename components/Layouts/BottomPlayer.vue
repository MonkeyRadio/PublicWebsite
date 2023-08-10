<script setup lang="ts">
import { computed } from "vue";
import { usePlayerStore } from "@/stores/playerStore";

const playerStore = usePlayerStore();

const volumePrependIcon = computed(() => {
  if (playerStore.volume === 0) return "mdi-volume-mute";
  if (playerStore.volume <= 35) return "mdi-volume-low";
  if (playerStore.volume <= 70) return "mdi-volume-medium";
  return "mdi-volume-high";
});

defineProps<{
  fired: boolean;
}>();

const volume = computed({
  get() {
    return playerStore.volume;
  },
  set(value) {
    playerStore.setVolume(value);
  },
});

const percentageElapsed = ref(0);

function getPercentageElapsed() {
  const elapsed = new Date().getTime() - playerStore.track.ts.start;
  return (elapsed * 100) / playerStore.track.ts.duration;
}

onMounted(() => {
  setInterval(() => {
    percentageElapsed.value = getPercentageElapsed();
  }, 200);
});
</script>

<template>
  <div
    :class="{ 'bottom-player': true, 'bottom-player-opened': fired }"
    @click="console.log('CLICKED')"
  >
    <div class="bottom-player-progress-bar">
      <ProgressThinBar :value="percentageElapsed" active-color="var(--primary)"></ProgressThinBar>
    </div>
    <div class="bottom-player-container">
      <div class="show-summary">
        <CardsBottomPlayerTrackCard
          :artist="playerStore.show.subName"
          :title="playerStore.show.name"
          :cover="playerStore.show.picture"
          class="show-card"
        ></CardsBottomPlayerTrackCard>
      </div>
      <div class="track-summary">
        <CardsBottomPlayerTrackCard
          :artist="playerStore.track.artist"
          :title="playerStore.track.title"
          :cover="playerStore.track.picture"
          class="track-card"
        ></CardsBottomPlayerTrackCard>
      </div>
      <div class="actions">
        <div class="actions-container" @click.stop>
          <v-slider
            v-model="volume"
            class="volume-slider"
            :prepend-icon="volumePrependIcon"
            hide-details
            @click:prepend="volume = 0"
          ></v-slider>
          <v-btn icon variant="text" @click="playerStore.playPause">
            <v-icon v-if="playerStore.state.playing">mdi-pause</v-icon>
            <v-icon v-else>mdi-play</v-icon>
          </v-btn>
          <v-btn icon="mdi-close" variant="text" @click="stopStuff"></v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$bottom_player_height: 90px;

.bottom-player {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: rgb(37, 37, 37);
  width: 100vw;
  height: $bottom_player_height;
  transform: translateY($bottom_player_height);
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background-color: rgb(54, 54, 54);
  }

  .bottom-player-progress-bar {
    position: absolute;
    width: 100%;
  }

  .bottom-player-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 25px;
    height: 100%;
    margin-top: 2px;

    .show-summary {
      flex: 1;
      display: flex;

      @media only screen and (max-width: 1024px) {
        display: none;
      }

      .show-card {
        background-color: transparent;
      }
    }

    .track-summary {
      flex: 1;
      display: flex;
      justify-content: center;

      @media only screen and (max-width: 1024px) {
        justify-content: start;
      }

      .track-card {
        background-color: transparent;
        width: fit-content;
        max-width: 350px;
      }
    }

    .actions {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      padding-right: 15px;

      .actions-container {
        width: 100%;
        justify-content: flex-end;
        max-width: 300px;
        display: flex;
        align-items: center;
        cursor: initial;

        .volume-slider {
          @media only screen and (max-width: 1024px) {
            display: none;
          }
        }
      }
    }
  }
}

.bottom-player-opened {
  transform: translateY(0);
}

@media only screen and (max-width: 450px) {
  .bottom-player {
    .bottom-player-container {
      .track-summary {
        justify-content: start;

        .track-card {
          max-width: 50vw;
        }
      }
    }
  }
}
</style>
