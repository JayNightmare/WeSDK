# Getting Started

This guide gets you from zero to a safe first API call.

## 1. Install or Load the SDK

### Option A: npm (recommended)

```bash
npm install @luffa/jssdk
```

### Option B: browser script

Load your hosted `JSSDK.js` bundle in the web-view page.

```html
<script src="/path/to/JSSDK.js"></script>
```

## 2. Import the SDK

### ESM

```js
import sdk from "@luffa/jssdk";
```

### CommonJS

```js
const sdk = require("@luffa/jssdk");
```

### Global browser usage

```js
// window.wx / window.jWeixin / window.qq
const sdk = window.wx;
```

## 3. Configure at App Startup

```js
sdk.config({
	debug: false,
	readyTimeout: 8000,
	onDiagnostics(event) {
		// Optional: pipe to telemetry
		// event.event: invoke:start | invoke:response | bridge:not-ready | listener:*
	},
});
```

## 4. Wait for Bridge Readiness

```js
try {
	await sdk.ready();
} catch (err) {
	// No bridge or timeout path
	console.error("Bridge not ready", err);
}
```

## 5. Check Capabilities Before Feature Use

```js
const caps = await sdk.getCapabilities({
	jsApiList: ["scanCode", "getLocation"],
});

if (!caps.checkResult.scanCode) {
	// reason: bridge_unavailable | not_supported_by_client | check_js_api_unavailable
	console.warn(caps.details.scanCode.reason);
}
```

## 6. Make Your First Safe API Call

```js
if (await sdk.isApiSupported("scanCode")) {
	const result = await sdk.scanCode({ onlyFromCamera: true });
	console.log(result);
} else {
	console.log("scanCode is unavailable in this runtime");
}
```

## 7. Optional Callback Interop (Legacy-Friendly)

v2 is Promise-first, but callback options still work for most APIs:

```js
sdk.getNetworkType({
	success(res) {
		console.log(res);
	},
	fail(err) {
		console.error(err);
	},
	complete() {
		console.log("done");
	},
});
```

Note: `miniProgram` routing methods use Promise semantics as the primary behavior.

## Quick Integration Checklist

- Call `config` once at startup
- Always `await ready()` before bridge-dependent flows
- Prefer capability checks for optional features
- Use `try/catch` around all async API calls
- Use diagnostics hook in production for visibility

## Next Steps

- Read [Core Concepts](./core-concepts.md)
- Read [Migration v1 to v2](./migration-v1-to-v2.md) if you are upgrading legacy code
