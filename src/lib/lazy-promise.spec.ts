import { LazyPromise } from './lazy-promise.class';

const lazyPromise = new LazyPromise(() => 42);

console.log(`lazyPromise.settled`, lazyPromise.settled); // false
console.log(`lazyPromise.value`, lazyPromise.value); // undefined

// Attaches a callback that is invoked when the lazy promise is resolved.
await lazyPromise.then(value => {
  console.log('Resolved value:', value); // Resolved value: 42
}).catch(error => {
  console.error('Error:', error);
});

// Attaches a callback that is invoked when the lazy promise is settled (either resolved or rejected).
lazyPromise.finally(() => {
  console.log('Promise settled');
});

console.log(`lazyPromise.settled`, lazyPromise.settled); // true
console.log(`lazyPromise.value`, lazyPromise.value); // undefined

// Resets the lazy promise to its initial state, allowing it to be executed again with the same factory function.
// lazyPromise.reset();

describe('LazyPromise', () => {
  it('should create an instance', () => {
    expect(new LazyPromise(() => 42)).toBeTruthy();
  });

  it('should resolve with a value', async () => {
    const lazy = new LazyPromise(() => 42);
    const result = await lazy;
    expect(result).toBe(42);
  });

  it('should reject with a reason', async () => {
    const lazy = new LazyPromise(() => { throw new Error('Test error'); });
    try {
      await lazy;
      expect.unreachable('Expected promise to be rejected');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Test error');
    }
  });

  it('should have settled false before resolve', () => {
    const lazy = new LazyPromise(() => 42);
    expect(lazy.settled).toBe(false);
  });

  it('should have settled true after resolve', async () => {
    const lazy = new LazyPromise(() => 42);
    await lazy;
    expect(lazy.settled).toBe(true);
  });

  it('should have settled true after reject', async () => {
    const lazy = new LazyPromise(() => { throw new Error('Test error'); });
    try { await lazy; } catch {}
    expect(lazy.settled).toBe(true);
  });

  it('should expose value after resolve', async () => {
    const lazy = new LazyPromise(() => 42);
    await lazy;
    expect(lazy.value).toBe(42);
  });

  it('should have undefined value after reject', async () => {
    const lazy = new LazyPromise(() => { throw new Error('Test error'); });
    try { await lazy; } catch {}
    expect(lazy.value).toBeUndefined();
  });

  it('should reset properly', async () => {
    const lazy = new LazyPromise(() => 42);
    await lazy;
    expect(lazy.settled).toBe(true);
    expect(lazy.value).toBe(42);

    lazy.reset();
    expect(lazy.settled).toBe(false);
    expect(lazy.value).toBeUndefined();
  });
});