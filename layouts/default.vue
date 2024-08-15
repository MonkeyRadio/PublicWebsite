<template>
  <div>
    <VApp :class="{ transition: true, 'padding-for-bottom-player': playerStore.fired }">
      <VMain>
        <LayoutsHeaderDefault />
        <slot />
      </VMain>
      <PlayerFullScreen />
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
      <LoadingDialog v-model="uiStore.loader" />
      <LayoutsBottomPlayer :fired="playerStore.fired" />
      <ModalsErrorModal />
    </VApp>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from "@/stores/playerStore";
import { useUiStore } from "@/stores/uiStore";

const playerStore = usePlayerStore();
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
