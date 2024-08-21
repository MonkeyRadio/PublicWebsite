<script setup lang="ts">
import { useNewPlayerStore } from '@/stores/newPlayerStore';

const playerStore = useNewPlayerStore();
</script>

<template>
  <NewPlayerCore v-if="playerStore.link" />
</template>