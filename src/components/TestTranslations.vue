<template>
  <section v-if="active">
    <button @click="$i18n.locale = 'pt-br'">português</button>
    <button @click="$i18n.locale = 'en-us'">inglês</button>
    <button @click="$i18n.locale = 'es'">espanhol</button>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const active = ref(false);
const text = ref('');

let timeout: undefined | number;

document.addEventListener('keydown', (event) => {
  text.value += event.key;

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    text.value = '';
  }, 300);

  if (text.value === 'i18n') {
    active.value = true;
  }
});
</script>
