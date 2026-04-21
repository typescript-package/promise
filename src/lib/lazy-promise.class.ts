import { Deferred } from "./deferred.class";
/**
 * @description A lazy promise implementation, which delays the execution of the provided factory function until the promise is actually used.
 * @export
 * @class LazyPromise
 * @template T 
 * @implements {PromiseLike<T>}
 */
export class LazyPromise<T> implements PromiseLike<T> {
  /**
   * @description Gets the promise associated with the lazy promise.
   * @readonly
   * @type {Promise<T>}
   */
  get promise(): Promise<T> {
    return this.#execute().promise;
  }

  /**
   * @description A boolean indicating whether the promise has been settled (either resolved or rejected).
   * @readonly
   * @type {boolean}
   */
  get settled(): boolean {
    return this.#deferred?.settled ?? false;
  }
  
  /**
   * @description The resolved value of the promise, or `undefined` if the promise is not yet resolved or has been rejected.
   * @readonly
   * @type {(T | undefined)}
   */
  get value(): T | undefined {
    return this.#value;
  }

  /**
   * @description The factory function that produces the value or promise for this lazy promise.
   * @type {() => Promise<T> | T}
   */
  #factory: () => Promise<T> | T;

  /**
   * @description The deferred object that represents the internal state of the lazy promise.
   * @type {(Deferred<T> | undefined)}
   */
  #deferred: Deferred<T> | undefined;

  /**
   * @description The resolved value of the promise, or `undefined` if the promise is not yet resolved or has been rejected.
   * @type {(T | undefined)}
   */
  #value: T | undefined;

  /**
   * Creates an instance of `LazyPromise`.
   * @constructor
   * @param {() => Promise<T> | T} factory A function that produces the value or promise for this lazy promise.
   */
  constructor(factory: () => Promise<T> | T) {
    this.#factory = factory;
  }

  /**
   * @description Attaches a callback for only the rejection of the promise.
   * @template [R=never] The type of the value returned by the `onrejected` callback.
   * @param {?((reason: any) => R | PromiseLike<R>) | null} [onrejected] A function that is called if the promise is rejected. This function has one argument, the reason for the rejection.
   * @returns {Promise<T | R>} A promise that is resolved or rejected with the result of the called callback.
   */
  catch<R = never>(
    onrejected?: ((reason: any) => R | PromiseLike<R>) | null
  ): Promise<T | R> {
    return this.#execute().catch(onrejected);
  }

  /**
   * @description Attaches a callback that is invoked when the promise is settled, regardless of whether it was resolved or rejected.
   * @param {?(() => void) | null} [onfinally] A function that is called when the promise is settled. This function has no arguments.
   * @returns {Promise<T>} A promise that is resolved or rejected with the same value or reason as the original promise.
   */
  finally(onfinally?: (() => void) | null): Promise<T> {
    return this.#execute().finally(onfinally);
  }

  /**
   * @description Resets the lazy promise, clearing its internal state and allowing it to be executed again.
   * @returns {this} The current instance of `LazyPromise`.
   */
  reset(): this {
    return (this.#deferred = undefined),
      (this.#value = undefined),
      this;
  }

  /**
   * @description Attaches callbacks for the resolution and/or rejection of the promise.
   * @template [R1=T] 
   * @template [R2=never] 
   * @param {?((value: T) => R1 | PromiseLike<R1>) | null} [onfulfilled] A function that is called if the promise is resolved. This function has one argument, the resolved value.
   * @param {?((reason: any) => R2 | PromiseLike<R2>) | null} [onrejected] A function that is called if the promise is rejected. This function has one argument, the reason for the rejection.
   * @returns {Promise<R1 | R2>} A promise that is resolved or rejected with the result of the called callback.
   */
  then<R1 = T, R2 = never>(
    onfulfilled?: ((value: T) => R1 | PromiseLike<R1>) | null,
    onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | null
  ): Promise<R1 | R2> {
    return this.#execute().then(onfulfilled, onrejected);
  }

  /**
   * @description Executes the factory function if it has not been executed yet, and returns the deferred object representing the promise's state.
   * @private
   * @returns {Deferred<T>} The deferred object representing the promise's state.
   */
  #execute(): Deferred<T> {
    if (!this.#deferred) {
      this.#deferred = new Deferred<T>();
      Promise.resolve().then(() => this.#factory())
        .then(value => (
          (this.#value = value),
          (this.#deferred!.resolve(value))
        ))
        .catch(error => this.#deferred!.reject(error));
    }
    return this.#deferred;
  }
}
