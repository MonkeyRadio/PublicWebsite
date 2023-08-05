<template>
  <div>
    <VApp>
      <VMain>
        <LayoutsHeaderDefault />
        <slot />
      </VMain>
      <VDialog v-model="networkError" width="auto" persistent>
        <VCard>
          <VCardText>
            <p class="red">Cannot connect to Monkey Radio...</p>
          </VCardText>
          <VCardActions>
            <v-btn color="primary" block @click="retry">Retry</v-btn>
          </VCardActions>
        </VCard>
      </VDialog>
      <Loading v-model="loading" />
    </VApp>
  </div>
</template>

<script setup lang="ts">
const retry = () => {
  window.location.reload();
};

const networkError = ref(false);
const loading = ref(false);

onNuxtReady(async () => {
  loading.value = true;

  try {
    await api.ping();
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    networkError.value = true;
  }
});
</script>
