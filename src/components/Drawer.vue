<template>
  <Teleport to="#drawers">
    <Transition name="fade">
      <section
        v-if="isOpen"
        class="drawer__background"
        data-test="background"
        @click.self="close"
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
            :icon="icon"
            :iconScheme="iconScheme"
            fontFamily="secondary"
            fontSize="title-md"
          />

          <UnnnicButton
            class="drawer__header__close-button"
            type="tertiary"
            iconCenter="arrow_forward"
            size="small"
            data-test="close-button"
            @click="close"
          />
        </header>

        <section class="drawer__body">
          <Scrollable>
            <slot name="default"></slot>
          </Scrollable>
        </section>

        <footer class="drawer__footer">
          <slot name="footer"></slot>
        </footer>
      </section>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import Scrollable from '@/components/Scrollable.vue';
import { onUnmounted, watch } from 'vue';

const isOpen = defineModel<boolean>('isOpen', { required: true });

defineProps<{
  title: string;
  icon: string;
  iconScheme: string;
}>();

function close() {
  isOpen.value = false;
}

watch(
  isOpen,
  (isOpen) => {
    document.body.classList?.[isOpen ? 'add' : 'remove']('drawer-view');
  },
  { immediate: true },
);

onUnmounted(() => {
  document.body.classList.remove('drawer-view');
});
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
    flex: 1;
    padding: $unnnic-spacing-md;
  }

  &__footer {
    display: grid;
    column-gap: $unnnic-spacing-ant;
    grid-template-columns: 1fr 1fr;

    margin-top: auto;
    padding: 0 $unnnic-spacing-md $unnnic-spacing-md;
  }
}
</style>
