<script setup lang="ts">
import { useLiveMetaStore } from "@/stores/liveMetaStore";
import { usePlayerStore } from '@/stores/playerStore';
import { getCurrentShow, getCurrentTrack } from "@/services/api";

const LiveMetaStore = useLiveMetaStore();
const playerStore = usePlayerStore();

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
  playerStore.setMetadata({
    progressed: (new Date().getTime() - (currentTrack.trackTStart * 1000)) * 100 / (currentTrack.trackTDur * 1000),
    show: {
      name: currentShow.epgTitle,
      subName: currentShow.epgHosts,
      picture: currentShow.epgCover
    },
    track: {
      title: currentTrack.trackTitle,
      artist: currentTrack.trackArtist,
      picture: currentTrack.trackCover
    }
  })
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
