import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAlertStore } from '@/stores/Alert';
import { AxiosError, HttpStatusCode } from 'axios';
import { onUnhandledRejection } from '../TreatUnhandledRejection';

vi.mock('@/locales');

describe('TreatUnhandledRejection', () => {
  let alertStore: ReturnType<typeof useAlertStore>;

  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    });

    setActivePinia(pinia);

    alertStore = useAlertStore();
  });

  it.each([
    {
      status: HttpStatusCode.Unauthorized,
      alertText: 'common.errors.unauthorized',
    },
    {
      status: HttpStatusCode.InternalServerError,
      alertText: 'common.errors.internal_server_error',
    },
    {
      status: HttpStatusCode.NetworkAuthenticationRequired,
      alertText: 'common.errors.internal_server_error',
    },
    {
      status: HttpStatusCode.PermanentRedirect,
      alertText: 'common.errors.unexpected_error',
    },
  ])(
    'Axios status $status should alert $alertText',
    ({ status, alertText }) => {
      onUnhandledRejection({
        reason: new AxiosError('Error', AxiosError.ERR_BAD_RESPONSE, {}, null, {
          status,
        }),
      });

      expect(alertStore.add).toHaveBeenCalledWith({
        type: 'error',
        text: alertText,
      });
    },
  );

  describe('when error is Axios and it has a response error string', () => {
    it('should alert the response error', () => {
      onUnhandledRejection({
        reason: new AxiosError('Error', AxiosError.ERR_BAD_RESPONSE, {}, null, {
          data: { error: 'Error message' },
        }),
      });

      expect(alertStore.add).toHaveBeenCalledWith({
        type: 'error',
        text: 'Error message',
      });
    });
  });
});
