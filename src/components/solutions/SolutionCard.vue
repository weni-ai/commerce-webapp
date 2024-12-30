<template>
  <section class="card">
    <header class="card__header">
      <section>
        <h3 class="card__header__title">
          {{ title }}
        </h3>
        <p
          :class="{
            'card__header__sub-title': true,
            'card__header__sub-title-orange':
              props.category === 'activeNotifications',
            'card__header__sub-title-purple':
              props.category === 'passiveService',
          }"
        >
          {{
            props.category === 'activeNotifications'
              ? $t('active_notification.title')
              : $t('passive_support.title')
          }}
        </p>
      </section>

      <Popover
        v-if="options"
        v-model:isActivatedByClick="isActivatedByClick"
      >
        <template #default>
          <section class="options__trigger">
            <UnnnicIcon
              icon="more_vert"
              :scheme="
                isActivatedByClick ? 'neutral-darkest' : 'neutral-cloudy'
              "
              size="avatar-nano"
              data-test="see-options-icon"
              v-bind="$attrs"
            />
          </section>
        </template>

        <template #children="{ popoverId }">
          <section
            :popoverId
            trigger="click"
            horizontal="right-right"
            vertical="top-bottom"
            spacingy="4"
            class="options"
          >
            <template v-for="(action, index) in options">
              <hr
                v-if="action.type === 'separator'"
                :key="index"
              />

              <section
                v-else
                :key="`option-${index}`"
                class="options__option"
                :class="[
                  action.scheme && `options__option--scheme-${action.scheme}`,
                ]"
                :data-test="action.title"
                @click="clickOption(action)"
              >
                <UnnnicIcon
                  :icon="action.icon"
                  size="ant"
                  scheme="inherit"
                />

                {{ action.title }}
              </section>
            </template>
          </section>
        </template>
      </Popover>
    </header>

    <section class="card__body">
      {{ description }}
    </section>
    <section class="card__footer">
      <UnnnicButton
        :class="{
          card__footer__button: true,
          card__footer__button__active: !!options,
        }"
        :type="options ? 'tertiary' : 'secondary'"
        data-test="add-button"
        size="large"
        :iconLeft="options ? 'check' : 'add-1'"
        :disabled="!!options"
        @click="$emit('add')"
      >
        {{ options ? $t('common.integrated') : $t('common.integrate') }}
      </UnnnicButton>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Popover from '@/components/temp/Popover.vue';

const props = defineProps<{
  title: string;
  description: string;
  options?: any[];
  category?: 'activeNotifications' | 'passiveService' | 'integrateSkills';
}>();

defineEmits<{
  add: [];
}>();

const isActivatedByClick = ref(false);

function clickOption(option) {
  if (option.onClick) {
    isActivatedByClick.value = false;

    option.onClick();
  }
}
</script>

<style scoped lang="scss">
.card {
  padding: $unnnic-spacing-sm - $unnnic-border-width-thinner;
  border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
  border-radius: $unnnic-border-radius-md;
  background-color: $unnnic-color-background-snow;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: $unnnic-spacing-sm;

  &__header {
    display: flex;
    justify-content: space-between;
    column-gap: $unnnic-spacing-xs;
    min-height: 2 * ($unnnic-font-size-body-lg + $unnnic-line-height-md);

    &__title {
      color: $unnnic-color-neutral-darkest;
      font-family: $unnnic-font-family-secondary;
      font-weight: $unnnic-font-weight-bold;
      font-size: $unnnic-font-size-body-lg;
      line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;

      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__sub-title {
      font-family: $unnnic-font-family-secondary;
      font-weight: $unnnic-font-weight-regular;
      font-size: $unnnic-font-size-body-md;
      line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;

      &-orange {
        color: $unnnic-color-aux-orange-500;
      }

      &-purple {
        color: $unnnic-color-aux-purple-500;
      }

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      align-self: stretch;
    }
  }

  &__body {
    min-height: 3 * ($unnnic-font-size-body-gt + $unnnic-line-height-md);

    color: $unnnic-color-neutral-cloudy;
    font-family: $unnnic-font-family-secondary;
    font-weight: $unnnic-font-weight-regular;
    font-size: $unnnic-font-size-body-gt;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;

    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__footer {
    display: flex;
    justify-content: center;

    :deep(.unnnic-button--tertiary:disabled) {
      color: $unnnic-color-weni-600;
    }

    &__button {
      width: 100%;

      :deep(.unnnic-icon__size--md) {
        width: 20px;
        height: 20px;
        min-width: 20px;
        min-height: 20px;
      }

      &__active {
        color: $unnnic-color-weni-600;
        :deep(.unnnic-button__icon-left) {
          color: $unnnic-color-weni-600;
        }
      }
    }
  }
}

.options {
  min-width: 15 * $unnnic-font-size;
  box-sizing: border-box;
  padding: $unnnic-spacing-xs;
  background-color: $unnnic-color-neutral-white;
  border-radius: $unnnic-border-radius-sm;
  box-shadow: $unnnic-shadow-level-near;

  hr {
    margin-block: $unnnic-spacing-xs;
    margin-top: $unnnic-spacing-xs - $unnnic-border-width-thinner;

    border-width: 0;
    border-top: $unnnic-border-width-thinner solid
      $unnnic-color-neutral-cleanest;
  }

  &__option {
    user-select: none;
    cursor: pointer;
    padding: $unnnic-spacing-xs;
    padding-inline: $unnnic-spacing-sm;
    margin-inline: -$unnnic-spacing-xs;
    display: flex;
    align-items: center;
    column-gap: $unnnic-spacing-xs;

    color: $unnnic-color-neutral-dark;
    font-family: $unnnic-font-family-secondary;
    font-weight: $unnnic-font-weight-regular;
    font-size: $unnnic-font-size-body-gt;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;

    &:first-of-type {
      margin-top: -$unnnic-spacing-xs;
      padding-top: $unnnic-spacing-sm;
    }

    &:last-of-type {
      padding-bottom: $unnnic-spacing-sm;
      margin-bottom: -$unnnic-spacing-xs;
    }

    &--scheme-aux-red-500 {
      color: $unnnic-color-aux-red-500;
    }
  }

  &__trigger {
    user-select: none;
    display: inline-flex;
    padding: $unnnic-spacing-xs;
    cursor: pointer;
  }
}
</style>
