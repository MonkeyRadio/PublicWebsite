<script setup lang="ts">
import { useNewPlayerStore } from "@/stores/newPlayerStore";
import { useRadioConfig } from "@/stores/radioConfig";

const radioConfig = useRadioConfig();

const playLive = () => {
  playerStore.link = radioConfig.liveLink;
  playerStore.fullscreen = true;
};

const playerStore = useNewPlayerStore();
</script>

<template>
  <ButtonLinkAnimatedWithIcon text="Live" class="live-button" @click="playLive">
    <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="currentColor" />
  </ButtonLinkAnimatedWithIcon>
</template>

<style lang="scss" scoped>
@media only screen and (max-width: 700px) {
  .container-fluid {
    padding: 25px 35px;

    .brand-logo {
      width: 55px;
      height: 55px;
      margin-right: 35px;
    }
  }

  .brand-name {
    font-size: $font-h3;
  }
}

@media only screen and (max-width: 450px) {
  .brand-name {
    display: none;
  }
}
</style>

<style lang="scss">
.live-button {
  p {
    font-size: $font-h2 !important;
    line-height: 1.1;
  }

  svg {
    width: 30px !important;
    height: 30px;
  }
}

@media only screen and (max-width: 700px) {
  .live-button {
    p {
      font-size: $font-h3 !important;
      line-height: 1.1;
    }

    svg {
      width: 20px !important;
      height: 20px;
    }
  }
}
</style>