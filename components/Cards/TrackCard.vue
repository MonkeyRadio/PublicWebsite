<script setup lang="ts">
const props = defineProps<{
  cover: string;
  title: string;
  artist: string;
}>();

const getCssImageBackground = computed(() => {
  return `background-image: url(${props.cover});`;
});
</script>

<template>
  <div class="track-container">
    <div class="track-cover" :style="getCssImageBackground"></div>
    <div class="track-information">
      <p class="track-title">{{ title }}</p>
      <p clss="track-artist">{{ artist }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.track-container {
  background-color: $primary-dimmed;
  border-radius: 2px;
  display: flex;
  height: 80px;
  align-items: center;
  width: fit-content;
  padding-right: 10px;

  .track-cover {
    background-size: cover;
    background-position: center;
    transition: all 0.3s;
    width: 80px;
    height: 80px;
    border-radius: 2px;
    margin-right: 10px;
  }

  .track-information {
    * {
      margin: 0;
    }
  }
}
</style>
