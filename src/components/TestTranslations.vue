<template>
  <section v-if="active">
    <button
      data-test="pt-br"
      @click="$i18n.locale = 'pt-br'"
    >
      português
    </button>

    <button
      data-test="en-us"
      @click="$i18n.locale = 'en-us'"
    >
      inglês
    </button>

    <button
      data-test="es"
      @click="$i18n.locale = 'es'"
    >
      espanhol
    </button>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

const active = ref(false);
const text = ref('');

function onKeydown(event: Pick<KeyboardEvent, 'key'>) {
  text.value += event.key;

  if (text.value.endsWith('i18n')) {
    active.value = true;
  }
}

if (import.meta.env.DEV) {
  document.addEventListener('keydown', onKeydown);

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown);
  });
}
</script>
