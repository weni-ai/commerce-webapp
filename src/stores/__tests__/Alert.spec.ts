import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAlertStore } from '@/stores/Alert';

describe('Alert Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initial id should be 0', () => {
    const alertStore = useAlertStore();

    expect(alertStore.id).toBe(0);
  });

  describe('when the alert is added', () => {
    let alertStore: ReturnType<typeof useAlertStore>;

    beforeEach(() => {
      alertStore = useAlertStore();

      alertStore.add({
        type: 'default',
        text: 'Alert title',
      });
    });

    it('id should be 1', () => {
      expect(alertStore.id).toBe(1);
    });

    it('sets the data to have the alert object', () => {
      expect(alertStore.data).toEqual(
        expect.objectContaining({
          type: 'default',
          text: 'Alert title',
        }),
      );
    });

    describe('when the alert closes', () => {
      it('clears the data', () => {
        alertStore.close();

        expect(alertStore.data).toEqual(
          expect.objectContaining({
            type: undefined,
            text: '',
          }),
        );
      });
    });
  });
});
