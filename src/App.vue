<template>
  <TestTranslations />

  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import TestTranslations from '@/components/TestTranslations.vue';
</script>

<style scoped lang="scss">
main {
  padding: $unnnic-spacing-md;
}
</style>
