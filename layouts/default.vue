<template>
  <div>
    <VApp :class="{ transition: true }">
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
            <VBtn color="primary" block @click="retry">Retry</VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <LoadingDialog v-model="uiStore.loader" />
      <ModalsErrorModal />
    </VApp>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from "@/stores/uiStore";

const uiStore = useUiStore();

const retry = () => {
  window.location.reload();
};

const networkError = ref(false);
</script>

<style lang="scss" scoped>
.transition {
  transition: all 0.3s;
}

.padding-for-bottom-player {
  padding-bottom: $bottom_player_height;
}
</style>
