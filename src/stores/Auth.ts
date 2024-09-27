import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref('');
  const projectUuid = ref('');

  function setToken(value: string) {
    token.value = value;
  }

  function setProjectUuid(value: string) {
    projectUuid.value = value;
  }

  return { token, setToken, projectUuid, setProjectUuid };
});
