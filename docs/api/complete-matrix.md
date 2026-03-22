# API Complete Matrix

This matrix lists the full public SDK surface for v2.

## Core and Lifecycle

- `config(options?)`
- `ready(callback?)`
- `setDebug(enabled)`
- `create(options?)`
- `invoke(method, options?)`

## Runtime and Capability APIs

- `getRuntimeInfo()`
- `getCapabilities(options?)`
- `isApiSupported(apiName)`
- `checkJsApi(options?)`

## Navigation and Mini Program Routing

- `miniProgram.navigateTo(options?)`
- `miniProgram.navigateBack(options?)`
- `miniProgram.switchTab(options?)`
- `miniProgram.reLaunch(options?)`
- `miniProgram.redirectTo(options?)`
- `navigateToMiniProgram(options?)`
- `navigateBackMiniProgram(options?)`
- `exitMiniProgram(options?)`
- `canGoBack(options?)`
- `setNavigationBarTitle(options?)`

## Communication

- `miniProgram.postMessage(options?)`
- `miniProgram.sendWebviewEvent(options?)`
- `miniProgram.onWebviewEvent(callback)`
- `miniProgram.offWebviewEvent(callback?)`
- `miniProgram.getEnv(callback?)`
- `sendWebviewEvent(options?)`
- `onWebviewEvent(callback)`
- `offWebviewEvent(callback?)`

## Storage

- `getStorage(options?)`
- `setStorage(options?)`
- `removeStorage(options?)`
- `clearStorage(options?)`
- `getStorageInfo(options?)`

## Media

- `chooseImage(options?)`
- `previewImage(options?)`
- `getLocalImgData(options?)`
- `startRecord(options?)`
- `stopRecord(options?)`
- `playVoice(options?)`
- `pauseVoice(options?)`
- `stopVoice(options?)`

## Location

- `getLocation(options?)`
- `openLocation(options?)`
- `chooseLocation(options?)`

## Device and File

- `scanCode(options?)`
- `getNetworkType(options?)`
- `openDocument(options?)`

## Plugin

- `invokeNativePlugin(options?)`

## Related References

- [Runtime and Capabilities](./runtime-capabilities.md)
- [Navigation](./navigation.md)
- [Communication](./communication.md)
- [Storage](./storage.md)
- [Media](./media.md)
- [Location](./location.md)
- [Device and File](./device-file.md)
- [Plugin and Generic Invoke](./plugin-invoke.md)
