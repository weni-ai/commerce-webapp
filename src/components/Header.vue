<template>
  <header class="header">
    <section class="header__title-and-icon">
      <UnnnicAvatarIcon
        enabled
        :icon="icon"
        :scheme="iconScheme"
        class="icon"
        data-test="icon"
      />

      <h2
        class="header__title"
        :class="[
          `header__title--weight-${titleWeight}`,
          `header__title--font-size-${fontSize}`,
          `header__title--font-family-${fontFamily}`,
        ]"
      >
        {{ title }}
      </h2>
    </section>

    <p
      v-if="!!$slots.description"
      class="header__description"
      data-test="description-box"
    >
      <slot name="description" />
    </p>
  </header>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    fontSize?: 'title-sm' | 'title-md';
    fontFamily?: 'primary' | 'secondary';
    icon: string;
    iconScheme: string;
    titleWeight?: string;
  }>(),
  {
    fontSize: 'title-sm',
    fontFamily: 'primary',
    titleWeight: 'regular',
  },
);
</script>

<style scoped lang="scss">
.header {
  &__title-and-icon {
    display: flex;
    column-gap: $unnnic-spacing-sm;
    align-items: center;
  }

  &__title {
    color: $unnnic-color-neutral-darkest;
    font-family: $unnnic-font-family-primary;
    font-weight: $unnnic-font-weight-regular;
    font-size: $unnnic-font-size-title-sm;
    line-height: $unnnic-font-size-title-sm + $unnnic-line-height-md;

    &--weight-bold {
      font-weight: $unnnic-font-weight-bold;
    }

    &--font-size-title-md {
      font-size: $unnnic-font-size-title-md;
      line-height: $unnnic-font-size-title-md + $unnnic-line-height-md;
    }

    &--font-family-secondary {
      font-family: $unnnic-font-family-secondary;
    }
  }

  &__description {
    margin-top: $unnnic-spacing-xs;

    color: $unnnic-color-neutral-cloudy;
    font-family: $unnnic-font-family-secondary;
    font-weight: $unnnic-font-weight-regular;
    font-size: $unnnic-font-size-body-lg;
    line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
  }
}
</style>
