<template>
  <SolutionsList
    show="integrated"
    :isFirstLoading="
      solutionsActiveStore.integrateds.isFirstLoading ||
      solutionsPassiveStore.integrateds.isFirstLoading
    "
    :activeNotifications="solutionsActiveStore"
    :passiveService="solutionsPassiveStore"
  />
</template>

<script setup lang="ts">
import SolutionsList from '@/components/solutions/SolutionsList.vue';
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSolutionsActiveStore } from '@/stores/SolutionsActive';
import { useSolutionsPassiveStore } from '@/stores/SolutionsPassive';

const solutionsActiveStore = useSolutionsActiveStore();
const solutionsPassiveStore = useSolutionsPassiveStore();

const router = useRouter();

const isIntegratedSolutionsEmpty = computed(
  () =>
    solutionsActiveStore.integrateds.status === 'complete' &&
    solutionsPassiveStore.integrateds.status === 'complete' &&
    solutionsActiveStore.integrateds.data.length === 0 &&
    solutionsPassiveStore.integrateds.data.length === 0,
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
