# API: Location

Location APIs expose position retrieval and map interactions.

## Methods

- `getLocation(options?)`
- `openLocation(options?)`
- `chooseLocation(options?)`

All methods return `Promise<CallbackPayload>`.

## `getLocation`

```js
const loc = await sdk.getLocation({ type: "wgs84" });
console.log(loc.latitude, loc.longitude);
```

## `openLocation`

```js
await sdk.openLocation({
	latitude: 22.5431,
	longitude: 114.0579,
	name: "Destination",
	address: "Shenzhen",
	scale: 16,
});
```

## `chooseLocation`

```js
const chosen = await sdk.chooseLocation({
	latitude: 22.5431,
	longitude: 114.0579,
});
console.log(chosen);
```

## Permission and Failure Handling

```js
try {
	const loc = await sdk.getLocation();
	renderMap(loc);
} catch (err) {
	if (err.context?.errMsg?.includes("permission")) {
		showPermissionHelp();
	} else {
		showLocationFallback();
	}
}
```

## Migration Notes

Legacy permission failures were mostly string-based. v2 still preserves `errMsg` but wraps failures into structured SDK errors for easier branch logic.
