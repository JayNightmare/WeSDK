# API: Device and File

This section covers device utilities and document opening.

## Device APIs

- `scanCode(options?)`
- `getNetworkType(options?)`

## File API

- `openDocument(options?)`

## `scanCode`

```js
const scan = await sdk.scanCode({
	onlyFromCamera: true,
	scanType: ["qrCode", "barCode"],
});

console.log(scan.result, scan.scanType);
```

## `getNetworkType`

```js
const net = await sdk.getNetworkType();
console.log(net.networkType);
```

## `openDocument`

```js
await sdk.openDocument({
	filePath: "/local/files/manual.pdf",
	fileType: "pdf",
});
```

## Safe Usage Pattern

```js
if (await sdk.isApiSupported("openDocument")) {
	await sdk.openDocument({ filePath: localPdfPath });
} else {
	showDownloadLink();
}
```

## Migration Notes

Legacy SDK offered these APIs but with less consistent failure behavior. v2 guarantees Promise rejection on failure and normalized response metadata.
