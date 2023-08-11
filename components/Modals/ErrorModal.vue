<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore();
</script>

<template>
    <v-dialog v-model="uiStore.errorModal.model" width="auto">
        <v-card>
            <v-card-title class="text-h5">
                {{ uiStore.errorModal.title }}
            </v-card-title>
            <v-card-text>
                {{ uiStore.errorModal.message }}
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" block @click="uiStore.errorModal.model = false">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>