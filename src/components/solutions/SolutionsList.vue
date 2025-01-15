<template>
  <Header
    v-if="isIntegrateSkillList"
    :title="t('integrate_skills.title')"
    :icon="null"
    :iconScheme="null"
    fontFamily="secondary"
    titleWeight="black"
    fontSize="title-lg"
  />

  <section class="filter-container">
    <UnnnicInput
      v-if="isRenderInputSearch"
      v-model="solutionName"
      :class="isIntegrateSkillList ? 'filter-integrate' : 'filter-input'"
      size="sm"
      iconRight="search-1"
      :disabled="isFirstLoading"
      :placeholder="$t('common.search')"
    />
    <section
      v-if="isIntegrateSkillList"
      class="filter-type"
    >
      <p>{{ $t('common.filter-by') }}</p>
      <DropdownFilter
        :items="[
          {
            name: t('passive_support.title'),
            action: passiveSupportFilter,
          },
          {
            name: t('active_notification.title'),
            action: activeNotificationFilter,
          },
        ]"
        :defaultItem="{ name: $t('common.type') }"
      />
    </section>
  </section>

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
import Header from '@/components/Header.vue';
import DropdownFilter from '@/components/DropDownFilter.vue';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import SolutionsGroup from '@/components/solutions/SolutionsGroup.vue';
import SolutionsGroupSkeletonLoading from '@/components/solutions/SolutionsGroupSkeletonLoading.vue';
import StateEmpty from '@/components/solutions/StateEmpty.vue';
import ModalDisintegrate from '@/components/solutions/ModalDisintegrate.vue';
import { useSolutionsActiveStore } from '@/stores/SolutionsActive';
import { useSolutionsPassiveStore } from '@/stores/SolutionsPassive';
import { useSolutionsDefaultStore } from '@/stores/SolutionsDefault';
import type { useSolutionsActiveStore as ActiveStoreType } from '@/stores/SolutionsActive';
import type { useSolutionsPassiveStore as PassiveStoreType } from '@/stores/SolutionsPassive';
import type { useSolutionsDefaultStore as DefaultStoreType } from '@/stores/SolutionsDefault';

const props = defineProps<{
  show: 'available' | 'integrated';
  isFirstLoading: boolean;
  activeNotifications: ReturnType<typeof ActiveStoreType>;
  passiveService: ReturnType<typeof PassiveStoreType>;
  integrateSkills: ReturnType<typeof DefaultStoreType>;
}>();

const { t } = useI18n();

const solutionName = ref('');
const currentFilter = ref('all');
const solutionsActiveStore = useSolutionsActiveStore();
const solutionsPassiveStore = useSolutionsPassiveStore();
const solutionsDefaultStore = useSolutionsDefaultStore();

function filterSolutions({ title, description }: Solution) {
  const name = solutionName.value.toLowerCase().trim();

  return (
    title.toLowerCase().includes(name) ||
    description.toLowerCase().includes(name)
  );
}

const isIntegrateSkillList = computed(() => {
  return (
    props.integrateSkills.available.length ||
    props.integrateSkills.integrateds.data.length
  );
});

const isRenderInputSearch = computed(() => {
  if (isIntegrateSkillList.value) {
    return true;
  }

  return !props.integrateSkills?.available?.length || props.isFirstLoading;
});

type FilterType = 'all' | 'passive_support' | 'active_notification';

const integrateSkillData = computed(() => {
  const data: Record<FilterType, Solution[]> = {
    all: [
      ...props.integrateSkills.available,
      ...props.integrateSkills.integrateds.data.map((values) => ({
        ...values,
        integrated: true,
      })),
    ],
    passive_support: [
      ...props.passiveService.available,
      ...props.passiveService.integrateds.data.map((values) => ({
        ...values,
        integrated: true,
      })),
    ],
    active_notification: [
      ...props.activeNotifications.available,
      ...props.activeNotifications.integrateds.data.map((values) => ({
        ...values,
        integrated: true,
      })),
    ],
  };

  return data[currentFilter.value as FilterType];
});

const groups = computed(() => {
  interface Groups {
    title: string;
    icon: string | null;
    iconScheme: string | null;
    solutions: Solution[];
    category: 'activeNotifications' | 'passiveService' | 'integrateSkills';
  }

  const integrateSkillsList: Groups[] = [
    {
      solutions: integrateSkillData.value,
      category: 'integrateSkills',
      title: t('integrate_skills.title'),
      icon: null,
      iconScheme: null,
    },
  ];

  const commerceDefaultList: Groups[] = [
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
  ];

  const isIntegrateSkillList =
    props.integrateSkills.available.length ||
    props.integrateSkills.integrateds.data.length;

  const list: Groups[] = isIntegrateSkillList
    ? integrateSkillsList
    : commerceDefaultList;

  return list
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

function loadDefaultSolutions() {
  solutionsDefaultStore.integrateds.load();
  solutionsDefaultStore.all.load();
}

function loadPassiveSolutions() {
  solutionsPassiveStore.all.load();
  solutionsPassiveStore.integrateds.load();
}

function loadActiveSolutions() {
  solutionsActiveStore.all.load();
  solutionsActiveStore.integrateds.load();
}

function passiveSupportFilter() {
  if (currentFilter.value === 'passive_support') {
    currentFilter.value = 'all';
    loadDefaultSolutions();
  } else {
    currentFilter.value = 'passive_support';
    loadPassiveSolutions();
  }
}

function activeNotificationFilter() {
  if (currentFilter.value === 'active_notification') {
    currentFilter.value = 'all';
    loadDefaultSolutions();
  } else {
    currentFilter.value = 'active_notification';
    loadActiveSolutions();
  }
}
</script>

<style scoped lang="scss">
.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
}

.filter-type {
  display: flex;
  align-items: center;
  gap: $unnnic-spacing-sm;
  p {
    color: $unnnic-color-neutral-cloudy;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-gt;
    font-weight: $unnnic-font-weight-regular;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }
}

.filter-input {
  margin-block: $unnnic-spacing-lg;
}

.filter-integrate {
  margin-block: $unnnic-spacing-sm;
  width: 80%;
}

.solutions-group {
  & + & {
    margin-top: $unnnic-spacing-md;
  }
}
</style>
