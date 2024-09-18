<template>
  <section class="card">
    <header class="card__header">
      <h3 class="card__header__title">
        {{ title }}
      </h3>

      <UnnnicButtonIcon
        icon="add-1"
        size="small"
        @click="$emit('add')"
      />
    </header>

    <section class="card__body">
      {{ description }}
    </section>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();

defineEmits<{
  add: [];
}>();
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
</style>
