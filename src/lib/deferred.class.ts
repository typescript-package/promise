/**
 * @description A simple Deferred implementation, allowing manual resolution and rejection of a promise.
 * @export
 * @class Deferred
 * @template T 
 * @implements {PromiseLike<T>}
 */
export class Deferred<T> implements PromiseLike<T> {
  /**
   * @description Exposes the underlying promise of the deferred, which can be awaited or chained with then/catch/finally.
   * @readonly
   * @type {Promise<T>}
   */
  get promise(): Promise<T> {
    return this.#promise;
  }

  /**
   * @description Indicates whether the deferred has been settled (resolved or rejected).
   * @readonly
   * @type {boolean}
   */
  get settled(): boolean {
    return this.#settled;
  }

  /**
   * @description Privately holds the promise instance.
   * @type {Promise<T>}
   */
  #promise: Promise<T>;

  /**
   * @description Privately holds the settled state of the deferred.
   * @type {boolean}
   */
  #settled = false;

  /**
   * @description Manually resolves the deferred with a value or a promise-like.
   * @type {!(value: T | PromiseLike<T>) => void}
   */
  resolve!: (value: T | PromiseLike<T>) => void;

  /**
   * @description Manually rejects the deferred with a reason.
   * @type {!(reason?: any) => void}
   */
  reject!: (reason?: any) => void;

  /**
   * Creates an instance of `Deferred`.
   * @constructor
   */
  constructor() {
    this.#promise = new Promise<T>((resolve, reject) => {
      this.resolve = value => { this.#settled = true; resolve(value); };
      this.reject  = reason => { this.#settled = true; reject(reason); };
    });
  }

  /**
   * @description Attaches a callback for only the rejection of the deferred.
   * @template [R=never] 
   * @param {?((reason: any) => R | PromiseLike<R>) | null} [onrejected] The callback function to be invoked when the deferred is rejected.
   * @returns {Promise<T | R>} A promise that resolves or rejects with the result of the callback function.
   */
  catch<R = never>(
    onrejected?: ((reason: any) => R | PromiseLike<R>) | null
  ): Promise<T | R> {
    return this.#promise.catch(onrejected);
  }

  /**
   * @description Attaches a callback that is invoked when the deferred is settled (either resolved or rejected).
   * @param {?(() => void) | null} [onfinally] The callback function to be invoked when the deferred is settled.
   * @returns {Promise<T>} A promise that resolves or rejects with the same value or reason as the deferred.
   */
  finally(onfinally?: (() => void) | null): Promise<T> {
    return this.#promise.finally(onfinally);
  }

  
  /**
   * @description Attaches callbacks for the resolution and/or rejection of the deferred.
   * @template [R1=T] 
   * @template [R2=never] 
   * @param {?((value: T) => R1 | PromiseLike<R1>) | null} [onfulfilled] The callback function to be invoked when the deferred is resolved.
   * @param {?((reason: any) => R2 | PromiseLike<R2>) | null} [onrejected] The callback function to be invoked when the deferred is rejected.
   * @returns {Promise<R1 | R2>} A promise that resolves or rejects with the result of the callback functions.

   */
  then<R1 = T, R2 = never>(
    onfulfilled?: ((value: T) => R1 | PromiseLike<R1>) | null,
    onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | null
  ): Promise<R1 | R2> {
    return this.#promise.then(onfulfilled, onrejected);
  }
}