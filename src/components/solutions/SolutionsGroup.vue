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
        isSolutionIntegrated(solutionToIntegrate.solution.id)
          ? 'integrated'
          : 'available'
      "
      @close="solutionToIntegrate.isOpen = false"
      @integrate="openDrawer(solutionToIntegrate.solution)"
      @edit="
        openDrawer(
          solutionToIntegrate.solution,
          solutionToIntegrate.solution?.mockedValues,
        )
      "
    />

    <DrawerSolution
      :id="drawerSolution.solution?.id || ''"
      v-model:isOpen="drawerSolution.isOpen"
      :title="solutionToIntegrate.solution?.title || ''"
      :category="category"
      :icon="icon"
      :iconScheme="iconScheme"
      :solution="drawerSolution.solution"
      :values="drawerSolution.solution?.values"
    />

    <UnnnicModalDialog
      v-model="solutionToDisintegrate.isOpen"
      class="modal-disable-solution"
      type="warning"
      :showCloseIcon="true"
      :title="
        $t('solutions.disable.confirmation.title', {
          name: solutionToDisintegrate.solution?.title,
        })
      "
      showActionsDivider
      :secondaryButtonProps="{
        text: $t('common.cancel'),
      }"
      :primaryButtonProps="{
        text: $t('common.confirm'),
      }"
      @secondary-button-click="solutionToDisintegrate.isOpen = false"
      @primary-button-click="disintegrate"
    >
      <I18nT
        keypath="solutions.disable.confirmation.description.container"
        tag="p"
        scope="global"
        class="modal-disable-solution__description"
      >
        <b>
          {{
            $t('solutions.disable.confirmation.description.0', {
              name: solutionToDisintegrate.solution?.title,
            })
          }}
        </b>
      </I18nT>
    </UnnnicModalDialog>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Header from '@/components/Header.vue';
import SolutionCard from '@/components/solutions/SolutionCard.vue';
import ModalIntegrate from '@/components/solutions/ModalIntegrate.vue';
import DrawerSolution from '@/components/solutions/DrawerSolution.vue';
import { useSolutionsStore } from '@/stores/Solutions';

const { t } = useI18n();

const solutionsStore = useSolutionsStore();

const isOpen = ref(false);

type Solution = {
  id: string;
  title: string;
  description: string;
};

defineProps<{
  title: string;
  icon: string;
  iconScheme: string;
  category: 'activeNotifications' | 'passiveService';
  solutions: Solution[];
}>();

const solutionToDisintegrate = reactive<{
  isOpen: boolean;
  solution: null | {
    id: string;
    title: string;
  };
}>({
  isOpen: false,
  solution: null,
});

const solutionToIntegrate = reactive<{
  isOpen: boolean;
  solution: null | {
    id: string;
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
  solution: null | {
    id: string;
    title: string;
    description: string;
    globals: string[];
  };
}>({
  isOpen: false,
  solution: null,
});

function isSolutionIntegrated(solutionId: string) {
  const integrated = [
    solutionsStore.integrated.activeNotifications.data,
    solutionsStore.integrated.passiveService.data,
  ].flat();

  return integrated.some((integrated) => integrated.id === solutionId);
}

function getOptionsBySolution(solution) {
  if (isSolutionIntegrated(solution.id)) {
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
        onClick: openDisable.bind(this, solution),
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

function openDisable(solution) {
  solutionToDisintegrate.isOpen = true;

  solutionToDisintegrate.solution = solution;
}

function disintegrate() {
  solutionToDisintegrate.isOpen = false;

  solutionsStore.disintegrate({ id: solutionToDisintegrate.solution?.id });

  solutionToDisintegrate.solution = null;
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
