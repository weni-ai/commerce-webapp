import { i18n } from '@/locales';
import { useAlertStore } from '@/stores/Alert';
import { AxiosError, HttpStatusCode } from 'axios';
import { get } from 'lodash';

export const onUnhandledRejection = ({
  reason: error,
}: Pick<PromiseRejectionEvent, 'reason'>) => {
  const alertStore = useAlertStore();

  if (error instanceof AxiosError) {
    const errorMessage = get(error, 'response.data.error');
    const statusCode = get(error, 'response.status');

    if (errorMessage && typeof errorMessage === 'string') {
      alertStore.add({
        type: 'error',
        text: errorMessage,
      });
    } else if (statusCode === HttpStatusCode.Unauthorized) {
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
