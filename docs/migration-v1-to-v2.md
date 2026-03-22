# Migration Guide: v1 to v2

This guide helps legacy SDK users move to v2 safely.

## High-Level Migration Strategy

1. Replace callback-only chains with Promise-based functions.
2. Add capability checks for optional APIs.
3. Replace string-only error logic with structured error branching.
4. Validate routing and communication flows in target host runtime.

## Breaking and Behavioral Changes

## 1. Promise-first semantics

v2 returns Promises from all APIs.

### Before (legacy)

```js
wx.chooseImage({
	success(res) {
		handle(res);
	},
	fail(err) {
		report(err);
	},
});
```

### After (v2)

```js
try {
	const res = await sdk.chooseImage();
	handle(res);
} catch (err) {
	report(err);
}
```

## 2. Routing usage

Prefer `sdk.miniProgram.*` with Promise handling for routing flows.

```js
await sdk.miniProgram.navigateTo({ url: "/pages/home/index" });
```

## 3. `ready()` timing assumptions

Treat `ready()` as async and always `await` it.

```js
await sdk.ready();
```

## 4. `invokeNativePlugin` validation

`api_name` is required in v2.

```js
await sdk.invokeNativePlugin({ api_name: "customApi", data: {} });
```

## 5. Capability reason support

Use reason-rich checks:

```js
const caps = await sdk.getCapabilities({ jsApiList: ["scanCode"] });
if (!caps.checkResult.scanCode) {
	console.warn(caps.details.scanCode.reason);
}
```

## 6. Structured error handling

```js
try {
	await sdk.getLocation();
} catch (err) {
	switch (err.code) {
		case "BRIDGE_TIMEOUT":
			showRetry();
			break;
		case "ENV_UNSUPPORTED":
			showFallback();
			break;
		default:
			report(err);
	}
}
```

## Common Migration Patterns

## Pattern A: callback chain to async function

- Create one async function per feature flow
- Wrap with one `try/catch`
- Keep UI update logic in one place

## Pattern B: feature-first guards

- Check support before rendering action buttons
- disable unsupported actions with reason text

## Pattern C: diagnostics instrumentation

- Add `onDiagnostics` during migration window
- Capture runtime failures and unsupported paths

## Migration Checklist

- Replace `wx` references with imported `sdk` where appropriate
- Add `await sdk.ready()` before first bridge call
- convert callback-only flows to Promise flow
- add capability checks for optional APIs
- review all plugin calls for `api_name`
- test in real host environment and no-bridge fallback browser mode

## Legacy Compatibility Notes

Most callback options still work on core APIs. Promise-based flow is still recommended as the source of truth for new code.
