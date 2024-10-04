<template>
  <UnnnicModalDialog
    v-model="modelValue"
    class="modal-disable-solution"
    type="warning"
    :showCloseIcon="true"
    :title="
      $t('solutions.disable.confirmation.title', {
        name: solution?.title,
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
      loading: isDisintegrating,
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
            name: solution?.title,
          })
        }}
      </b>
    </I18nT>
  </UnnnicModalDialog>
</template>

<script setup lang="ts">
import { useAlertStore } from '@/stores/Alert';
import { useSolutionsStore } from '@/stores/Solutions';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const modelValue = defineModel<boolean>({ required: true });

const props = defineProps<{
  solution?: Pick<Solution, 'uuid' | 'title'>;
}>();

const { t } = useI18n();

const alertStore = useAlertStore();
const solutionsStore = useSolutionsStore();

const isDisintegrating = ref(false);

function close() {
  modelValue.value = false;
}

async function disintegrate() {
  isDisintegrating.value = true;

  solutionsStore
    .disintegrate({ uuid: props.solution.uuid })
    .then(() => {
      alertStore.add({
        type: 'success',
        text: t('solutions.integrate.status.removed'),
      });
    })
    .finally(() => {
      isDisintegrating.value = false;

      close();
    });
}
</script>
