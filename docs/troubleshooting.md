# Troubleshooting

This page provides issue-oriented recovery playbooks.

## 1. `ready()` rejects with timeout

Symptoms:

- `WeSDKError.code === 'BRIDGE_TIMEOUT'`

Checks:

- confirm host container injects bridge
- inspect `getRuntimeInfo()`
- validate `bridgeCandidates` order

Recovery:

```js
sdk.config({ readyTimeout: 12000 });
await sdk.ready();
```

## 2. API unsupported in some clients

Symptoms:

- capability check returns false

Checks:

```js
const caps = await sdk.getCapabilities({ jsApiList: ["scanCode"] });
console.log(caps.details.scanCode.reason);
```

Recovery:

- hide or disable feature
- offer fallback UX

## 3. Permission denied errors

Symptoms:

- `NATIVE_FAIL` with `permission` in `errMsg`

Recovery:

- show permission guidance
- allow retry after user action

## 4. Listener leaks or duplicate events

Symptoms:

- event callback firing multiple times

Recovery:

- store unsubscribe function
- call unsubscribe on teardown

```js
const unsub = sdk.miniProgram.onWebviewEvent(handleEvent);
// later
unsub();
```

## 5. Plugin calls failing

Symptoms:

- `INVALID_ARGUMENT` from `invokeNativePlugin`

Recovery:

- ensure `api_name` is present
- validate request payload shape

## 6. Running outside mini program

Symptoms:

- `ENV_UNSUPPORTED`
- capability reasons show `bridge_unavailable`

Recovery:

- route to browser-native alternatives
- gate all bridge-required buttons using capability checks

## Diagnostics Workflow

1. enable diagnostics in config
2. reproduce issue
3. inspect event timeline
4. map event payload to failing API
5. add targeted fallback or payload validation

```js
sdk.config({
	onDiagnostics(event) {
		console.log(event.event, event.payload);
	},
});
```
