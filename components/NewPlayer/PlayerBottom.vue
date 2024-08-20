<script setup lang="ts">
import { computed } from "vue";
import { useNewPlayerStore } from "~/stores/newPlayerStore";

const playerStore = useNewPlayerStore();

const now = useNow();

const volumePrependIcon = computed(() => {
  if (playerStore.muted) return "mdi-volume-mute";
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
    if (playerStore.muted) return 0;
    return playerStore.volume;
  },
  set(value) {
    if (value === 0) playerStore.muted = true;
    else playerStore.muted = false;
    playerStore.volume = value;
  },
});

const trackElapsed = computed(() => {
  if (playerStore.state === "playing") return playerStore.getId3TrackElapsed(now.value.getTime());
  return playerStore.savedId3TrackElapsed;
});
</script>

<template>
  <div
    :class="{ 'bottom-player': true, 'bottom-player-opened': fired }"
    @click="playerStore.fullscreen = true"
  >
    <div class="bottom-player-progress-bar">
      <ProgressThinBar
        v-if="trackElapsed && playerStore.id3TrackDurationMs"
        :value="(trackElapsed * 100) / playerStore.id3TrackDurationMs"
        active-color="var(--primary)"
      />
    </div>
    <div class="bottom-player-container">
      <div class="show-summary">
        <CardsBottomPlayerTrackCard
          v-if="playerStore.event"
          :artist="playerStore.event.subtitle"
          :title="playerStore.event.title"
          :cover="playerStore.event.picture"
          class="show-card"
        />
      </div>
      <div class="track-summary">
        <CardsBottomPlayerTrackCard
          v-if="
            playerStore.id3Track &&
            playerStore.id3Track.artist &&
            playerStore.id3Track.title &&
            playerStore.id3Track.artworkUrl
          "
          :artist="playerStore.id3Track.artist"
          :title="playerStore.id3Track.title"
          :cover="playerStore.id3Track.artworkUrl"
          class="track-card"
        />
      </div>
      <div class="actions">
        <div class="actions-container" @click.stop>
          <VSlider
            v-model="volume"
            class="volume-slider"
            :prepend-icon="volumePrependIcon"
            hide-details
            @click:prepend="playerStore.muted = !playerStore.muted"
          />
          <VProgressCircular v-if="playerStore.state === 'loading'" indeterminate />
          <VBtn v-else icon variant="text" @click="playerStore.toggle">
            <VIcon v-if="playerStore.state === 'playing'">mdi-pause</VIcon>
            <VIcon v-else>mdi-play</VIcon>
          </VBtn>
          <VBtn icon="mdi-close" variant="text" @click="playerStore.link = undefined" />
          <VBtn icon="mdi-chevron-up" variant="text" @click="playerStore.fullscreen = true" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
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

        @media only screen and (max-width: 1024px) {
          width: fit-content;
        }

        .volume-slider {
          padding-right: 15px;
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
