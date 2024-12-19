<template>
  <SolutionsList
    v-if="
      type === 'default' || (type === 'remote' && auth?.token && auth?.uuid)
    "
    show="available"
    :isFirstLoading="
      solutionsActiveStore.all.isFirstLoading ||
      solutionsPassiveStore.all.isFirstLoading
    "
    :activeNotifications="solutionsActiveStore"
    :passiveService="solutionsPassiveStore"
  />
</template>

<script setup lang="ts">
import SolutionsList from '@/components/solutions/SolutionsList.vue';
import { onMounted } from 'vue';
import { useSolutionsActiveStore } from '@/stores/SolutionsActive';
import { useSolutionsPassiveStore } from '@/stores/SolutionsPassive';
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

if (props.type === 'remote' && props.auth?.token && props.auth?.uuid) {
  const authStore = useAuthStore();
  authStore.setToken(props.auth.token);
  authStore.setProjectUuid(props.auth.uuid);
}

onMounted(() => {
  if (props.type === 'remote' && props.auth?.token && props.auth?.uuid) {
    solutionsActiveStore.all.load();
    solutionsPassiveStore.all.load();
  }

  if (props.type === 'default') {
    solutionsActiveStore.all.load();
    solutionsPassiveStore.all.load();
  }
});
</script>

<style scoped lang="scss"></style>
