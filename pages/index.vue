<script setup lang="ts">
import { useLiveMetaStore } from "@/stores/liveMetaStore";
import { getCurrentShow, getCurrentTrack } from '@/services/api'

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

async function refreshCardShow() {
  const currentShow = await getCurrentShow();
  const currentTrack = await getCurrentTrack();
  LiveMetaStore.setShow({
    title: currentShow.epgTitle,
    description: currentShow.epgDesc,
    image: currentShow.epgCover,
    ts: {
      start: currentShow.epgStart * 1000,
      end: currentShow.epgStop * 1000,
    },
  });
  LiveMetaStore.setTrack({
    title: currentTrack.trackTitle,
    artist: currentTrack.trackArtist,
    cover: currentTrack.trackCover,
  });
}

onMounted(async () => {
  refreshCardShow();
  setInterval(refreshCardShow, 10000);
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
