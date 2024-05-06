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
    <div v-if="getCssImageBackground" class="track-cover" :style="getCssImageBackground"></div>
    <div class="track-information d-flex flex-column ga-1">
      <h6 v-if="title" class="track-title">{{ title }}</h6>
      <h6 v-if="artist" class="track-artist">{{ artist }}</h6>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.track-container {
  background-color: $primary-dimmed;
  border-radius: 5px;
  display: flex;
  height: 80px;
  align-items: center;
  width: fit-content;
  padding-right: 10px;
  min-width: 350px;
  max-width: 100%;

  .track-cover {
    background-size: cover;
    background-position: center;
    transition: all 0.3s;
    width: 80px;
    height: 80px;
    border-radius: 5px 0px 0px 5px;
    margin-right: 10px;
  }

  .track-information {
    width: calc(100% - 90px);

    .track-artist {
      color: gray;
    }

    * {
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

@media only screen and (max-width: 450px) {
  .track-container {
    min-width: unset;
  }
}
</style>
