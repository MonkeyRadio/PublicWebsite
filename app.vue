<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <audio
      ref="audioPlayer"
      @play="playerStore.playing"
      @pause="playerStore.pausing"
      @waiting="playerStore.state.loading = true"
      @loadstart="playerStore.state.loading = true"
      @playing="playerStore.state.loading = false"
      @loadeddata="playerStore.state.loading = false"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { ref, onMounted } from "vue";
import { usePlayerStore } from "@/stores/playerStore";
import { useRadioConfig } from "@/stores/radioConfig";
import { useUiStore } from "@/stores/uiStore";

const playerStore = usePlayerStore();
const radioConfig = useRadioConfig();

const audioPlayer: Ref<HTMLAudioElement | null> = ref(null);

onMounted(() => {
  if (audioPlayer.value !== null) playerStore.bindAudioRef(audioPlayer as Ref<HTMLAudioElement>);
  radioConfig.retrieveRadioConfig();
});
</script>
