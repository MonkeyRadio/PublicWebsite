<template>
  <VCard>
    <div v-for="relay in relays" :key="relay.id">
      <VSwitch
        :name="relay.name"
        v-model="relay.model"
        @click="toggle"
        :label="`${relay.label}`"
      ></VSwitch>
    </div>
    <VDialog v-model="relayTogglerError" width="auto">
      <VCard>
        <VCardText>
          <p class="red">Unable to toggle relay !<br/> {{ relayTogglerErrorMsg }}</p>
        </VCardText>
        <VCardActions>
          <v-btn color="primary" block @click="relayTogglerError = false"
            >Ok</v-btn>
        </VCardActions>
      </VCard>
    </VDialog>
    <VDialog v-model="relayTogglerLoading" width="auto">
      <VCard>
        <VCardText>
          <VProgressCircular indeterminate></VProgressCircular>
        </VCardText>
      </VCard>
    </VDialog>
  </VCard>
</template>

<script setup lang="ts">

import { io } from "socket.io-client";

type Relay = {
    id: number;
    name: string;
    model: boolean;
    label: string;
}

const relays: Ref<Relay[]> = ref([]);

const relayTogglerError = ref(false);

const relayTogglerErrorMsg = ref("");

const relayTogglerLoading = ref(false);

onMounted(() => {
    const getRelays = async () => {
        let accessToken: string | undefined;

        try {
            accessToken = await getAccessToken();
        } catch (error: any) {
            if (error.message == "Invalid token") {
                localStorage.clear();
                await router.push("/");
            }
            else {
                console.error(error);
            }
        }

        const response = await fetch("/api/relay", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        });
        const data = await response.json();

        data.data.forEach((key: any) => {
            relays.value.push({
                id: key.relayId,
                name: key.name,
                model: key.state,
                label: key.name,
            })
        });
        
    };
    getRelays();
})

const router = useRouter();

const toggle = async (e: any) => {
  const relay = relays.value.find((r) => r.name === e.target.name);
  if (!relay) throw new Error("Relay not found");

  const relayId = relay.id;
  const state = relay.model;

  let accessToken: string | undefined;

  try {
    accessToken = await getAccessToken();
  } catch (error: any) {
      if (error.message == "Invalid token") {
          localStorage.clear();
          await router.push("/");
      }
      else {
          console.error(error);
      }
  }

  relay.model = !relay.model;
  relayTogglerLoading.value = true;

  try {

    let toggle = await fetch(`/api/relay/${relayId}/${state ? "on" : "off"}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (toggle.status !== 200) {
      relayTogglerErrorMsg.value = await (await toggle.json()).errors[0];
      relayTogglerError.value = true;
      relayTogglerLoading.value = false;
    } else {
      relay.model = !relay.model;
      relayTogglerLoading.value = false;
    }

  } catch (error: any) {
    relayTogglerErrorMsg.value = "Network error";
    relayTogglerError.value = true;
    relayTogglerLoading.value = false;
  }
};
</script>
