<script setup lang="ts">
import { useLiveMetaStore } from "@/stores/liveMetaStore";
import { getCurrentShow, getCurrentTrack } from "@/services/api";

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
    description: `Les DJ superstars mixent dans l’émission référence du clubbing et de la dance présenté par Thibault : un DJ différent prendra les commandes de l’antenne pour des sets exclusifs.

Retrouvez également Thibault dans La Story NRJ Extravadance : votre podcast NRJ où vous découvrez les meilleures anecdotes de vos DJ’s préférés.`,
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
