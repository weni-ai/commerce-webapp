<template>
  <section>
    <SolutionCard
      v-for="(solution, index) in solutions"
      :key="index"
      :title="solution.title"
      :description="solution.description"
      :options="options"
    />

    <UnnnicModalDialog
      v-model="isDisableOpen"
      class="modal-disable-solution"
      type="warning"
      :showCloseIcon="true"
      :title="$t('solutions.disable.confirmation.title', { name: 'Name' })"
      showActionsDivider
      :secondaryButtonProps="{
        text: $t('common.cancel'),
      }"
      :primaryButtonProps="{
        text: $t('common.confirm'),
      }"
      @secondary-button-click="isDisableOpen = false"
      @primary-button-click="isDisableOpen = false"
    >
      <I18nT
        keypath="solutions.disable.confirmation.description.container"
        tag="p"
        scope="global"
        class="modal-disable-solution__description"
      >
        <b>
          {{
            $t('solutions.disable.confirmation.description.0', { name: 'Name' })
          }}
        </b>
      </I18nT>
    </UnnnicModalDialog>
  </section>
</template>

<script setup lang="ts">
import SolutionCard from '@/components/solutions/SolutionCard.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const isDisableOpen = ref(false);

const options = computed(() => [
  {
    icon: 'visibility',
    title: t('solutions.actions.see_details'),
  },
  {
    icon: 'settings',
    title: t('solutions.actions.settings'),
  },
  {
    type: 'separator',
  },
  {
    icon: 'do_not_disturb_on',
    title: t('solutions.actions.disable_solution'),
    scheme: 'aux-red-500',
    onClick: openDisable,
  },
]);

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

function openDisable() {
  isDisableOpen.value = true;
}
</script>

<style lang="scss" scoped>
.modal-disable-solution__description {
  color: $unnnic-color-neutral-cloudy;
  font-family: $unnnic-font-family-secondary;
  font-weight: $unnnic-font-weight-regular;
  font-size: $unnnic-font-size-body-gt;
  line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;

  b {
    font-weight: $unnnic-font-weight-bold;
  }
}
</style>
