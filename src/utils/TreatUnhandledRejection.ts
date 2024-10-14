import { i18n } from '@/locales';
import { useAlertStore } from '@/stores/Alert';
import { AxiosError, HttpStatusCode } from 'axios';
import { get } from 'lodash';

export const onUnhandledRejection = (event: PromiseRejectionEvent) => {
  const alertStore = useAlertStore();

  if (event.reason instanceof AxiosError) {
    const { reason } = event;

    const statusCode = get(reason, 'response.status');

    if (statusCode === HttpStatusCode.Unauthorized) {
      alertStore.add({
        type: 'error',
        text: i18n.global.t('common.errors.unauthorized'),
      });
    } else if (
      statusCode >= HttpStatusCode.InternalServerError &&
      statusCode <= HttpStatusCode.NetworkAuthenticationRequired
    ) {
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
};

window.addEventListener('unhandledrejection', onUnhandledRejection);
