import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

interface Alert {
  text: string;
  type?: 'default' | 'success' | 'error';
}

export const useAlertStore = defineStore('alert', () => {
  const id = ref(0);

  const alert = reactive<Alert>({
    text: '',
    type: undefined,
  });

  function addAlert({ text, type }: Alert) {
    id.value += 1;

    alert.text = text;
    alert.type = type;
  }

  function closeAlert() {
    alert.text = '';
    alert.type = undefined;
  }

  return {
    id,
    data: alert,

    add: addAlert,
    close: closeAlert,
  };
});
