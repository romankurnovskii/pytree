import 'jest-canvas-mock';

import { hello } from '../src';

describe('Init test', () => {
  it('verify hello function', () => {
    const expected = true;
    const { result } = hello();
    expect(result).toBe(expected);
  });
});
