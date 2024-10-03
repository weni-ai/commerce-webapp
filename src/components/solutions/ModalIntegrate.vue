<template>
  <UnnnicModalDialog
    v-model="modelValue"
    class="modal-integrate-solution"
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
  status: 'available' | 'integrated';
}>();

const emit = defineEmits<{
  integrate: [];
  edit: [];
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
    emit('edit');
  }
}
</script>

<style scoped lang="scss">
.modal-integrate-solution {
  :deep(.unnnic-modal-dialog__container) {
    width: 25 * $unnnic-font-size;
    border-radius: $unnnic-border-radius-lg;
  }

  :deep(.unnnic-modal-dialog__container__content) {
    padding-inline: $unnnic-spacing-lg;
    padding-bottom: $unnnic-spacing-lg;
    border-bottom: solid 1px $unnnic-color-neutral-soft;

    button {
      width: 100%;
    }
  }

  :deep(.unnnic-modal-dialog__container__header) {
    padding: $unnnic-spacing-md;
    border-bottom-width: 1px;

    .unnnic-modal-dialog__container__title-text {
      font-family: $unnnic-font-family-secondary;
      font-weight: $unnnic-font-weight-bold;
      font-size: $unnnic-font-size-title-md;
      line-height: $unnnic-font-size-title-md + $unnnic-line-height-md;
    }
  }

  :deep(.unnnic-modal-dialog__container__actions) {
    display: flex;

    button {
      width: 100%;
    }
  }

  &__container {
    display: flex;
    flex-direction: column;
    column-gap: $unnnic-spacing-giant;
  }

  &__buttons {
    padding-top: $unnnic-spacing-md;
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
