# Improvements Over Legacy SDK

This page summarizes why v2 is easier to integrate and maintain than the legacy `WeSDK.legacy.js`.

## 1. Async Model Upgrade

### Legacy

- Callback-only orchestration
- Harder control flow in multi-step operations

### v2

- Promise-first API surface
- `async/await` support across all core methods
- Optional callback compatibility maintained for most APIs

## 2. Capability-Aware Design

### Legacy

- Limited support probing and weak diagnostics

### v2

- `getRuntimeInfo` for environment introspection
- `getCapabilities` with reasons per API
- `isApiSupported` for fast feature gating

## 3. Structured Error Handling

### Legacy

- Mostly string-based `errMsg` parsing

### v2

- `WeSDKError` with `code`, `context`, and `errMsg`
- Stable error categories (`ENV_UNSUPPORTED`, `BRIDGE_TIMEOUT`, `NATIVE_FAIL`, `INVALID_ARGUMENT`)

## 4. Response Normalization

### Legacy

- Different field naming from native implementations (`err_code`, `err_msg`, etc)

### v2

- Normalized response shape with:
     - `errMsg`
     - `__method`
     - `__status`

## 5. Runtime Configuration and Observability

### Legacy

- Limited debug behavior

### v2

- `config` supports `debug`, `readyTimeout`, diagnostics hook, and custom bridge candidates
- Diagnostics lifecycle events for production visibility

## 6. Better Event Lifecycle Handling

### Legacy

- Harder listener lifecycle management

### v2

- cleaner subscribe/unsubscribe behavior
- unsubscribe function pattern from `onWebviewEvent`

## 7. Packaging and Typing

### Legacy

- Primarily script/global usage

### v2

- npm-ready ESM and CommonJS entry points
- TypeScript declaration coverage (`index.d.ts`)

## 8. Developer Experience Impact

v2 reduces integration friction by enabling:

- predictable error handling
- explicit runtime capability checks
- cleaner async logic
- better tooling support in modern JS/TS stacks

## Practical Migration Gain

Most teams see immediate simplification by converting callback-heavy workflows to `await`-based sequences with centralized `try/catch` and capability guards.

See [Migration v1 to v2](./migration-v1-to-v2.md) for concrete before/after patterns.
