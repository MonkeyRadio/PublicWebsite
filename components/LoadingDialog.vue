<template>
  <VDialog v-model="modelValue" width="auto">
    <VCard>
      <VCardText>
        <VProgressCircular indeterminate color="primary"></VProgressCircular>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const modelValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
