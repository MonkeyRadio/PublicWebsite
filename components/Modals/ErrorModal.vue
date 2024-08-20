<script setup lang="ts">
import { useUiStore } from "@/stores/uiStore";

const uiStore = useUiStore();
</script>

<template>
  <VDialog v-model="uiStore.errorModal.model" width="auto">
    <VCard>
      <VCard-title class="text-h5">
        {{ uiStore.errorModal.title }}
      </VCard-title>
      <VCard-text>
        {{ uiStore.errorModal.message }}
      </VCard-text>
      <VCard-actions>
        <VBtn color="primary" block @click="uiStore.errorModal.model = false">Ok</VBtn>
      </VCard-actions>
    </VCard>
  </VDialog>
</template>
