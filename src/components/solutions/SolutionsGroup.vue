<template>
  <section class="solutions__group">
    <Header
      :title="title"
      :icon="icon"
      :iconScheme="iconScheme"
    />

    <section class="solutions__list">
      <SolutionCard
        v-for="(solution, index) in filterSolutions(solutions)"
        :key="index"
        :title="solution.title"
        :description="solution.description"
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

    <SolutionDrawer
      v-model:isOpen="isOpen"
      :title="solutionToIntegrate.solution?.title || ''"
    />
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Header from '@/components/Header.vue';
import SolutionCard from '@/components/solutions/SolutionCard.vue';
import ModalIntegrate from '@/components/solutions/ModalIntegrate.vue';
import SolutionDrawer from '@/components/solutions/SolutionDrawer.vue';

const { t } = useI18n();

const isOpen = ref(false);

type Solution = {
  id: string;
  title: string;
  description: string;
};

const props = defineProps<{
  title: string;
  icon: string;
  iconScheme: string;
  filterText: string;
  solutions: Solution[];
}>();

const solutionToIntegrate = reactive<{
  isOpen: boolean;
  solution: null | {
    title: string;
    description: string;
    tip: string;
  };
}>({
  isOpen: false,
  solution: null,
});

function openIntegrateSolutionModal(solution: Solution) {
  solutionToIntegrate.isOpen = true;

  solutionToIntegrate.solution = {
    title: t(`solutions.${solution.id}.title`),
    description: t(`solutions.${solution.id}.description`),
    tip: t(`solutions.${solution.id}.tip`),
  };
}

function filterSolutions(solutions: Solution[]) {
  return solutions.filter(({ title, description }) => {
    const name = props.filterText.toLowerCase().trim();

    return (
      title.toLowerCase().includes(name) ||
      description.toLowerCase().includes(name)
    );
  });
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
