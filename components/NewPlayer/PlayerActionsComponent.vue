<script setup lang="ts">
import { useNewPlayerStore } from "~/stores/newPlayerStore";

const playerStore = useNewPlayerStore();
</script>

<template>
  <div>
    <div class="actions-container">
      <VBtn
        class="btn"
        :disabled="playerStore.state === 'loading' || !playerStore.seekable(-15)"
        icon
        variant="text"
        @click="playerStore.seekBackward(10)"
      >
        <VIcon>mdi-rewind-10</VIcon>
      </VBtn>
      <VProgressCircular v-if="playerStore.state == 'loading'" class="btn" indeterminate />
      <VBtn v-else class="btn" icon variant="text" @click="playerStore.toggle">
        <VIcon v-if="playerStore.state == 'playing'">mdi-pause</VIcon>
        <VIcon v-else>mdi-play</VIcon>
      </VBtn>
      <VBtn
        class="btn"
        :disabled="playerStore.state === 'loading' || !playerStore.seekable(+15)"
        icon
        variant="text"
        @click="playerStore.seekForward(10)"
      >
        <VIcon>mdi-fast-forward-10</VIcon>
      </VBtn>
      <VBtn
        v-if="playerStore.state === 'playing' && playerStore.seekable(+15)"
        class="btn"
        icon
        variant="text"
        @click="playerStore.seekToLive"
      >
        Live
      </VBtn>
    </div>
    <div class="actions-container" />
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
