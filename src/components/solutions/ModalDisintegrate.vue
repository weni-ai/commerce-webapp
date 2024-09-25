<template>
  <UnnnicModalDialog
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
    }"
    :primaryButtonProps="{
      text: $t('common.confirm'),
    }"
    @secondary-button-click="$emit('close')"
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

const props = defineProps<{
  solution: Pick<Solution, 'id' | 'title'>;
}>();

const emit = defineEmits<{
  close: [];
  disintegrate: [];
}>();

const solutionsStore = useSolutionsStore();

function disintegrate() {
  solutionsStore.disintegrate({ id: props.solution.id });

  emit('close');
}
</script>
