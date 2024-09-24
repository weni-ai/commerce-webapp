<template>
  <UnnnicInput
    v-model="solutionName"
    class="filter-input"
    size="sm"
    iconLeft="search-1"
  />

  <StateEmpty v-if="groups.length === 0" />

  <SolutionsGroup
    v-for="(group, index) in groups"
    v-else
    :key="index"
    class="solutions-group"
    :title="group.title"
    :icon="group.icon"
    :iconScheme="group.iconScheme"
    :solutions="group.solutions"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import SolutionsGroup from '@/components/solutions/SolutionsGroup.vue';
import StateEmpty from '@/components/solutions/StateEmpty.vue';

type Solution = {
  id: string;
  title: string;
  description: string;
};

const { t } = useI18n();

const solutionName = ref('');

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

function filterSolutions({ title, description }: Solution) {
  const name = solutionName.value.toLowerCase().trim();

  return (
    title.toLowerCase().includes(name) ||
    description.toLowerCase().includes(name)
  );
}

const groups = computed(() =>
  [
    {
      title: t('active_notifications.title'),
      icon: 'business_messages',
      iconScheme: 'aux-orange-500',
      solutions: solutions,
    },
    {
      title: t('passive_service.title'),
      icon: 'forum',
      iconScheme: 'aux-purple-700',
      solutions: passiveServices,
    },
  ]
    .map((group) => ({
      ...group,
      solutions: group.solutions.value.filter(filterSolutions),
    }))
    .filter(({ solutions }) => solutions.length),
);
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
