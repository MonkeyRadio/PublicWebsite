<script setup lang="ts">
import { useUiStore } from "@/stores/uiStore";

const uiStore = useUiStore();

useHead({
  titleTemplate: "Monkey Radio",
  meta: [
    {
      name: "description",
      content: "Monkey Radio",
    },
  ],
});

onMounted(async () => {
  await liveCardRefresh();
  setInterval(liveCardRefresh, 10000);
});
</script>

<template>
  <div class="home-container">
    <CardsShowCard class="show-card"></CardsShowCard>
  </div>
</template>

<style lang="scss" scoped>
.home-container {
  display: flex;
  width: 100%;
  padding: 40px 100px;
  flex-wrap: wrap;

  .show-card {
    width: 100%;
    max-width: 800px;
  }
}

@media only screen and (max-width: 700px) {
  .home-container {
    padding: 40px 30px;
  }
}

@media only screen and (max-width: 450px) {
  .home-container {
    padding: 40px 10px;
  }
}
</style>
