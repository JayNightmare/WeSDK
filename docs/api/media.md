# API: Media

Media APIs cover image selection/preview and voice recording/playback.

## Image APIs

- `chooseImage(options?)`
- `previewImage(options?)`
- `getLocalImgData(options?)`

### `chooseImage`

```js
const res = await sdk.chooseImage({
	count: 3,
	sizeType: ["original", "compressed"],
	sourceType: ["album", "camera"],
});

// v2 normalized shape commonly includes tempFiles
console.log(res.tempFiles);
```

### `previewImage`

```js
await sdk.previewImage({
	current: 0,
	urls: [
		"https://cdn.example.com/a.png",
		"https://cdn.example.com/b.png",
	],
});
```

### `getLocalImgData`

```js
const imageData = await sdk.getLocalImgData({
	filePath: "/local/path/image.jpg",
});
```

## Voice APIs

- `startRecord(options?)`
- `stopRecord(options?)`
- `playVoice(options?)`
- `pauseVoice(options?)`
- `stopVoice(options?)`

### Record and Playback Example

```js
await sdk.startRecord();
// ... user action
const record = await sdk.stopRecord();
await sdk.playVoice({ filePath: record.tempFilePath });
```

## Capability-First Pattern

```js
const caps = await sdk.getCapabilities({
	jsApiList: ["chooseImage", "startRecord"],
});
if (!caps.checkResult.chooseImage) {
	disableImageInput(caps.details.chooseImage.reason);
}
```

## Migration Notes

v1 image handling often relied on separate path/size arrays. v2 encourages normalized file object handling where available.
