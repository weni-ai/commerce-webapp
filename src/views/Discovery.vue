<template>
  <SolutionsList
    v-if="['default', 'remote'].includes(type)"
    show="available"
    :isFirstLoading="isFirstLoading"
    :activeNotifications="solutionsActiveStore"
    :passiveService="solutionsPassiveStore"
    :integrateSkills="solutionsDefaultStore"
  />
</template>

<script setup lang="ts">
import SolutionsList from '@/components/solutions/SolutionsList.vue';
import { computed, onMounted } from 'vue';
import { useSolutionsActiveStore } from '@/stores/SolutionsActive';
import { useSolutionsPassiveStore } from '@/stores/SolutionsPassive';
import { useSolutionsDefaultStore } from '@/stores/SolutionsDefault';
import { useAuthStore } from '@/stores/Auth';

const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
});

const solutionsActiveStore = useSolutionsActiveStore();
const solutionsPassiveStore = useSolutionsPassiveStore();
const solutionsDefaultStore = useSolutionsDefaultStore();

const isFirstLoading = computed(() => {
  const loadingDefault =
    solutionsActiveStore.all.isFirstLoading ||
    solutionsPassiveStore.all.isFirstLoading;

  const loadingRemote = solutionsDefaultStore.all.isFirstLoading;

  return props.type === 'default' ? loadingDefault : loadingRemote;
});

onMounted(() => {
  if (props.type === 'remote') {
    import('connect/sharedStore').then(({ useSharedStore }) => {
      const sharedStore = useSharedStore();
      const authStore = useAuthStore();

      authStore.setToken(`Bearer ${sharedStore.auth.token}`);
      authStore.setProjectUuid(sharedStore.current.project.uuid);

      solutionsDefaultStore.integrateds.load(true);
      solutionsDefaultStore.all.load(true);
    });
  }

  if (props.type === 'default') {
    solutionsActiveStore.all.load();
    solutionsPassiveStore.all.load();
  }
});
</script>

<style scoped lang="scss"></style>
