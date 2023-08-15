<script setup lang="ts">
import { usePlayerStore } from "@/stores/playerStore";
import { usePlayerStorage } from "@/localStorage/playerPreferences";

const playerStore = usePlayerStore();
const playerStorage = usePlayerStorage();

const seekable = computed(() => {
  return {
    forward: playerStore.state.delay > 10,
    backward: playerStore.state.ref && playerStore.state.ref.currentTime > 10,
  };
});

function backward() {
  if (!playerStore.state.ref) return;
  playerStore.state.ref.currentTime -= 10;
}

function forward() {
  if (!playerStore.state.ref) return;
  playerStore.state.ref.currentTime += 10;
}

function toLive() {
  if (!playerStore.state.ref) return;
  playerStore.state.ref.currentTime += playerStore.state.delay - 3;
}

function switchQuality() {
  if (!playerStore.state.hlsjsInstance) return;
  playerStore.state.uhd = !playerStore.state.uhd;
  playerStore.state.hlsjsInstance.switchQuality(playerStore.state.uhd);
  playerStorage.set("HQ", playerStore.state.uhd);
}
</script>

<template>
  <div>
    <div class="actions-container">
      <v-btn
        :class="{ btn: true, 'btn-disabled': !playerStore.state.uhd }"
        icon
        variant="text"
        :disabled="!playerStore.qualitySwitchable"
        @click="switchQuality"
      >
        <v-icon>mdi-high-definition</v-icon>
      </v-btn>
      <v-btn class="btn" :disabled="!seekable.backward" icon variant="text" @click="backward">
        <v-icon>mdi-rewind-10</v-icon>
      </v-btn>
      <v-progress-circular
        v-if="playerStore.state.loading && playerStore.state.playing"
        class="btn"
        indeterminate
      ></v-progress-circular>
      <v-btn v-else class="btn" icon variant="text" @click="playerStore.playPause">
        <v-icon v-if="playerStore.state.playing && !playerStore.state.loading">mdi-pause</v-icon>
        <v-icon v-else>mdi-play</v-icon>
      </v-btn>
      <v-btn class="btn" :disabled="!seekable.forward" icon variant="text" @click="forward">
        <v-icon>mdi-fast-forward-10</v-icon>
      </v-btn>
      <v-btn class="btn" :disabled="!seekable.forward" icon variant="text" @click="toLive">
        Live
      </v-btn>
    </div>
    <div class="actions-container"></div>
  </div>
</template>

<style lang="scss" scoped>
.actions-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn {
  margin: 0 10px;
}

.btn-disabled {
  opacity: 0.26;
}
</style>
