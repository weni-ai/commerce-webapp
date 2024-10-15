<template>
  <TestTranslations />

  <main>
    <RouterView />
  </main>

  <Teleport to="#alerts">
    <UnnnicAlert
      v-if="alertStore.data.text"
      :key="alertStore.id"
      v-bind="alertStore.data"
      @close="alertStore.close"
    ></UnnnicAlert>
  </Teleport>
</template>

<script setup lang="ts">
import TestTranslations from '@/components/TestTranslations.vue';
import { useAlertStore } from './stores/Alert';
import { useAuthStore } from './stores/Auth';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const alertStore = useAlertStore();

if (import.meta.env.DEV) {
  const authStore = useAuthStore();

  const lastUsedLoginParams = JSON.parse(
    localStorage.getItem('dev:lastUsedLoginParams') || '{}',
  );

  if (lastUsedLoginParams.token) {
    authStore.setToken(lastUsedLoginParams.token);
  }

  if (lastUsedLoginParams.projectUuid) {
    authStore.setProjectUuid(lastUsedLoginParams.projectUuid);
  }

  if (lastUsedLoginParams.locale) {
    locale.value = lastUsedLoginParams.locale;
  }
}
</script>

<style scoped lang="scss">
main {
  padding: $unnnic-spacing-md;
}
</style>
