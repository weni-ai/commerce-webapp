<template>
  <SolutionsList
    v-if="
      type === 'default' || (type === 'remote' && auth?.token && auth?.uuid)
    "
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
  auth: {
    type: Object as () => { token: string; uuid: string } | null,
    default: null,
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

if (props.type === 'remote' && props.auth?.token && props.auth?.uuid) {
  const authStore = useAuthStore();
  authStore.setToken(props.auth.token);
  authStore.setProjectUuid(props.auth.uuid);
}

onMounted(() => {
  if (props.type === 'remote' && props.auth?.token && props.auth?.uuid) {
    solutionsDefaultStore.integrateds.load(true);
    solutionsDefaultStore.all.load(true);
  }

  if (props.type === 'default') {
    solutionsActiveStore.all.load();
    solutionsPassiveStore.all.load();
  }
});
</script>

<style scoped lang="scss"></style>
