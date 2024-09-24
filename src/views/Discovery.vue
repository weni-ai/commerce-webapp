<template>
  <SolutionsList
    :isFirstLoading="
      solutionsStore.activeNotifications.isFirstLoading ||
      solutionsStore.passiveService.isFirstLoading
    "
    :activeNotifications="solutionsStore.available.activeNotifications"
    :passiveService="solutionsStore.available.passiveService"
  />
</template>

<script setup lang="ts">
import SolutionsList from '@/components/solutions/SolutionsList.vue';
import { useSolutionsStore } from '@/stores/Solutions';
import { onMounted } from 'vue';

const solutionsStore = useSolutionsStore();

onMounted(() => {
  solutionsStore.activeNotifications.load();
  solutionsStore.passiveService.load();
});
</script>

<style scoped lang="scss"></style>
