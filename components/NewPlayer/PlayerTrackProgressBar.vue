<script setup lang="ts">
withDefaults(
  defineProps<{
    value: number;
    activeColor?: string;
  }>(),
  {
    activeColor: "rgb(255, 255, 255)",
  },
);
</script>

<template>
  <div class="progress-loader">
    <div class="progress" :style="`width: ${value}%`" />
  </div>
</template>

<style lang="scss" scoped>
.progress-loader {
  background: rgba(236, 236, 238, 0.253);
  height: 5px;
}

.progress {
  max-width: 100%;
  height: 5px;
  border-radius: 7px;
  background: v-bind(activeColor);
  transition: all 0.5s;
}
</style>
