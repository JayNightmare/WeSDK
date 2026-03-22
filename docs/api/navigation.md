# API: Navigation

This page covers mini program routing and cross-mini-program transitions.

## Mini Program Routing (`sdk.miniProgram.*`)

### Methods

- `miniProgram.navigateTo(options?)`
- `miniProgram.navigateBack(options?)`
- `miniProgram.switchTab(options?)`
- `miniProgram.reLaunch(options?)`
- `miniProgram.redirectTo(options?)`

### Signature

```ts
(options?: CallbackOptions) => Promise<CallbackPayload>;
```

### Usage

```js
await sdk.miniProgram.navigateTo({ url: "/pages/pay/pay" });
await sdk.miniProgram.navigateBack({ delta: 1 });
```

### Important Behavior

Routing methods are Promise-first and should be handled with `await`/`.then`.

## Cross Mini Program Navigation

### `navigateToMiniProgram(options?)`

Open another mini program.

```js
await sdk.navigateToMiniProgram({
	appId: "target-app-id",
	path: "/pages/home/index",
	envVersion: "release",
	extraData: { from: "current-app" },
});
```

### `navigateBackMiniProgram(options?)`

Return to previous mini program.

```js
await sdk.navigateBackMiniProgram({
	extraData: { result: "ok" },
});
```

### `exitMiniProgram(options?)`

Exit current mini program.

```js
await sdk.exitMiniProgram();
```

## `canGoBack(options?)`

Determine if H5 can go back in navigation stack.

```js
const res = await sdk.canGoBack();
if (res.canGoBack) {
	history.back();
}
```

## `setNavigationBarTitle(options?)`

Update current page title in host navigation.

```js
await sdk.setNavigationBarTitle({ title: "Checkout" });
```

## Error and Fallback Guidance

- Check `isApiSupported` for optional paths.
- Catch errors and branch by code (`NATIVE_FAIL`, `BRIDGE_TIMEOUT`, etc).

```js
try {
	await sdk.miniProgram.navigateTo({ url: "/pages/profile" });
} catch (err) {
	if (err.code === "ENV_UNSUPPORTED") {
		window.location.href = "/profile";
	}
}
```

## Legacy Comparison

v1 routing relied heavily on callbacks and inconsistent completion behavior.

v2 standardizes routing to Promise-first flow for clearer control and error handling.
