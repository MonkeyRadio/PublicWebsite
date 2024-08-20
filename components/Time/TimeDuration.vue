<script setup lang="ts">
import dayjs from "dayjs";

const props = defineProps<{
  duration: number;
}>();

const humanDuration = computed(() => {
  if (!props.duration) return "00:00";
  if (props.duration > 3600000) return dayjs(props.duration).format("HH:mm:ss");
  return dayjs(props.duration).format("mm:ss");
});
</script>

<template>
  {{ humanDuration }}
</template>
