# Configuration

Use `config()` to define runtime behavior.

## API

```ts
config(options?: {
  debug?: boolean;
  readyTimeout?: number;
  onDiagnostics?: (event) => void;
  bridgeCandidates?: string[];
}): LuffaJSSDK
```

## Options

### `debug`

- Type: `boolean`
- Default: `false`
- Enables SDK debug logs to `console.log`.

### `readyTimeout`

- Type: `number` (ms)
- Default: `5000`
- Timeout used by `ready()` and bridge wait paths.

### `onDiagnostics`

- Type: `(event) => void`
- Receives lifecycle events with timestamps and payloads.

### `bridgeCandidates`

- Type: `string[]`
- Default: `['LuffaJSBridge','WeixinJSBridge','QQJSBridge']`
- Ordered bridge resolution list. First match wins.

## Example: Production-Safe Configuration

```js
sdk.config({
	debug: false,
	readyTimeout: 10000,
	bridgeCandidates: ["LuffaJSBridge", "WeixinJSBridge", "QQJSBridge"],
	onDiagnostics(event) {
		if (event.event === "bridge:not-ready") {
			report("sdk_bridge_not_ready", event.payload);
		}
	},
});
```

## Runtime Toggles

`setDebug(enabled)` can change debug mode at runtime.

```js
sdk.setDebug(true);
```

## Chainable Calls

`config()` returns the SDK instance, so chaining is possible.

```js
sdk.config({ debug: true }).config({ readyTimeout: 12000 });
```

## Common Configuration Patterns

### Strict mobile container mode

- lower timeout
- no fallback UI
- diagnostics to crash/reporting channel

### Mixed browser + container mode

- capability checks before all optional features
- clear user messaging for `bridge_unavailable`

### QA mode

- debug enabled
- diagnostics printed and stored

## Legacy Comparison

Legacy SDK had limited, mostly opaque debug behavior.

v2 adds:

- explicit timeout control
- diagnostics hooks
- ordered bridge candidate configuration
