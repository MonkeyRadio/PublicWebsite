<script setup lang="ts">
import { usePlayerStore } from "@/stores/playerStore";

const playerStore = usePlayerStore();
</script>

<template>
  <div>
    <div class="actions-container">
      <v-progress-circular
        v-if="playerStore.state.loading && playerStore.state.playing"
        indeterminate
      ></v-progress-circular>
      <v-btn v-else icon variant="text" @click="playerStore.playPause">
        <v-icon v-if="playerStore.state.playing && !playerStore.state.loading">mdi-pause</v-icon>
        <v-icon v-else>mdi-play</v-icon>
      </v-btn>
    </div>
    <div class="actions-container"></div>
  </div>
</template>

<style lang="scss" scoped>
.actions-container {
  display: flex;
  justify-content: center;
}
</style>
