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
      @close="solutionToIntegrate.isOpen = false"
      @integrate="isOpen = true"
    />

    <DrawerSolution
      :id="solutionToIntegrate.solution?.id || ''"
      v-model:isOpen="isOpen"
      :title="solutionToIntegrate.solution?.title || ''"
      :category="category"
      :icon="icon"
      :iconScheme="iconScheme"
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

function getOptionsBySolution(solution) {
  const integrated = [
    solutionsStore.integrated.activeNotifications.data,
    solutionsStore.integrated.passiveService.data,
  ].flat();

  if (integrated.some((integrated) => integrated.id === solution.id)) {
    return [
      {
        icon: 'visibility',
        title: t('solutions.actions.see_details'),
      },
      {
        icon: 'settings',
        title: t('solutions.actions.settings'),
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

  solutionToIntegrate.solution = {
    id: solution.id,
    title: t(`solutions.${solution.id}.title`),
    description: t(`solutions.${solution.id}.description`),
    tip: t(`solutions.${solution.id}.tip`),
  };
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
