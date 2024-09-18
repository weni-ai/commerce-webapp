<template>
  <Teleport to="body">
    <Transition name="fade">
      <section
        v-if="isOpen"
        class="drawer__background"
        @click.self="$emit('update:isOpen', false)"
      ></section>
    </Transition>

    <Transition name="drawer">
      <section
        v-if="isOpen"
        class="drawer"
      >
        <header class="drawer__header">
          <Header
            :title="title"
            icon="business_messages"
            iconScheme="aux-orange-500"
            fontFamily="secondary"
            fontSize="title-md"
          />

          <UnnnicButton
            class="drawer__header__close-button"
            type="tertiary"
            iconCenter="arrow_forward"
            size="small"
            @click="$emit('update:isOpen', false)"
          />
        </header>

        <section class="drawer__body"></section>

        <footer class="drawer__footer"></footer>
      </section>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';

defineProps<{
  isOpen: boolean;
  title: string;
}>();

defineEmits<{
  'update:isOpen': [isOpen: boolean];
}>();
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.5s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  // opacity: 0;
  transform: translateX(100%);
}

.drawer {
  display: flex;
  flex-direction: column;

  width: 90%;
  max-width: 41.375 * $unnnic-font-size;

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: $unnnic-color-neutral-white;

  &__background {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: rgba(
      $unnnic-color-neutral-black,
      $unnnic-opacity-level-overlay
    );
  }

  &__header {
    display: flex;
    align-items: center;
    column-gap: $unnnic-spacing-sm;
    padding: $unnnic-spacing-md;
    padding-bottom: $unnnic-spacing-md - $unnnic-border-width-thinner;
    border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

    &__close-button {
      margin-left: auto;
    }
  }

  &__body {
    padding: $unnnic-spacing-md;
  }

  &__footer {
    margin-top: auto;
    padding: 0 $unnnic-spacing-md $unnnic-spacing-md;
  }
}
</style>
