# API: Storage

Storage APIs provide key-value persistence via host environment storage.

## Methods

- `getStorage(options?)`
- `setStorage(options?)`
- `removeStorage(options?)`
- `clearStorage(options?)`
- `getStorageInfo(options?)`

All return:

```ts
Promise<CallbackPayload>;
```

## `setStorage`

```js
await sdk.setStorage({ key: "session", data: { token: "abc" } });
```

## `getStorage`

```js
const res = await sdk.getStorage({ key: "session" });
console.log(res.data);
```

## `removeStorage`

```js
await sdk.removeStorage({ key: "session" });
```

## `clearStorage`

```js
await sdk.clearStorage();
```

## `getStorageInfo`

```js
const info = await sdk.getStorageInfo();
console.log(info.keys, info.currentSize, info.limitSize);
```

## Response Notes

v2 responses include normalized metadata (`errMsg`, `__method`, `__status`) in addition to method-specific fields.

## Error Handling Pattern

```js
try {
	const result = await sdk.getStorage({ key: "profile" });
	useProfile(result.data);
} catch (err) {
	if (err.code === "ENV_UNSUPPORTED") {
		useProfileFromLocalFallback();
	}
}
```

## Migration Notes

Legacy field usage (`res.data`) remains valid; v2 adds predictable normalized wrappers.
