<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <audio ref="audioPlayer" @play="playerStore.playing" @pause="playerStore.pausing"></audio>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/playerStore'
import { useRadioConfig } from '@/stores/radioConfig'
import type { Ref } from 'vue'
import { ref, onMounted } from 'vue'

const playerStore = usePlayerStore();
const radioConfig = useRadioConfig();

const audioPlayer: Ref<HTMLAudioElement | null> = ref(null);

onMounted(() => {
  if (audioPlayer.value !== null)
    playerStore.bindAudioRef(audioPlayer as Ref<HTMLAudioElement>);
  radioConfig.retrieveRadioConfig();
});
</script>