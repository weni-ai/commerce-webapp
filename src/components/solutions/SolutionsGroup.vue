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
      :status="status"
      :isIntegrating="solutionToIntegrate.isIntegrating"
      :solution="solutionToIntegrate.solution"
      @integrate="integrateSolution(solutionToIntegrate.solution)"
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
      :icon="icon"
      :iconScheme="iconScheme"
      :solution="drawerSolution.solution"
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
import { useAlertStore } from '@/stores/Alert';
import { useSolutionsManagerStore } from '@/stores/SolutionsManager';
import { useRouter } from 'vue-router';
import { isConfigurable } from '@/utils';

const router = useRouter();
const alertStore = useAlertStore();
const solutionsManagerStore = useSolutionsManagerStore();

const { t } = useI18n();

const props = defineProps<{
  status: 'available' | 'integrated';
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
  isIntegrating: boolean;
  solution: null | {
    uuid: string;
    title: string;
    description: string;
    tip: string;
  };
}>({
  isOpen: false,
  isIntegrating: false,
  solution: null,
});

const drawerSolution = reactive<{
  isOpen: boolean;
  solution?: Solution;
}>({
  isOpen: false,
  solution: undefined,
});

function getOptionsBySolution(solution: Solution) {
  if (props.status === 'integrated') {
    const options = [
      {
        icon: 'visibility',
        title: t('solutions.actions.see_details'),
        onClick: openIntegrateSolutionModal.bind(this, solution),
      },
    ];

    if (isConfigurable(solution)) {
      options.push({
        icon: 'settings',
        title: t('solutions.actions.settings'),
        onClick: openDrawer.bind(this, solution, solution.mockedValues),
      });
    }

    options.push(
      ...[
        {
          type: 'separator',
        },
        {
          icon: 'do_not_disturb_on',
          title: t('solutions.actions.disable_solution'),
          scheme: 'aux-red-500',
          onClick: () => emit('disintegrate', solution),
        },
      ],
    );

    return options;
  } else {
    return undefined;
  }
}

function openIntegrateSolutionModal(solution: Solution) {
  solutionToIntegrate.isOpen = true;

  solutionToIntegrate.solution = solution;
}

async function integrateSolution(solution: Solution) {
  if (isConfigurable(solution)) {
    openDrawer(solution);
    return;
  }

  solutionToIntegrate.isIntegrating = true;

  await solutionsManagerStore.integrateOrUpdate({
    ...solution,
    sectors: {},
    globals: {},
  });

  alertStore.add({
    type: 'success',
    text: t('solutions.integrate.status.created'),
  });

  solutionToIntegrate.isOpen = false;

  router.push({ name: 'integrated-solutions' });
}

async function openDrawer(solution: Solution, values = {}) {
  solutionToIntegrate.isOpen = false;

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
