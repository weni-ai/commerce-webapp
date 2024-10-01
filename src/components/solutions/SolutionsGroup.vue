<template>
  <section class="solutions__group">
    <Header
      :title="title"
      :icon="icon"
      :iconScheme="iconScheme"
    />

    <section class="solutions__list">
      <SolutionCard
        v-for="(solution, index) in solutions"
        :key="index"
        :title="solution.title"
        :description="solution.description"
        :options="getOptionsBySolution(solution)"
        @add="openIntegrateSolutionModal(solution)"
      />
    </section>

    <ModalIntegrate
      v-if="solutionToIntegrate.solution"
      v-model="solutionToIntegrate.isOpen"
      v-bind="solutionToIntegrate.solution"
      :status="
        isSolutionIntegrated(solutionToIntegrate.solution)
          ? 'integrated'
          : 'available'
      "
      @integrate="openDrawer(solutionToIntegrate.solution)"
      @edit="
        openDrawer(
          solutionToIntegrate.solution,
          solutionToIntegrate.solution?.mockedValues,
        )
      "
    />

    <DrawerSolution
      v-model:isOpen="drawerSolution.isOpen"
      :title="drawerSolution.solution?.title || ''"
      :category="category"
      :icon="icon"
      :iconScheme="iconScheme"
      :solution="drawerSolution.solution"
      :values="drawerSolution.solution?.values"
    />
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import Header from '@/components/Header.vue';
import SolutionCard from '@/components/solutions/SolutionCard.vue';
import ModalIntegrate from '@/components/solutions/ModalIntegrate.vue';
import DrawerSolution from '@/components/solutions/DrawerSolution.vue';
import { useSolutionsStore } from '@/stores/Solutions';

const { t } = useI18n();

const solutionsStore = useSolutionsStore();

defineProps<{
  title: string;
  icon: string;
  iconScheme: string;
  category: 'activeNotifications' | 'passiveService';
  solutions: Solution[];
}>();

const emit = defineEmits<{
  disintegrate: [solution: Solution];
}>();

const solutionToIntegrate = reactive<{
  isOpen: boolean;
  solution: null | {
    uuid: string;
    title: string;
    description: string;
    tip: string;
  };
}>({
  isOpen: false,
  solution: null,
});

const drawerSolution = reactive<{
  isOpen: boolean;
  solution: null | Solution;
}>({
  isOpen: false,
  solution: null,
});

function isSolutionIntegrated(solution: Solution) {
  const integrated = [
    solutionsStore.integrated.activeNotifications.data,
    solutionsStore.integrated.passiveService.data,
  ].flat();

  return integrated.some((integrated) => integrated.uuid === solution.uuid);
}

function getOptionsBySolution(solution: Solution) {
  if (isSolutionIntegrated(solution)) {
    return [
      {
        icon: 'visibility',
        title: t('solutions.actions.see_details'),
        onClick: openIntegrateSolutionModal.bind(this, solution),
      },
      {
        icon: 'settings',
        title: t('solutions.actions.settings'),
        onClick: openDrawer.bind(this, solution, solution.mockedValues),
      },
      {
        type: 'separator',
      },
      {
        icon: 'do_not_disturb_on',
        title: t('solutions.actions.disable_solution'),
        scheme: 'aux-red-500',
        onClick: () => emit('disintegrate', solution),
      },
    ];
  } else {
    return undefined;
  }
}

function openIntegrateSolutionModal(solution: Solution) {
  solutionToIntegrate.isOpen = true;

  solutionToIntegrate.solution = solution;
}

function openDrawer(solution, values = {}) {
  drawerSolution.isOpen = true;
  drawerSolution.solution = solution;
  drawerSolution.solution.values = values;
}
</script>

<style lang="scss" scoped>
.solutions {
  &__group {
    display: flex;
    flex-direction: column;
    row-gap: $unnnic-spacing-sm;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(15.625 * $unnnic-font-size, 1fr)
    );
    gap: $unnnic-spacing-sm;
  }
}
</style>
