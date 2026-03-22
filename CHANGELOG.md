# Changelog

## 2.0.0 - 2026-03-22

Initial public release of the revamped WeSDK package.

### Added

- Promise-first API model with optional callback compatibility
- Runtime and capability introspection APIs
     - `getRuntimeInfo()`
     - `getCapabilities()`
     - `isApiSupported()`
- Structured SDK errors with contextual metadata
- Normalized response metadata (`errMsg`, `__method`, `__status`)
- Configurable bridge detection and readiness timeout
- Diagnostics hook support for observability
- TypeScript definitions (`index.d.ts`)
- npm-compatible ESM and CommonJS entry points
- Comprehensive multi-page documentation under `docs/`

### Notes

- Legacy SDK is preserved in `JSSDK.legacy.js` for reference and migration.
