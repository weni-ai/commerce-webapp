import { i18n } from '@/locales';
import { useAlertStore } from '@/stores/Alert';
import { AxiosError } from 'axios';
import { get } from 'lodash';

window.addEventListener('unhandledrejection', (event) => {
  const alertStore = useAlertStore();

  if (event.reason instanceof AxiosError) {
    const { reason } = event;

    const statusCode = get(reason, 'response.status');

    if (statusCode === 401) {
      alertStore.add({
        type: 'error',
        text: i18n.global.t('common.errors.unauthorized'),
      });
    } else if (statusCode >= 500 && statusCode < 600) {
      alertStore.add({
        type: 'error',
        text: i18n.global.t('common.errors.internal_server_error'),
      });
    } else {
      alertStore.add({
        type: 'error',
        text: i18n.global.t('common.errors.unexpected_error'),
      });
    }
  }
});
