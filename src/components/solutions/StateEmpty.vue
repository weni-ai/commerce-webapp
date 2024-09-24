<template>
  <section class="state-empty">
    <img
      class="state-empty__illustration"
      src="@/assets/store-silhouette.svg"
      alt="Store Silhouette"
    />

    <h3 class="state-empty__title">
      {{ $t('solutions.states.empty.title') }}
    </h3>

    <p class="state-empty__description">
      {{ $t('solutions.states.empty.description') }}
    </p>
  </section>
</template>

<style lang="scss" scoped>
.state-empty {
  max-width: 25 * $unnnic-font-size;
  margin: 0 auto;
  text-align: center;

  &__illustration {
    display: block;
    margin: 0 auto;
  }

  &__title {
    margin-top: $unnnic-spacing-ant;

    color: $unnnic-color-neutral-dark;
    font-family: $unnnic-font-family-secondary;
    font-weight: $unnnic-font-weight-bold;
    font-size: $unnnic-font-size-title-sm;
    line-height: $unnnic-font-size-title-sm + $unnnic-line-height-md;
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
