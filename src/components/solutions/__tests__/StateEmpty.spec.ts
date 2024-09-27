import { setup } from '@/tests/utils';
import { beforeEach, describe, expect, it } from 'vitest';
import StateEmpty from '@/components/solutions/StateEmpty.vue';

describe('StateEmpty', () => {
  let wrapper: ReturnType<typeof setup>;

  beforeEach(() => {
    wrapper = setup(StateEmpty);
  });

  it('renders title and description', () => {
    expect(wrapper.text()).contains('solutions.states.empty.title');
    expect(wrapper.text()).contains('solutions.states.empty.description');
  });
});
