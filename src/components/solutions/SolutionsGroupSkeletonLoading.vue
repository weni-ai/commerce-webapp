<template>
  <section class="solutions__group">
    <header class="solutions__header">
      <UnnnicSkeletonLoading
        width="40px"
        height="40px"
      />

      <UnnnicSkeletonLoading
        width="180px"
        height="28px"
      />
    </header>

    <section class="solutions__list">
      <UnnnicSkeletonLoading
        v-for="i in 4"
        :key="i"
        height="162px"
      />
    </section>
  </section>
</template>

<style lang="scss" scoped>
.solutions {
  &__group {
    display: flex;
    flex-direction: column;
    row-gap: $unnnic-spacing-sm;
  }

  &__header {
    display: flex;
    align-items: center;
    column-gap: $unnnic-spacing-sm;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(344px, 1fr));
    gap: $unnnic-spacing-sm;
  }
}
</style>
