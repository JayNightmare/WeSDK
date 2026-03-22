# Core Concepts

This page explains the behavior model behind WeSDK v2.

## Promise-First Execution Model

All public APIs return Promises.

```js
try {
	const res = await sdk.getLocation();
	console.log(res);
} catch (err) {
	console.error(err);
}
```

Callback options are still accepted on most APIs for compatibility, but Promise handling is the recommended default.

## Bridge Lifecycle

The SDK dispatches calls through a detected bridge (`LuffaJSBridge`, `WeixinJSBridge`, `QQJSBridge` by default).

- `ready()` resolves when bridge is available.
- `ready()` rejects on timeout or unsupported environment.
- Timeout is configurable via `readyTimeout`.

## Runtime Detection and Capability Discovery

Use runtime APIs before invoking optional features:

- `getRuntimeInfo()` returns runtime/bridge metadata.
- `getCapabilities()` returns capability map plus reasons.
- `isApiSupported(apiName)` returns a single boolean.

Capability reason values:

- `supported`
- `not_supported_by_client`
- `bridge_unavailable`
- `check_js_api_unavailable`

## Response Normalization

SDK responses are normalized to reduce platform inconsistencies.

Every response may include:

- `errMsg`
- `__method`
- `__status` (`success`, `cancel`, `fail`)

This makes generic success/failure handling easier.

## Error Model

Failures reject with `WeSDKError` carrying:

- `message`
- `code`
- `context`
- `errMsg`

Common codes include:

- `ENV_UNSUPPORTED`
- `BRIDGE_TIMEOUT`
- `NATIVE_FAIL`
- `INVOKE_EXCEPTION`
- `INVALID_ARGUMENT`

See [Error Reference](./error-reference.md).

## Diagnostics

You can attach `onDiagnostics` via `config` to receive internal lifecycle events.

Typical events:

- `invoke:start`
- `invoke:response`
- `bridge:not-ready`
- `listener:added`
- `listener:removed`
- `listener:off-error`

## Multiple SDK Instances

Use `create()` to isolate configuration and runtime behavior between modules/tests.

```js
const sdkA = sdk.create({ debug: true, readyTimeout: 5000 });
const sdkB = sdk.create({ debug: false, readyTimeout: 15000 });
```

## Migration Mindset

When upgrading from legacy:

- replace callback-only orchestration with `await`
- centralize capability checks before feature use
- switch string-based error parsing to structured error handling

See [Migration v1 to v2](./migration-v1-to-v2.md).
