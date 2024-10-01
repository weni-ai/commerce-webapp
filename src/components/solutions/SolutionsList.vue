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
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import SolutionsGroup from '@/components/solutions/SolutionsGroup.vue';
import SolutionsGroupSkeletonLoading from '@/components/solutions/SolutionsGroupSkeletonLoading.vue';
import StateEmpty from '@/components/solutions/StateEmpty.vue';

const props = defineProps<{
  isFirstLoading: boolean;
  activeNotifications: any;
  passiveService: any;
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
      solutions: props.activeNotifications,
      category: 'activeNotifications',
    },
    {
      title: t('passive_service.title'),
      icon: 'forum',
      iconScheme: 'aux-purple-700',
      solutions: props.passiveService,
      category: 'passiveService',
    },
  ]
    .map((group) => ({
      ...group,
      solutions: group.solutions.filter(filterSolutions),
    }))
    .filter(({ solutions }) => solutions.length);
});
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
