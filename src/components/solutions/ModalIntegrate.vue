<template>
  <UnnnicModalDialog
    v-if="images[uuid]"
    class="modal-integrate-solution"
    :showCloseIcon="true"
  >
    <section class="modal-integrate-solution__container">
      <section class="modal-integrate-solution__body">
        <p>
          {{ description }}
        </p>

        <UnnnicButton
          class="modal-integrate-solution__integrate-button"
          size="small"
          @click="
            $emit('close');
            $emit('integrate');
          "
        >
          {{ $t('solutions.integrate.button_label') }}
        </UnnnicButton>

        <section
          v-if="!!tip"
          class="modal-integrate-solution__tip"
        >
          <UnnnicIcon
            icon="emoji_objects"
            size="sm"
            scheme="neutral-cloudy"
          />

          {{ tip }}
        </section>
      </section>

      <img
        class="modal-integrate-solution__preview-image"
        :src="getImageByUuid(uuid)"
        alt="Chat"
      />
    </section>
  </UnnnicModalDialog>
  <UnnnicModalDialog
    v-else
    v-model="modelValue"
    class="modal-integrate-solution-empty"
    :showCloseIcon="true"
    :hideSecondaryButton="true"
    :primaryButtonProps="buttonProps"
    @primary-button-click="emitValue"
  >
    <section class="modal-integrate-solution__container">
      <section class="modal-integrate-solution__body">
        <p>
          {{ description }}
        </p>

        <section
          v-if="!!tip"
          class="modal-integrate-solution__tip"
          data-test="tip-box"
        >
          <UnnnicIcon
            icon="emoji_objects"
            size="sm"
            scheme="neutral-cloudy"
          />

          {{ tip }}
        </section>
      </section>
    </section>
  </UnnnicModalDialog>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const modelValue = defineModel<boolean>({ required: true });
const { t } = useI18n();
const props = defineProps<{
  description: string;
  tip?: string;
  uuid: string;
  status: 'available' | 'integrated';
}>();

const emit = defineEmits<{
  close: [];
  integrate: [];
}>();

const buttonProps =
  props.status === 'available'
    ? {
        class: 'modal-integrate-solution__integrate-button',
        text: t('solutions.integrate.button_label'),
        size: 'large',
        'data-test': 'integrate-button',
      }
    : props.status === 'integrated'
      ? {
          class: 'modal-integrate-solution__edit-button',
          text: t('solutions.details.view_settings'),
          size: 'large',
          'data-test': 'edit-button',
        }
      : {};

function emitValue() {
  modelValue.value = false;
  if (props.status === 'available') {
    emit('integrate');
  } else if (props.status === 'integrated') {
    emit('close');
  }
}

const images: Record<string, string> = {
  '4d983f31-065b-45c8-84fd-276469750c38': abandoned_cart,
  'adc0315c-6549-4321-93c6-0557b55a6ca2': status_active,
  '6e38bfb1-a0e1-4dc7-95b3-b14ebc94d1a5': status_passive,
};

function getImageByUuid(uuid: string): string {
  return images[uuid] || abandoned_cart;
}

import abandoned_cart from '@/assets/abandoned_cart.png';
import status_active from '@/assets/status_active.png';
import status_passive from '@/assets/status_passive.png';
</script>

<style scoped lang="scss">
.modal-integrate-solution-empty {
  :deep(.unnnic-modal-dialog__container) {
    width: 25 * $unnnic-font-size;
    border-radius: $unnnic-border-radius-lg;
  }

  :deep(.unnnic-modal-dialog__container__actions) {
    display: flex;

    button {
      width: 100%;
    }
  }
}
.modal-integrate-solution {
  :deep(.unnnic-modal-dialog__container) {
    width: 43.75 * $unnnic-font-size;
    border-radius: $unnnic-border-radius-lg;
  }

  :deep(.unnnic-modal-dialog__container__header) {
    padding: $unnnic-spacing-lg;
  }

  :deep(.unnnic-modal-dialog__container__content) {
    padding-inline: $unnnic-spacing-lg;
    padding-bottom: $unnnic-spacing-lg;
  }

  :deep(.unnnic-modal-dialog__container__header) {
    padding-bottom: 0;
    border-bottom-width: 0;

    .unnnic-modal-dialog__container__title-text {
      font-family: $unnnic-font-family-secondary;
      font-weight: $unnnic-font-weight-bold;
      font-size: $unnnic-font-size-title-md;
      line-height: $unnnic-font-size-title-md + $unnnic-line-height-md;
    }
  }

  &__container {
    display: flex;
    column-gap: $unnnic-spacing-giant;
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    row-gap: $unnnic-spacing-sm;

    color: $unnnic-color-neutral-darkest;
    font-family: $unnnic-font-family-secondary;
    font-weight: $unnnic-font-weight-regular;
    font-size: $unnnic-font-size-body-gt;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }

  &__integrate-button {
    align-self: start;
    min-width: 9.375 * $unnnic-font-size;
  }

  &__tip {
    margin-top: auto;
    display: flex;
    column-gap: $unnnic-spacing-xs;

    padding: $unnnic-spacing-xs - $unnnic-border-width-thinner;
    border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
    border-radius: $unnnic-border-radius-md;

    color: $unnnic-color-neutral-cloudy;
    font-family: $unnnic-font-family-secondary;
    font-weight: $unnnic-font-weight-regular;
    font-size: $unnnic-font-size-body-md;
    line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;
  }

  &__preview-image {
    align-self: end;
    margin-bottom: -$unnnic-spacing-lg;
  }
}
</style>
