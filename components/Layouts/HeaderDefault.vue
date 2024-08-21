<script setup lang="ts">
import { brandConfig } from "@/constants/brandConfig";
import ButtonPlayLive from "../Button/ButtonPlayLive.vue";
</script>

<template>
  <div class="container-fluid">
    <div class="brand">
      <img
        class="brand-logo"
        :src="brandConfig.brandLogo"
        :alt="`${brandConfig.brandName}'s logo'`"
      >
      <h1 class="brand-name">{{ brandConfig.brandName }}</h1>
    </div>
    <ClientOnly>
      <ButtonPlayLive />
    </ClientOnly>
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
</style>
