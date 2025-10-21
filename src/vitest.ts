export const describe = (_name: string, fn: () => void) => {
  fn();
};

export const it = (_name: string, fn: () => void) => {
  fn();
};

export const expect = (value: unknown) => ({
  toEqual(expected: unknown) {
    if (JSON.stringify(value) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(value)} to equal ${JSON.stringify(expected)}`);
    }
  },
  toHaveLength(expected: number) {
    if (!Array.isArray(value) && typeof value !== 'string') {
      throw new Error('Value does not have a length property');
    }
    if ((value as { length: number }).length !== expected) {
      throw new Error(
        `Expected length ${(value as { length: number }).length} to equal ${expected}`
      );
    }
  }
});
