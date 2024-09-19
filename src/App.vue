<template>
  <TestTranslations />

  <main>
    <RouterView />
  </main>

  <Teleport to="#alerts">
    <UnnnicAlert
      v-if="alertStore.data.text"
      :key="alertStore.id"
      v-bind="alertStore.data"
      @close="alertStore.close"
    ></UnnnicAlert>
  </Teleport>
</template>

<script setup lang="ts">
import TestTranslations from '@/components/TestTranslations.vue';
import { useAlertStore } from './stores/Alert';

const alertStore = useAlertStore();
</script>

<style scoped lang="scss">
main {
  padding: $unnnic-spacing-md;
}
</style>
