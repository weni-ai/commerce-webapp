<template>
  <section>
    <UnnnicInput
      v-model="input"
      size="sm"
      iconRight="add"
      iconRightClickable
      @icon-right-click="iconRightClick()"
      @keydown.enter.self="iconRightClick()"
    />

    <section
      class="tags"
      v-bind="$attrs"
    >
      <section
        v-for="(tag, tagIndex) in modelValue"
        :key="tagIndex"
        class="tags__tag"
      >
        {{ tag }}
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const modelValue = defineModel<string[]>({ required: true });

const input = ref('');

function iconRightClick() {
  const tag = input.value.trim();

  if (modelValue.value.includes(tag)) {
    return;
  }

  if (tag) {
    modelValue.value = modelValue.value.concat(tag);
  }

  input.value = '';
}
</script>

<style lang="scss" scoped>
.tags {
  margin-top: $unnnic-spacing-xs;
  display: flex;
  flex-wrap: wrap;
  gap: $unnnic-spacing-xs;

  &__tag {
    user-select: none;
    padding: $unnnic-spacing-nano $unnnic-spacing-ant;
    border-radius: $unnnic-border-radius-pill;
    background-color: $unnnic-color-neutral-light;

    color: $unnnic-color-neutral-cloudy;
    font-family: $unnnic-font-family-secondary;
    font-weight: $unnnic-font-weight-regular;
    font-size: $unnnic-font-size-body-md;
    line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;
  }
}
</style>
