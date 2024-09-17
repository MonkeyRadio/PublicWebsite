<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRadioConfig } from "@/stores/radioConfig";

const radioConfig = useRadioConfig();

onMounted(() => {
  radioConfig.retrieveRadioConfig();
});
</script>
