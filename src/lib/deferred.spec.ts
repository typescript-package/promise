import { Deferred } from './deferred.class';

// Creates a new Deferred instance and resolves it with the value 42, then logs the resolved value to the console
const deferred = new Deferred<number>();
// Resolves the deferred with a value of 42 and logs it to the console
deferred.resolve(42);
// Attaches a then handler to the deferred that logs the resolved value to the console when the promise is fulfilled
deferred.then(value => {
  console.log('Resolved value:', value);
});
// Creates a new Deferred instance and rejects it with an error, then logs the error to the console
deferred.catch(error => {
  console.error('Error:', error);
});

describe('Deferred', () => {
  it('should create an instance', () => {
    expect(new Deferred()).toBeTruthy();
  });

  it('should resolve with a value', async () => {
    const deferred = new Deferred<number>();
    deferred.resolve(42);
    const result = await deferred;
    expect(result).toBe(42);
  });

  it('should reject with a reason', async () => {
    const deferred = new Deferred<number>();
    deferred.reject(new Error('Test error'));
    try {
      await deferred;
      expect.unreachable('Expected promise to be rejected');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Test error');
    }
  });

  // ─── settled ─────────────────────────────────────────────────────

  it('should have settled false before resolve', () => {
    const deferred = new Deferred<number>();
    expect(deferred.settled).toBe(false);
  });

  it('should have settled true after resolve', async () => {
    const deferred = new Deferred<number>();
    deferred.resolve(42);
    await deferred;
    expect(deferred.settled).toBe(true);
  });

  it('should have settled true after reject', async () => {
    const deferred = new Deferred<number>();
    deferred.reject(new Error('Test error'));
    try { await deferred; } catch {}
    expect(deferred.settled).toBe(true);
  });

  // ─── promise ─────────────────────────────────────────────────────

  it('should expose promise property', () => {
    const deferred = new Deferred<number>();
    expect(deferred.promise).toBeInstanceOf(Promise);
  });

  it('await deferred and await deferred.promise should return same result', async () => {
    const deferred = new Deferred<number>();
    deferred.resolve(42);
    const [a, b] = await Promise.all([deferred, deferred.promise]);
    expect(a).toBe(b);
  });

  // ─── catch / finally ─────────────────────────────────────────────

  it('should catch rejection', async () => {
    const deferred = new Deferred<number>();
    deferred.reject(new Error('catch test'));
    const error = await deferred.catch(e => e);
    expect(error).toBeInstanceOf(Error);
  });

  it('should call finally on resolve', async () => {
    const deferred = new Deferred<number>();
    const spy = vi.fn();
    deferred.resolve(1);
    await deferred.finally(spy);
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should call finally on reject', async () => {
    const deferred = new Deferred<number>();
    const spy = vi.fn();
    deferred.reject(new Error('finally test'));
    await deferred.finally(spy).catch(() => {});
    expect(spy).toHaveBeenCalledOnce();
  });
});
