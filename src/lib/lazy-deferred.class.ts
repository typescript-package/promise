// Class.
import { Deferred } from "./deferred.class";
/**
 * @description A lazy deferred implementation, which delays the execution of the provided factory function until the promise is actually used. Also allows manual resolution and rejection.
 * @export
 * @class LazyDeferred
 * @template T 
 * @implements {PromiseLike<T>}
 */
export class LazyDeferred<T> implements PromiseLike<T> {
  /**
   * @description Gets the promise associated with the lazy deferred.
   * @readonly
   * @type {Promise<T>}
   */
  get promise(): Promise<T> {
    return this.#execute().promise;
  }

  /**
   * @description Indicates whether the lazy deferred has been settled (resolved or rejected).
   * @readonly
   * @type {boolean}
   */
  get settled(): boolean {
    return this.#deferred?.settled ?? false;
  }

  /**
   * @description Gets the value of the lazy deferred if it has been resolved.
   * @readonly
   * @type {T | undefined}
   */
  get value(): T | undefined {
    return this.#value;
  }

  /**
   * @description The factory function used to create the value of the lazy deferred.
   * @type {(() => Promise<T> | T) | undefined}
   */
  #factory: (() => Promise<T> | T) | undefined;

  /**
   * @description The deferred instance associated with the lazy deferred.
   * @type {(Deferred<T> | undefined)}
   */
  #deferred: Deferred<T> | undefined;

  /**
   * @description The value of the lazy deferred if it has been resolved.
   * @type {(T | undefined)}
   */
  #value: T | undefined;

  /**
   * Creates an instance of `LazyDeferred`.
   * @constructor
   * @param {?() => Promise<T> | T} [factory] The factory function used to create the value of the lazy deferred.
   */
  constructor(factory?: () => Promise<T> | T) {
    this.#factory = factory;
  }

  /**
   * @description Attaches a callback for only the rejection of the lazy deferred.
   * @template [R=never] 
   * @param {?((reason: any) => R | PromiseLike<R>) | null} [onrejected] The callback function to be invoked when the lazy deferred is rejected.
   * @returns {Promise<T | R>} A promise that resolves or rejects with the result of the callback function.
   */
  catch<R = never>(
    onrejected?: ((reason: any) => R | PromiseLike<R>) | null
  ): Promise<T | R> {
    return this.#execute().catch(onrejected);
  }

  /**
   * @description Attaches a callback that is invoked when the lazy deferred is settled (either resolved or rejected).
   * @param {?(() => void) | null} [onfinally] The callback function to be invoked when the lazy deferred is settled.
   * @returns {Promise<T>} A promise that resolves or rejects with the same value or reason as the lazy deferred.
   */
  finally(onfinally?: (() => void) | null): Promise<T> {
    return this.#execute().finally(onfinally);
  }

  /**
   * @description Manual resolve — overrides factory
   * @param {(T | PromiseLike<T>)} value The value to resolve the lazy deferred with.
   * @returns {this} The current instance of `LazyDeferred`.
   */
  resolve(value: T | PromiseLike<T>): this {
    if (value && typeof (value as PromiseLike<T>).then === 'function') {
      Promise.resolve(value).then(v => (this.#value = v));
    } else {
      this.#value = value as T;
    }
    return (this.#deferred = this.#deferred ?? new Deferred<T>()),
      this.#deferred.resolve(value),
      this;
  }

  /**
   * @description Manual reject — overrides factory
   * @param {*} [reason] The reason to reject the lazy deferred with.
   * @returns {this} The current instance of `LazyDeferred`.
   */
  reject(reason?: any): this {
    return (this.#deferred = this.#deferred ?? new Deferred<T>()),
      this.#deferred.reject(reason),
      this;
  }

  /**
   * @description Resets the lazy deferred to its initial state, clearing any existing deferred and value. The factory function remains unchanged.
   * @returns {this} The current instance of `LazyDeferred`.
   */
  reset(): this {
    return (this.#deferred = undefined),
      (this.#value = undefined),
      this;
  }

  /**
   * @description Attaches callbacks for the resolution and/or rejection of the lazy deferred.
   * @template [R1=T] 
   * @template [R2=never] 
   * @param {?((value: T) => R1 | PromiseLike<R1>) | null} [onfulfilled] The callback function to be invoked when the lazy deferred is resolved.
   * @param {?((reason: any) => R2 | PromiseLike<R2>) | null} [onrejected] The callback function to be invoked when the lazy deferred is rejected.
   * @returns {Promise<R1 | R2>} A promise that resolves or rejects with the result of the callback functions.
   */
  then<R1 = T, R2 = never>(
    onfulfilled?: ((value: T) => R1 | PromiseLike<R1>) | null,
    onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | null
  ): Promise<R1 | R2> {
    return this.#execute().then(onfulfilled, onrejected);
  }

  /**
   * @description Executes the factory function if the deferred is not already created and returns the deferred.
   * @returns {Deferred<T>} The deferred instance associated with the lazy deferred.
   */
  #execute(): Deferred<T> {
    if (!this.#deferred) {
      this.#deferred = new Deferred<T>();
      if (this.#factory) {
        Promise.resolve().then(() => this.#factory?.())
          .then(value => {
            this.#value = value;
            this.#deferred!.resolve(value!);
          })
          .catch(error => this.#deferred!.reject(error));
      }
    }
    return this.#deferred;
  }
}