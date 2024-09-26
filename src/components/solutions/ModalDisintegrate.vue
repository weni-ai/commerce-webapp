<template>
  <UnnnicModalDialog
    v-model="modelValue"
    class="modal-disable-solution"
    type="warning"
    :showCloseIcon="true"
    :title="
      $t('solutions.disable.confirmation.title', {
        name: solution.title,
      })
    "
    showActionsDivider
    :secondaryButtonProps="{
      text: $t('common.cancel'),
      'data-test': 'cancel-button',
    }"
    :primaryButtonProps="{
      text: $t('common.confirm'),
      'data-test': 'confirm-button',
    }"
    @secondary-button-click="close"
    @primary-button-click="disintegrate"
  >
    <I18nT
      keypath="solutions.disable.confirmation.description.container"
      tag="p"
      scope="global"
      class="modal-disable-solution__description"
    >
      <b>
        {{
          $t('solutions.disable.confirmation.description.0', {
            name: solution.title,
          })
        }}
      </b>
    </I18nT>
  </UnnnicModalDialog>
</template>

<script setup lang="ts">
import { useSolutionsStore } from '@/stores/Solutions';

const modelValue = defineModel<boolean>({ required: true });

const props = defineProps<{
  solution: Pick<Solution, 'id' | 'title'>;
}>();

const solutionsStore = useSolutionsStore();

function close() {
  modelValue.value = false;
}

function disintegrate() {
  solutionsStore.disintegrate({ id: props.solution.id });

  close();
}
</script>
