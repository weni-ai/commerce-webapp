import { beforeEach, describe, expect, it } from 'vitest';
import getEnv from '../env';

window.configs = {
  FIRST_VAR: 'Var 1',
};

import.meta.env.SECOND_VAR = 'Var 2';

describe('Env', () => {
  beforeEach(() => {});

  it.each([
    {
      name: 'FIRST_VAR',
      value: 'Var 1',
    },
    {
      name: 'SECOND_VAR',
      value: 'Var 2',
    },
  ])('var $name should be $value', ({ name, value }) => {
    expect(getEnv(name)).toBe(value);
  });
});
