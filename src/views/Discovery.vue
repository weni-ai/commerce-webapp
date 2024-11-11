<template>
  <SolutionsList
    show="available"
    :isFirstLoading="
      solutionsActiveStore.all.isFirstLoading ||
      solutionsPassiveStore.all.isFirstLoading
    "
    :activeNotifications="solutionsActiveStore"
    :passiveService="solutionsPassiveStore"
  />
</template>

<script setup lang="ts">
import SolutionsList from '@/components/solutions/SolutionsList.vue';
import { onMounted } from 'vue';
import { useSolutionsActiveStore } from '@/stores/SolutionsActive';
import { useSolutionsPassiveStore } from '@/stores/SolutionsPassive';

const solutionsActiveStore = useSolutionsActiveStore();
const solutionsPassiveStore = useSolutionsPassiveStore();

onMounted(() => {
  solutionsActiveStore.all.load();
  solutionsPassiveStore.all.load();
});
</script>

<style scoped lang="scss"></style>
