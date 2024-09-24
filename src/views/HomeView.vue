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
import { useSolutionsStore } from '@/stores/Solutions';
import { computed, onMounted } from 'vue';

const solutionsStore = useSolutionsStore();

onMounted(() => {
  solutionsStore.integrated.activeNotifications.load();
  solutionsStore.integrated.passiveService.load();
});

const tabs = computed(() => {
  return ['discovery'].concat(
    solutionsStore.integrated.activeNotifications.data.length ||
      solutionsStore.integrated.passiveService.data.length
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
