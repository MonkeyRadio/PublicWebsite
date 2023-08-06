<script setup lang="ts">
import { useLiveMetaStore } from "@/stores/liveMetaStore";

const LiveMetaStore = useLiveMetaStore();

useHead({
  titleTemplate: "Monkey Radio",
  meta: [
    {
      name: "description",
      content: "Monkey Radio",
    },
  ],
});

onMounted(() => {
  // For model only
  LiveMetaStore.setShow({
    title: "NRJ Extravadance",
    description:
      "Le plus grand club du monde c'est NRJ Extravadance tout l'été ! Avec tous les plus gros hits Dance et les mix des plus grands DJ mondiaux : Tiësto, Martin Garrix, Armin Van Burren, Afrojack, Dimitri Vegas...",
    image: "https://cdn-profiles.tunein.com/p338733/images/logog.png?t=160130",
    ts: {
      start: 1691262000000,
      end: 1691294400000,
    },
  });
  LiveMetaStore.setTrack({
    title: "Love Tonight (David Guetta Remix Edit)",
    artist: "Shouse",
    cover: "https://i.scdn.co/image/ab67616d00001e0228eec1bed4fe754299ea1e96",
  });
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
    max-width: 45%;
  }
}
</style>
