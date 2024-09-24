<template>
  <UnnnicInput
    v-model="solutionName"
    class="filter-input"
    size="sm"
    iconLeft="search-1"
  />

  <SolutionsGroup
    class="solutions-group"
    :title="$t('active_notifications.title')"
    icon="business_messages"
    iconScheme="aux-orange-500"
    :filterText="solutionName"
    :solutions="solutions"
  />

  <SolutionsGroup
    class="solutions-group"
    :title="$t('passive_service.title')"
    icon="forum"
    iconScheme="aux-purple-700"
    :filterText="solutionName"
    :solutions="passiveServices"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import SolutionsGroup from '@/components/solutions/SolutionsGroup.vue';
import { useFeatureStore } from '@/stores/feature';
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n();
const featureStore = useFeatureStore();
const auth = useAuthStore();

const solutionName = ref('');

onMounted(async () => {
  await featureStore.getFeatures(auth.project);
});

const solutions = computed(() => [
  {
    id: 'abandoned_cart',
    title: t('solutions.abandoned_cart.title'),
    description: t('solutions.abandoned_cart.short_description'),
  },
  {
    id: 'order_status',
    title: t('solutions.order_status.title'),
    description: t('solutions.order_status.short_description'),
  },
  {
    id: 'order_tracking',
    title: t('solutions.order_tracking.title'),
    description: t('solutions.order_tracking.short_description'),
  },
  {
    id: 'product_replacement',
    title: t('solutions.product_replacement.title'),
    description: t('solutions.product_replacement.short_description'),
  },
]);

const passiveServices = computed(() => [
  {
    id: 'product_exchange_and_return',
    title: t('solutions.product_exchange_and_return.title'),
    description: t('solutions.product_exchange_and_return.short_description'),
  },
  {
    id: 'FAQ',
    title: t('solutions.FAQ.title'),
    description: t('solutions.FAQ.short_description'),
  },
  {
    id: 'order_invoice_inquiry',
    title: t('solutions.order_invoice_inquiry.title'),
    description: t('solutions.order_invoice_inquiry.short_description'),
  },
  {
    id: 'transfer_to_human_care',
    title: t('solutions.transfer_to_human_care.title'),
    description: t('solutions.transfer_to_human_care.short_description'),
  },
]);
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
