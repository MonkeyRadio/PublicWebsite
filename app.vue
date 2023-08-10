<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <audio ref="audioPlayer" @play="playerStore.playing" @pause="playerStore.pausing"></audio>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { ref, onMounted } from "vue";
import { usePlayerStore } from "@/stores/playerStore";
import { useRadioConfig } from "@/stores/radioConfig";

const playerStore = usePlayerStore();
const radioConfig = useRadioConfig();

const audioPlayer: Ref<HTMLAudioElement | null> = ref(null);

onMounted(() => {
  if (audioPlayer.value !== null) playerStore.bindAudioRef(audioPlayer as Ref<HTMLAudioElement>);
  radioConfig.retrieveRadioConfig();
});
</script>
