<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  src: string;
}>();

const getCssImageBackground = computed(() => {
  return `background-image: url(${props.src});`;
});
</script>

<template>
  <div class="track-cover" :style="getCssImageBackground" />
</template>

<style lang="scss" scoped>
.track-cover {
  background-size: cover;
  background-position: center;
  transition: all 0.3s;
  width: 300px;
  height: 300px;
  border-radius: 50px;
  box-shadow:
    20px 20px 60px $primary-dimmed,
    -20px -20px 60px $primary-dimmed;
}
</style>
