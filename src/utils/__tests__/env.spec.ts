import { beforeEach, describe, expect, it } from 'vitest';
import getEnv from '../env';

window.configs = {
  FIRST_VAR: 'Var 1',
  VITE_APP_SECOND_VAR: 'Var 2',
};

import.meta.env.THIRD_VAR = 'Var 3';
import.meta.env.VITE_APP_FOURTH_VAR = 'Var 4';

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
    {
      name: 'VITE_APP_SECOND_VAR',
      value: 'Var 2',
    },
    {
      name: 'THIRD_VAR',
      value: 'Var 3',
    },
    {
      name: 'FOURTH_VAR',
      value: 'Var 4',
    },
    {
      name: 'VITE_APP_FOURTH_VAR',
      value: 'Var 4',
    },
  ])('var $name should be $value', ({ name, value }) => {
    expect(getEnv(name)).toBe(value);
  });
});
