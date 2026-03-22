# WeSDK Documentation (v2.0.0-dev)

Welcome to the documentation for the revamped Luffa JavaScript SDK.

This SDK is designed for H5 applications running inside Luffa mini program web-view containers (with compatibility for WeChat-like bridge environments), while still providing predictable behavior when no bridge is available.

## What Is New in v2

Compared to the legacy SDK, v2 adds:

- Promise-first APIs with optional callback interop
- Runtime and capability introspection (`getRuntimeInfo`, `getCapabilities`, `isApiSupported`)
- Structured, inspectable SDK errors
- Response normalization (`errMsg`, `__method`, `__status`)
- Configurable bridge detection and readiness timeout
- Diagnostics hooks for observability
- TypeScript declarations for the full public API
- npm entry points for ESM and CommonJS

## Recommended Reading Order

1. [Getting Started](./getting-started.md)
2. [Core Concepts](./core-concepts.md)
3. [Configuration](./configuration.md)
4. API sections:
      - [Runtime and Capabilities](./api/runtime-capabilities.md)
      - [Navigation](./api/navigation.md)
      - [Communication](./api/communication.md)
      - [Storage](./api/storage.md)
      - [Media](./api/media.md)
      - [Location](./api/location.md)
      - [Device and File](./api/device-file.md)
      - [Plugin and Generic Invoke](./api/plugin-invoke.md)
5. [Migration v1 to v2](./migration-v1-to-v2.md)
6. [Troubleshooting](./troubleshooting.md)
7. [Error Reference](./error-reference.md)
8. [FAQ](./faq.md)

## Who This Documentation Is For

- New developers integrating Luffa SDK for the first time
- Teams migrating from legacy callback-only WeSDK
- Developers building robust production flows with fallback behavior and diagnostics

## SDK Distribution

The package exposes:

- Browser build: `./browser` -> `WeSDK.js`
- ESM entry: `index.mjs`
- CJS entry: `index.cjs`
- Type definitions: `index.d.ts`

See [Getting Started](./getting-started.md) for usage examples.
