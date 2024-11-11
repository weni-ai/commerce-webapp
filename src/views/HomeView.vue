<template>
  <Header
    class="main-header"
    :title="$t('title')"
    icon="storefront"
    iconScheme="weni-600"
    titleWeight="bold"
  >
    <template #description> {{ $t('description') }}</template>
  </Header>

  <UnnnicTab
    :activeTab="$route.name"
    :tabs="tabs"
    data-test="tabs"
    @change.self="$router.push({ name: $event })"
  >
    <template #tab-head-discovery>
      {{ $t('discovery.title') }}
    </template>

    <template #tab-head-integrated-solutions>
      {{ $t('integrated_solutions.title') }}
    </template>
  </UnnnicTab>

  <RouterView />
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { computed, onMounted } from 'vue';
import { useSolutionsActiveStore } from '@/stores/SolutionsActive';
import { useSolutionsPassiveStore } from '@/stores/SolutionsPassive';

const solutionsActiveStore = useSolutionsActiveStore();
const solutionsPassiveStore = useSolutionsPassiveStore();

onMounted(() => {
  solutionsActiveStore.integrateds.load();
  solutionsPassiveStore.integrateds.load();
});

const tabs = computed(() => {
  return ['discovery'].concat(
    solutionsActiveStore.integrateds.data.length ||
      solutionsPassiveStore.integrateds.data.length
      ? ['integrated-solutions']
      : [],
  );
});
</script>

<style scoped lang="scss">
.main-header {
  margin-bottom: $unnnic-spacing-lg;
}
</style>
