import { describe, expect, it, vi } from 'vitest';
import { checkZodScheme } from '..';
import { z } from 'zod';

const mocks = vi.hoisted(() => {
  return {
    SentryCaptureException: vi.fn(),
  };
});

vi.mock('@sentry/vue', () => ({
  captureException: mocks.SentryCaptureException,
}));

describe('Index', () => {
  describe('checkZodScheme', () => {
    it('Sentry should capture on Zod scheme error', () => {
      vi.spyOn(console, 'error').mockImplementationOnce(() => {});

      checkZodScheme(z.object({ foo: z.number() }), { foo: 'bar' });

      expect(mocks.SentryCaptureException).toBeCalledWith(
        expect.objectContaining({
          name: 'ZodError',
          issues: [
            {
              code: 'invalid_type',
              expected: 'number',
              received: 'string',
              path: ['foo'],
              message: 'Expected number, received string',
            },
          ],
        }),
      );
    });
  });
});
