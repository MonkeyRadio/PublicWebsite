<script setup lang="ts">
import { useLiveMetaStore } from "@/stores/liveMetaStore";

const LiveMetaStore = useLiveMetaStore();

const getCssImageBackground = computed(() => {
  return `background-image: url(${LiveMetaStore.show.image});`;
});

const getTimeStart = computed(() => {
  return ("0" + new Date(LiveMetaStore.show.ts.start).getHours()).slice(-2);
});

const getTimeStop = computed(() => {
  return ("0" + new Date(LiveMetaStore.show.ts.end).getHours()).slice(-2);
});

const percentageElapsed = ref(0);

function getPercentageElapsed() {
  const duration = LiveMetaStore.show.ts.start - LiveMetaStore.show.ts.end;
  const elapsed = LiveMetaStore.show.ts.start - new Date().getTime();
  return (elapsed * 100) / duration;
}

onMounted(() => {
  setInterval(() => {
    percentageElapsed.value = getPercentageElapsed();
  }, 200);
});
</script>

<template>
  <div class="card">
    <div class="show-summary">
      <div class="show-image" :style="getCssImageBackground"></div>
      <div class="show-side">
        <h3 class="show-name">{{ LiveMetaStore.show.title }}</h3>
        <div class="show-progress">
          <div class="show-hours">
            <h5>{{ getTimeStart }}h</h5>
            <h5>{{ getTimeStop }}h</h5>
          </div>
          <ProgressRoundedBar
            :value="percentageElapsed"
            active-color="var(--primary)"
          ></ProgressRoundedBar>
        </div>
        <p class="show-desc">{{ LiveMetaStore.show.description }}</p>
      </div>
    </div>
    <CardsTrackCard
      :title="LiveMetaStore.track.title"
      :artist="LiveMetaStore.track.artist"
      :cover="LiveMetaStore.track.cover"
    ></CardsTrackCard>
  </div>
</template>

<style lang="scss" scoped>
.card {
  padding: 50px;
  border-style: solid;
  border-color: $primary;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .show-summary {
    display: flex;
    padding-bottom: 50px;

    .show-image {
      background-size: cover;
      background-position: center;
      transition: all 0.3s;
      width: 300px;
      height: 300px;
      border-radius: 30px;
      margin-right: 25px;
    }

    .show-side {
      max-width: 50%;

      padding: 25px 0px;

      * {
        margin: 0px;
      }

      .show-hours {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-top: 15px;
      }

      .show-desc {
        margin-top: 15px;
        margin-left: 2px;
        height: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
