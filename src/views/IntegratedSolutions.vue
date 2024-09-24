<template>
  <SolutionsList
    :isFirstLoading="
      solutionsStore.integrated.activeNotifications.isFirstLoading ||
      solutionsStore.integrated.passiveService.isFirstLoading
    "
    :activeNotifications="solutionsStore.integrated.activeNotifications.data"
    :passiveService="solutionsStore.integrated.passiveService.data"
  />
</template>

<script setup lang="ts">
import SolutionsList from '@/components/solutions/SolutionsList.vue';
import { useSolutionsStore } from '@/stores/Solutions';
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const solutionsStore = useSolutionsStore();

const isIntegratedSolutionsEmpty = computed(
  () =>
    solutionsStore.integrated.activeNotifications.status === 'complete' &&
    solutionsStore.integrated.passiveService.status === 'complete' &&
    solutionsStore.integrated.activeNotifications.data.length === 0 &&
    solutionsStore.integrated.passiveService.data.length === 0,
);

watch(
  isIntegratedSolutionsEmpty,
  (isEmpty) => {
    if (isEmpty) {
      router.push({ name: 'discovery' });
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped></style>
