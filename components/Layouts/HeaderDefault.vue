<script setup lang="ts">
import { brandConfig } from "@/constants/brandConfig";
import { useNewPlayerStore } from "~/stores/newPlayerStore";
import { useRadioConfig } from "~/stores/radioConfig";

const radioConfig = useRadioConfig();
const playerStore = useNewPlayerStore();

const playLive = () => {
  playerStore.link = radioConfig.liveLink;
  playerStore.fullscreen = true;
};
</script>

<template>
  <div class="container-fluid">
    <div class="brand">
      <img
        class="brand-logo"
        :src="brandConfig.brandLogo"
        :alt="`${brandConfig.brandName}'s logo'`"
      />
      <h1 class="brand-name">{{ brandConfig.brandName }}</h1>
    </div>
    <ButtonsLinkAnimatedWithIcon text="Live" class="live-button" @click="playLive">
      <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="currentColor" />
    </ButtonsLinkAnimatedWithIcon>
  </div>
</template>

<style scoped lang="scss">
.container-fluid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px 85px;
  font-family: "Nexa-Heavy", sans-serif;

  .brand {
    display: flex;
    align-items: center;
    user-select: none;

    .brand-logo {
      width: 100px;
      height: 100%;
      margin-right: 10px;
    }
  }
}

.brand-name,
.live-text {
  margin: 0px;
}

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
