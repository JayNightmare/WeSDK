# API: Plugin and Generic Invoke

Use these APIs for custom native capabilities or advanced scenarios.

## `invokeNativePlugin(options?)`

Call a host-defined custom native plugin API.

### Signature

```ts
invokeNativePlugin(options?: CallbackOptions & { api_name?: string }): Promise<CallbackPayload>
```

### Required Field

- `api_name` is required.

### Example

```js
const res = await sdk.invokeNativePlugin({
	api_name: "customApiName",
	data: { orderId: "A123" },
});
```

### Validation Behavior

If `api_name` is missing, SDK rejects with `INVALID_ARGUMENT`.

## `invoke(method, options?)`

Low-level generic bridge invocation.

### Signature

```ts
invoke(method: string, options?: CallbackOptions): Promise<CallbackPayload>
```

### Example

```js
const custom = await sdk.invoke("customMethodName", {
	foo: "bar",
});
```

### Guidance

- Prefer typed top-level SDK methods when available.
- Use `invoke` for new host APIs before dedicated SDK wrappers are added.
- Wrap in `try/catch` and log `err.context` for debugging.

## Diagnostics with Custom Invokes

```js
sdk.config({
	onDiagnostics(event) {
		if (
			event.event === "invoke:start" ||
			event.event === "invoke:response"
		) {
			console.log(event.payload);
		}
	},
});
```

## Migration Notes

Legacy plugin calls were less strictly validated. v2 enforces safer argument expectations and explicit Promise rejection paths.
