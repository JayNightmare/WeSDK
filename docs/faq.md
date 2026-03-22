# FAQ

## Is this SDK only for Luffa mini program web-view?

Primarily yes. It is designed for bridge-based host runtimes and can also detect unsupported environments safely.

## Can I use callbacks like the legacy SDK?

Yes for most APIs. v2 is Promise-first, and callback options remain for compatibility.

## Why should I still use Promise style if callbacks work?

Promise flow is easier to compose, test, and maintain, and maps better to modern async code.

## How do I know if an API is available before calling it?

Use:

- `getCapabilities()` for reason-rich results
- `isApiSupported()` for single API checks

## How do I handle no-bridge browser mode?

- call `getRuntimeInfo()` and capability checks at startup
- disable unsupported feature UI
- provide web fallback behavior where possible

## Does v2 support TypeScript?

Yes. Public typings are provided in `index.d.ts` and exposed via package `types` metadata.

## What should I log in production?

At minimum:

- diagnostics events
- error code and context
- runtime info snapshot when critical flows fail

## Is `invoke` safe to use directly?

It is intended for advanced/extension scenarios. Prefer dedicated typed methods when available.

## How do I migrate incrementally from v1?

- keep existing callbacks working initially
- migrate feature-by-feature to `await`
- add capability checks and structured error branches
- validate routing and communication flows in real host environment

## Where should new developers start?

Start with:

1. [Getting Started](./getting-started.md)
2. [Core Concepts](./core-concepts.md)
3. [Runtime and Capabilities](./api/runtime-capabilities.md)
