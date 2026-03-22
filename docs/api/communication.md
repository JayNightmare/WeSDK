# API: Communication

Communication APIs connect H5 web-view and mini program container messaging.

## `miniProgram.postMessage(options?)`

Send a message payload to the host mini program.

```js
await sdk.miniProgram.postMessage({
	data: { type: "cart:updated", itemCount: 3 },
});
```

## `miniProgram.sendWebviewEvent(options?)`

Send web-view event payload to host.

```js
await sdk.miniProgram.sendWebviewEvent({
	data: { event: "payment:success", orderId: "A123" },
});
```

## `miniProgram.onWebviewEvent(callback)`

Register host-to-H5 event listener.

```js
const unsubscribe = sdk.miniProgram.onWebviewEvent((payload) => {
	console.log("received", payload);
});
```

## `miniProgram.offWebviewEvent(callback?)`

Remove one listener or all listeners.

```js
sdk.miniProgram.offWebviewEvent();
// or
sdk.miniProgram.offWebviewEvent(myHandler);
```

## `miniProgram.getEnv(callback?)`

Returns `{ miniprogram: boolean }` and supports callback form.

```js
const env = await sdk.miniProgram.getEnv();
if (!env.miniprogram) {
	console.log("running outside mini-program web-view");
}
```

## Root-Level Aliases

The SDK also exposes root-level communication methods:

- `sendWebviewEvent(options?)`
- `onWebviewEvent(callback)`
- `offWebviewEvent(callback?)`

These mirror the miniProgram communication behavior.

## Best Practices

- Keep event payloads schema-based (`type`, `version`, `payload`).
- Unsubscribe listeners during teardown to avoid leaks.
- Treat messages as untrusted input and validate shape.
- Use capability checks when communication APIs are optional.

## Legacy Comparison

v1 listener lifecycles were easy to misuse.

v2 includes clearer subscribe/unsubscribe behavior and Promise-compatible send APIs.
