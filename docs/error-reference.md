# Error Reference

This page maps SDK error codes to likely causes and recovery actions.

## Error Shape

SDK failures reject as `LuffaJSSDKError` with:

- `code`
- `message`
- `context`
- `errMsg`

## Error Codes

## `ENV_UNSUPPORTED`

Meaning:

- No supported bridge available in current runtime

Typical causes:

- Running in standalone browser without bridge
- bridge script not injected by host container

Recovery:

- check `getRuntimeInfo()`
- show fallback UI
- skip bridge-dependent features

## `BRIDGE_TIMEOUT`

Meaning:

- Bridge did not become ready before configured timeout

Typical causes:

- slow host initialization
- wrong `bridgeCandidates`

Recovery:

- increase `readyTimeout`
- verify candidate order
- add retry path around `ready()`

## `NATIVE_FAIL`

Meaning:

- Native bridge returned a failure status

Typical causes:

- permission denied
- unsupported runtime API
- invalid method payload values

Recovery:

- inspect `err.context.errMsg`
- branch by known failure classes
- add capability checks for optional features

## `INVOKE_EXCEPTION`

Meaning:

- SDK threw while trying to invoke native bridge

Typical causes:

- malformed bridge object
- host bridge implementation bug

Recovery:

- inspect diagnostics
- validate host bridge contract

## `INVALID_ARGUMENT`

Meaning:

- Invalid SDK method input

Typical causes:

- missing required fields (for example `invokeNativePlugin.api_name`)
- invalid method name in generic invoke

Recovery:

- validate payload in caller
- add schema checks at app boundary

## Practical Error Handler

```js
function handleSdkError(err) {
	switch (err.code) {
		case "ENV_UNSUPPORTED":
			return showUnsupportedMessage();
		case "BRIDGE_TIMEOUT":
			return showRetryPrompt();
		case "INVALID_ARGUMENT":
			return reportClientBug(err);
		default:
			return reportRuntimeIssue(err);
	}
}
```

## Related Docs

- [Troubleshooting](./troubleshooting.md)
- [Core Concepts](./core-concepts.md)
