<template>
  <section class="scrollable">
    <section style="height: 0">
      <slot></slot>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.scrollable {
  overflow: auto;
  width: 100%;
  height: 100%;

  $scroll-size: $unnnic-spacing-nano;

  $spacing-right: $unnnic-spacing-nano * 2 + $scroll-size;

  padding-right: $spacing-right;
  margin-right: -$spacing-right;

  &::-webkit-scrollbar {
    width: $scroll-size;
  }

  &::-webkit-scrollbar-thumb {
    background: $unnnic-color-neutral-clean;
    border-radius: $unnnic-border-radius-pill;
  }

  &::-webkit-scrollbar-track {
    background: $unnnic-color-neutral-soft;
    border-radius: $unnnic-border-radius-pill;
  }
}
</style>
