<template>
  <UnnnicInput
    v-model="solutionName"
    class="filter-input"
    size="sm"
    iconLeft="search-1"
  />

  <SolutionsGroupSkeletonLoading v-if="isFirstLoading" />

  <StateEmpty v-else-if="groups.length === 0" />

  <SolutionsGroup
    v-for="(group, index) in groups"
    v-else
    :key="index"
    class="solutions-group"
    :title="group.title"
    :icon="group.icon"
    :iconScheme="group.iconScheme"
    :solutions="group.solutions"
    :category="group.category"
    :status="props.show"
    @disintegrate="openDisintegrate"
  />

  <ModalDisintegrate
    v-model="toDisintegrate.isOpen"
    :solution="toDisintegrate.solution || undefined"
  />
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import SolutionsGroup from '@/components/solutions/SolutionsGroup.vue';
import SolutionsGroupSkeletonLoading from '@/components/solutions/SolutionsGroupSkeletonLoading.vue';
import StateEmpty from '@/components/solutions/StateEmpty.vue';
import ModalDisintegrate from '@/components/solutions/ModalDisintegrate.vue';
import type { useSolutionsActiveStore } from '@/stores/SolutionsActive';
import type { useSolutionsPassiveStore } from '@/stores/SolutionsPassive';

const props = defineProps<{
  show: 'available' | 'integrated';
  isFirstLoading: boolean;
  activeNotifications: ReturnType<typeof useSolutionsActiveStore>;
  passiveService: ReturnType<typeof useSolutionsPassiveStore>;
}>();

const { t } = useI18n();

const solutionName = ref('');

function filterSolutions({ title, description }: Solution) {
  const name = solutionName.value.toLowerCase().trim();

  return (
    title.toLowerCase().includes(name) ||
    description.toLowerCase().includes(name)
  );
}

const groups = computed(() => {
  return [
    {
      title: t('active_notifications.title'),
      icon: 'business_messages',
      iconScheme: 'aux-orange-500',
      solutions:
        props.show === 'available'
          ? props.activeNotifications.available
          : props.activeNotifications.integrateds.data,
      category: 'activeNotifications',
    },
    {
      title: t('passive_service.title'),
      icon: 'forum',
      iconScheme: 'aux-purple-700',
      solutions:
        props.show === 'available'
          ? props.passiveService.available
          : props.passiveService.integrateds.data,
      category: 'passiveService',
    },
  ]
    .map((group) => ({
      ...group,
      solutions: group.solutions.filter(filterSolutions),
    }))
    .filter(({ solutions }) => solutions.length);
});

const toDisintegrate = reactive<{
  isOpen: boolean;
  solution?: Solution;
}>({
  isOpen: false,
  solution: undefined,
});

function openDisintegrate(solution: Solution) {
  toDisintegrate.isOpen = true;
  toDisintegrate.solution = solution;
}
</script>

<style scoped lang="scss">
.filter-input {
  margin-block: $unnnic-spacing-lg;
}

.solutions-group {
  & + & {
    margin-top: $unnnic-spacing-md;
  }
}
</style>
