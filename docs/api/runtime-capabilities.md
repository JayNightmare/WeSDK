# API: Runtime and Capabilities

This section documents the APIs that help you safely detect runtime constraints.

## `getRuntimeInfo()`

Returns bridge/runtime metadata immediately.

### Signature

```ts
getRuntimeInfo(): RuntimeInfo
```

### Response

```ts
{
  hasBridge: boolean;
  bridgeName: string | null;
  bridgeCandidates: string[];
  readyEvents: string[];
  isMiniProgramUA: boolean;
  userAgent: string;
}
```

### Example

```js
const info = sdk.getRuntimeInfo();
if (!info.hasBridge) {
	console.log("No native bridge available", info);
}
```

## `getCapabilities(options?)`

Checks support for one or more APIs.

### Signature

```ts
getCapabilities(options?: { jsApiList?: string[] }): Promise<CapabilitiesResult>
```

### Behavior

- If `jsApiList` is omitted, SDK checks a known API set.
- If no bridge exists, all entries return `supported: false` with reason `bridge_unavailable`.
- If native `checkJsApi` path is unavailable, returns reason `check_js_api_unavailable`.

### Response

```ts
{
	errMsg: string;
	checkResult: Record<string, boolean>;
	details: Record<string, { supported: boolean; reason: string }>;
	runtime: RuntimeInfo;
}
```

### Example

```js
const caps = await sdk.getCapabilities({
	jsApiList: ["scanCode", "chooseImage", "startRecord"],
});

for (const name of Object.keys(caps.checkResult)) {
	if (!caps.checkResult[name]) {
		console.warn(name, caps.details[name].reason);
	}
}
```

## `isApiSupported(apiName)`

Fast boolean helper for single API checks.

### Signature

```ts
isApiSupported(apiName: string): Promise<boolean>
```

### Example

```js
if (await sdk.isApiSupported("getLocation")) {
	const loc = await sdk.getLocation();
	renderLocation(loc);
} else {
	renderManualLocationInput();
}
```

## `checkJsApi(options?)`

Compatibility-facing capability call.

### Signature

```ts
checkJsApi(options?: { jsApiList?: string[]; success?; fail?; complete? }): Promise<CallbackPayload>
```

### Notes

- In no-bridge contexts, SDK returns an `ok` response with all requested APIs marked `false`.
- Prefer `getCapabilities()` for richer reason data.

## Capability Reason Semantics

- `supported`: API is currently available.
- `not_supported_by_client`: bridge exists, but client does not expose that API.
- `bridge_unavailable`: no detected bridge runtime.
- `check_js_api_unavailable`: check path unavailable or failed.

## Migration Notes

Legacy capability checks only provided boolean maps and weak context.

v2 adds reasoned results and runtime metadata so feature gating can be explicit.
