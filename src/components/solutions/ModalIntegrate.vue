<template>
  <UnnnicModalDialog
    v-model="modelValue"
    class="modal-integrate-solution"
    :showCloseIcon="true"
  >
    <section class="modal-integrate-solution__container">
      <section class="modal-integrate-solution__body">
        <p>
          {{ description }}
        </p>

        <UnnnicButton
          v-if="status === 'available'"
          class="modal-integrate-solution__integrate-button"
          size="small"
          data-test="integrate-button"
          @click="
            modelValue = false;
            $emit('integrate');
          "
        >
          {{ $t('solutions.integrate.button_label') }}
        </UnnnicButton>

        <UnnnicButton
          v-else-if="status === 'integrated'"
          type="secondary"
          class="modal-integrate-solution__integrate-button"
          iconLeft="settings"
          size="small"
          data-test="edit-button"
          @click="
            modelValue = false;
            $emit('edit');
          "
        >
          {{ $t('solutions.details.view_settings') }}
        </UnnnicButton>

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

      <img
        class="modal-integrate-solution__preview-image"
        :src="Chat"
        alt="Chat"
      />
    </section>
  </UnnnicModalDialog>
</template>

<script lang="ts" setup>
import Chat from '@/assets/chat.png';

const modelValue = defineModel<boolean>({ required: true });

defineProps<{
  description: string;
  tip?: string;
  status: 'available' | 'integrated';
}>();

defineEmits<{
  integrate: [];
  edit: [];
}>();
</script>

<style scoped lang="scss">
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
