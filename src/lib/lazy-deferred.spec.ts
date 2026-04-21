import { LazyDeferred } from './lazy-deferred.class';

// Creates a new LazyDeferred instance with a factory function that returns the value 42, then attaches a then handler to log the resolved value and a catch handler to log any errors
const lazyDeferred = new LazyDeferred(() => 127);

// Attaches a then handler to the lazy deferred that logs the resolved value to the console when the promise is fulfilled, and a catch handler that logs any errors to the console
await lazyDeferred.then(value => {
  console.log('Resolved with:', value);
}).catch(error => {
  console.error('Error:', error);
});

console.log(lazyDeferred.settled); // true
console.log(lazyDeferred.value); // 127

// Attaches a finally handler to the lazy deferred that logs a message to the console when the promise is settled (either resolved or rejected)
lazyDeferred.finally(() => {
  console.log('Promise settled');
});

lazyDeferred.reset(); // Resets the lazy deferred to its initial state, allowing it to be executed again with the same factory function

lazyDeferred.resolve(134); // Manually resolves the lazy deferred with the value 134, overriding the factory function
lazyDeferred.reject(new Error('Test error')); // Manually rejects the lazy deferred with an error, overriding the factory function

console.log(`lazyDeferred.settled`, lazyDeferred.settled); // true
console.log(`lazyDeferred.value`, lazyDeferred.value); // 134

describe('LazyDeferred', () => {
  it('should create an instance', () => {
    expect(new LazyDeferred(() => 42)).toBeTruthy();
  });

  it('should resolve with a value', async () => {
    const lazy = new LazyDeferred(() => 42);
    const result = await lazy;
    expect(result).toBe(42);
  });

  it('should reject with a reason', async () => {
    const lazy = new LazyDeferred(() => { throw new Error('Test error'); });
    try {
      await lazy;
      expect.unreachable('Expected promise to be rejected');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Test error');
    }
  });

  it('should have settled false before resolve', () => {
    const lazy = new LazyDeferred(() => 42);
    expect(lazy.settled).toBe(false);
  });
  
  it('should have settled true after resolve', async () => {
    const lazy = new LazyDeferred(() => 42);
    await lazy;
    expect(lazy.settled).toBe(true);
  });

  it('should have settled true after reject', async () => {
    const lazy = new LazyDeferred(() => { throw new Error('Test error'); });
    try { await lazy; } catch {}
    expect(lazy.settled).toBe(true);
  });

  it('should expose value after resolve', async () => {
    const lazy = new LazyDeferred(() => 42);
    await lazy;
    expect(lazy.value).toBe(42);
  });

  it('should have undefined value after reject', async () => {
    const lazy = new LazyDeferred(() => { throw new Error('Test error'); });
    try { await lazy; } catch {}
    expect(lazy.value).toBeUndefined();
  });

  it('should reset properly', async () => {
    const lazy = new LazyDeferred(() => 42);
    await lazy;
    expect(lazy.settled).toBe(true);
    expect(lazy.value).toBe(42);

    lazy.reset();
    expect(lazy.settled).toBe(false);
    expect(lazy.value).toBeUndefined();
  });

});