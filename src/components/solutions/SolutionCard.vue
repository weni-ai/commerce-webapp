<template>
  <section class="card">
    <header class="card__header">
      <h3 class="card__header__title">
        {{ solutionTitle }}
      </h3>

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

      <UnnnicButtonIcon
        v-else
        icon="add-1"
        size="small"
        data-test="add-button"
        @click="$emit('add')"
      />
    </header>

    <section class="card__body">
      {{ solutionDescription }}
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Popover from '@/components/temp/Popover.vue';
import { useI18n } from 'vue-i18n';

const { t, te } = useI18n();

const props = defineProps<{
  uuid: string;
  title: string;
  description: string;
  options?: any[];
}>();

defineEmits<{
  add: [];
}>();

const isActivatedByClick = ref(false);

const solutionTitle = te(`solutions.list.${props.uuid}.title`)
  ? t(`solutions.list.${props.uuid}.title`)
  : props.title;

const solutionDescription = te(`solutions.list.${props.uuid}.description`)
  ? t(`solutions.list.${props.uuid}.description`)
  : props.description;

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
  row-gap: $unnnic-spacing-sm;

  &__header {
    display: flex;
    align-items: center;
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
