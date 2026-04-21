
<a href="https://www.typescriptlang.org/">
  <img
    src="https://avatars.githubusercontent.com/u/189666396?s=150&u=9d55b1eb4ce258974ead76bf07ccf49ef0eb0ea7&v=4"
    title="The typescript package enhances the development of typescript-based applications by providing well-structured, reusable, easy-to-use packages."
  />
</a>

## @typescript-package/promise

<!-- npm badge -->
[![npm version][typescript-package-npm-badge-svg]][typescript-package-npm-badge]
[![GitHub issues][typescript-package-badge-issues]][typescript-package-issues]
[![GitHub license][typescript-package-badge-license]][typescript-package-license]

A lightweight **TypeScript** library for promises.

## Table of contents

- [Installation](#installation)
- [Api](#api)
  - Concrete
    - [`Deferred`](#deferred)
    - [`LazyDeferred`](#lazydeferred)
    - [`LazyPromise`](#lazypromise)
- [Contributing](#contributing)
- [Support](#support)
- [Code of Conduct](#code-of-conduct)
- [Git](#git)
  - [Commit](#commit)
  - [Versioning](#versioning)
- [License](#license)

## Installation

```bash
npm install @typescript-package/promise --save-peer
```

## Api

```typescript
import {
  Deferred,
  LazyDeferred,
  LazyPromise
} from '@typescript-package/data';
```

### Concrete

### `Deferred`

```typescript
import { Deferred } from '@typescript-package/promise';

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
```

### `LazyDeferred`

```typescript
import { LazyDeferred } from '@typescript-package/promise';

// Creates a new LazyDeferred instance with a factory function that returns the value 42
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
```

[Source](https://)

### `LazyPromise`

```typescript
import { LazyPromise } from '@typescript-package/promise';

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
```

## Contributing

Your contributions are valued! If you'd like to contribute, please feel free to submit a pull request. Help is always appreciated.

## Support

If you find this package useful and would like to support its and general development, you can contribute through one of the following payment methods. Your support helps maintain the packages and continue adding new.

Support via:

- [4Fund](https://4fund.com/bruubs)
- [DonorBox](https://donorbox.org/become-a-sponsor-to-the-angular-package?default_interval=o)
- [GitHub](https://github.com/sponsors/angular-package/sponsorships?sponsor=sciborrudnicki&tier_id=83618)
- [Ko-fi](https://ko-fi.com/sterblack)
- [OpenCollective](https://opencollective.com/sterblack)
- [Patreon](https://www.patreon.com/checkout/angularpackage?rid=0&fan_landing=true&view_as=public)
- [PayPal](https://paypal.me/sterblack)
- [Stripe](https://donate.stripe.com/dR614hfDZcJE3wAcMM)
- ~~[Revolut](https://checkout.revolut.com/pay/048b10a3-0e10-42c8-a917-e3e9cb4c8e29)~~

or via Trust Wallet

- [BNB](https://link.trustwallet.com/send?coin=20000714&address=0xA0c22A2bc7E37C1d5992dFDFFeD5E6f9298E1b94)
- [BTC](https://link.trustwallet.com/send?coin=0&address=bc1qnf709336tfl57ta5mfkf4t9fndhx7agxvv9svn)
- [ETH](https://link.trustwallet.com/send?coin=60&address=0xA0c22A2bc7E37C1d5992dFDFFeD5E6f9298E1b94)
- [USDT (BEP20)](https://link.trustwallet.com/send?coin=20000714&address=0xA0c22A2bc7E37C1d5992dFDFFeD5E6f9298E1b94&token_id=0x55d398326f99059fF775485246999027B3197955)
- [XLM](https://link.trustwallet.com/send?coin=148&address=GAFFFB7H3LG42O6JA63FJDRK4PP4JCNEOPHLGLLFH625X2KFYQ4UYVM4)

Thanks for your support!

## Code of Conduct

By participating in this project, you agree to follow **[Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)**.

## GIT

### Commit

- [AngularJS Git Commit Message Conventions][git-commit-angular]
- [Karma Git Commit Msg][git-commit-karma]
- [Conventional Commits][git-commit-conventional]

### Versioning

[Semantic Versioning 2.0.0][git-semver]

**Given a version number MAJOR.MINOR.PATCH, increment the:**

- MAJOR version when you make incompatible API changes,
- MINOR version when you add functionality in a backwards-compatible manner, and
- PATCH version when you make backwards-compatible bug fixes.

Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

**FAQ**
How should I deal with revisions in the 0.y.z initial development phase?

> The simplest thing to do is start your initial development release at 0.1.0 and then increment the minor version for each subsequent release.

How do I know when to release 1.0.0?

> If your software is being used in production, it should probably already be 1.0.0. If you have a stable API on which users have come to depend, you should be 1.0.0. If you’re worrying a lot about backwards compatibility, you should probably already be 1.0.0.

## License

MIT © typescript-package ([license][typescript-package-license])

## Packages

- **[@typescript-package/affix](https://github.com/typescript-package/affix)**: A **lightweight TypeScript** library for the affix - prefix and suffix.
- **[@typescript-package/are](https://github.com/typescript-package/are)**: Type-safe `are` checkers for validating value types in TypeScript.
- **[@typescript-package/descriptor](https://github.com/typescript-package/descriptor)**: A **lightweight TypeScript** library for property descriptor.
- **[@typescript-package/guard](https://github.com/typescript-package/guard)**: Type-safe guards for guarding the value types in TypeScript.c
- **[@typescript-package/history](https://github.com/typescript-package/history)**: A **TypeScript** package for tracking history of values.
- **[@typescript-package/is](https://github.com/typescript-package/is)**: Type-safe is checkers for validating value types in TypeScript.
- **[@typescript-package/map](https://github.com/typescript-package/map)**: A lightweight **TypeScript** library for enhanced `map` management.
- **[@typescript-package/name](https://github.com/typescript-package/name)**: A **lightweight TypeScript** library for the name with prefix and suffix.
- **[@typescript-package/property](https://github.com/typescript-package/property)**: A **lightweight TypeScript** package with features to handle object properties.
- **[@typescript-package/queue](https://github.com/typescript-package/queue)**: A **lightweight TypeScript** library for managing various queue and stack structures.
- **[@typescript-package/range](https://github.com/typescript-package/range)**: A **lightweight TypeScript** library for managing various types of ranges.
- **[@typescript-package/regexp](https://github.com/typescript-package/regexp)**: A **lightweight TypeScript** library for **RegExp**.
- **[@typescript-package/set](https://github.com/typescript-package/set)**: A lightweight **TypeScript** library for enhanced `set` management.
- **[@typescript-package/state](https://github.com/typescript-package/state)**: Simple state management for different types in **TypeScript**.
- **[@typescript-package/storage](https://github.com/typescript-package/storage)**: The storage of data under allowed names.
- **[@typescript-package/type](https://github.com/typescript-package/type)**: Utility types to enhance and simplify **TypeScript** development.
- **[@typescript-package/wrapper](https://github.com/typescript-package/wrapper)**: A **lightweight TypeScript** library to wrap the text with the opening and closing chars.

<!-- This package: typescript-package  -->
  <!-- GitHub: badges -->
  [typescript-package-badge-issues]: https://img.shields.io/github/issues/typescript-package/promise
  [isscript-package-badge-forks]: https://img.shields.io/github/forks/typescript-package/promise
  [typescript-package-badge-stars]: https://img.shields.io/github/stars/typescript-package/promise
  [typescript-package-badge-license]: https://img.shields.io/github/license/typescript-package/promise
  <!-- GitHub: badges links -->
  [typescript-package-issues]: https://github.com/typescript-package/promise/issues
  [typescript-package-forks]: https://github.com/typescript-package/promise/network
  [typescript-package-license]: https://github.com/typescript-package/promise/blob/master/LICENSE
  [typescript-package-stars]: https://github.com/typescript-package/promise/stargazers
<!-- This package -->

<!-- Package: typescript-package -->
  <!-- npm -->
  [typescript-package-npm-badge-svg]: https://badge.fury.io/js/@typescript-package%2Fpromise.svg
  [typescript-package-npm-badge]: https://badge.fury.io/js/@typescript-package%2Fpromise

<!-- GIT -->
[git-semver]: http://semver.org/

<!-- GIT: commit -->
[git-commit-angular]: https://gist.github.com/stephenparish/9941e89d80e2bc58a153
[git-commit-karma]: http://karma-runner.github.io/0.10/dev/git-commit-msg.html
[git-commit-conventional]: https://www.conventionalcommits.org/en/v1.0.0/
