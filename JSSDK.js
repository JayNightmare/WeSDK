(function (root, factory) {
	if (typeof define === "function" && (define.amd || define.cmd)) {
		define(function () {
			return factory(root);
		});
		return;
	}

	if (typeof module === "object" && module.exports) {
		module.exports = factory(root);
		return;
	}

	var sdk = factory(root);
	root.jWeixin = sdk;
	root.wx = sdk;
	root.qq = sdk;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
	"use strict";

	var READY_EVENTS = [
		"LuffaJSBridgeReady",
		"WeixinJSBridgeReady",
		"QQJSBridgeReady",
		"JSBridgeReady",
	];

	var ROUTING_METHODS = {
		navigateTo: true,
		navigateBack: true,
		switchTab: true,
		reLaunch: true,
		redirectTo: true,
	};

	var KNOWN_API_LIST = [
		"checkJsApi",
		"invokeNativePlugin",
		"canGoBack",
		"setNavigationBarTitle",
		"getStorage",
		"setStorage",
		"removeStorage",
		"clearStorage",
		"getStorageInfo",
		"chooseImage",
		"previewImage",
		"getLocalImgData",
		"startRecord",
		"stopRecord",
		"playVoice",
		"pauseVoice",
		"stopVoice",
		"getLocation",
		"openLocation",
		"chooseLocation",
		"openDocument",
		"scanCode",
		"getNetworkType",
		"navigateToMiniProgram",
		"navigateBackMiniProgram",
		"exitMiniProgram",
		"sendWebviewEvent",
		"postMessage",
		"onWebviewEvent",
		"offWebviewEvent",
		"navigateTo",
		"navigateBack",
		"switchTab",
		"reLaunch",
		"redirectTo",
	];

	function LuffaJSSDKError(message, code, context) {
		this.name = "LuffaJSSDKError";
		this.message = message;
		this.code = code || "UNKNOWN";
		this.context = context || {};
		this.errMsg = this.context.errMsg || "sdk:fail " + message;
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, LuffaJSSDKError);
		} else {
			this.stack = new Error(message).stack;
		}
	}
	LuffaJSSDKError.prototype = Object.create(Error.prototype);
	LuffaJSSDKError.prototype.constructor = LuffaJSSDKError;

	function toObject(value) {
		return value && typeof value === "object" ? value : {};
	}

	function now() {
		return Date.now ? Date.now() : new Date().getTime();
	}

	function normalizeResponse(method, response) {
		var raw = toObject(response);

		if (raw.err_code !== undefined && raw.errCode === undefined) {
			raw.errCode = raw.err_code;
		}
		delete raw.err_code;
		delete raw.err_desc;
		delete raw.err_detail;

		if (!raw.errMsg) {
			raw.errMsg = raw.err_msg || method + ":ok";
		}
		delete raw.err_msg;

		raw.errMsg = normalizeErrMsg(method, raw.errMsg);
		raw.__method = method;
		raw.__status = getStatusFromErrMsg(raw.errMsg);
		return raw;
	}

	function normalizeErrMsg(method, errMsg) {
		var msg = typeof errMsg === "string" ? errMsg : "";
		if (!msg) {
			return method + ":ok";
		}

		if (msg.indexOf(":") === -1) {
			msg = method + ":" + msg;
		}

		var splitAt = msg.indexOf(":");
		var prefix = msg.slice(0, splitAt);
		var suffix = msg
			.slice(splitAt + 1)
			.trim()
			.toLowerCase();

		if (suffix === "confirm") {
			suffix = "ok";
		}
		if (suffix === "failed") {
			suffix = "fail";
		}
		if (suffix.indexOf("failed_") === 0) {
			suffix = suffix.slice(7);
		}
		if (suffix.indexOf("fail_") === 0) {
			suffix = suffix.slice(5);
		}
		suffix = suffix.replace(/_/g, " ");

		if (suffix === "access denied") {
			suffix = "permission denied";
		}
		if (suffix === "no permission to execute") {
			suffix = "permission denied";
		}

		return prefix + ":" + suffix;
	}

	function getStatusFromErrMsg(errMsg) {
		var idx = errMsg.indexOf(":");
		var tail = idx === -1 ? errMsg : errMsg.slice(idx + 1);
		if (tail === "ok") {
			return "success";
		}
		if (tail === "cancel") {
			return "cancel";
		}
		return "fail";
	}

	function attachLegacyCallbacks(promise, options, disableCallbacks) {
		var opts = toObject(options);
		if (disableCallbacks) {
			return promise;
		}

		return promise
			.then(function (response) {
				if (typeof opts.success === "function") {
					opts.success(response);
				}
				if (typeof opts.complete === "function") {
					opts.complete(response);
				}
				return response;
			})
			.catch(function (error) {
				var payload =
					error && error.context
						? error.context
						: {
								errMsg: "sdk:fail unknown",
							};
				if (
					payload &&
					payload.errMsg &&
					payload.errMsg.indexOf(":cancel") !== -1
				) {
					if (typeof opts.cancel === "function") {
						opts.cancel(payload);
					}
				} else if (typeof opts.fail === "function") {
					opts.fail(payload);
				}
				if (typeof opts.complete === "function") {
					opts.complete(payload);
				}
				throw error;
			});
	}

	function createBridgeManager(options) {
		var opts = toObject(options);
		var candidateNames =
			Array.isArray(opts.bridgeCandidates) &&
			opts.bridgeCandidates.length
				? opts.bridgeCandidates
				: [
						"LuffaJSBridge",
						"WeixinJSBridge",
						"QQJSBridge",
					];

		function getBridgeMeta() {
			for (var i = 0; i < candidateNames.length; i += 1) {
				var name = candidateNames[i];
				var bridge = root[name];
				if (
					bridge &&
					typeof bridge.invoke === "function"
				) {
					return {
						name: name,
						bridge: bridge,
					};
				}
			}
			return {
				name: null,
				bridge: null,
			};
		}

		function getBridge() {
			return getBridgeMeta().bridge;
		}

		function whenReady(timeoutMs) {
			var timeout =
				typeof timeoutMs === "number"
					? timeoutMs
					: opts.readyTimeout || 5000;
			var bridge = getBridge();
			if (bridge) {
				return Promise.resolve(bridge);
			}

			return new Promise(function (resolve, reject) {
				var settled = false;
				var timer = null;
				var listeners = [];

				function cleanup() {
					for (
						var i = 0;
						i < listeners.length;
						i += 1
					) {
						root.document.removeEventListener(
							listeners[i],
							onReady,
							false,
						);
					}
					listeners = [];
					if (timer) {
						clearTimeout(timer);
						timer = null;
					}
				}

				function finishWithBridge() {
					if (settled) {
						return;
					}
					var found = getBridge();
					if (!found) {
						return;
					}
					settled = true;
					cleanup();
					resolve(found);
				}

				function onReady() {
					finishWithBridge();
				}

				if (
					!root.document ||
					typeof root.document
						.addEventListener !== "function"
				) {
					reject(
						new LuffaJSSDKError(
							"bridge unavailable in current environment",
							"ENV_UNSUPPORTED",
							{
								errMsg: "sdk:fail no document to await bridge",
							},
						),
					);
					return;
				}

				for (
					var i = 0;
					i < READY_EVENTS.length;
					i += 1
				) {
					var eventName = READY_EVENTS[i];
					root.document.addEventListener(
						eventName,
						onReady,
						false,
					);
					listeners.push(eventName);
				}

				timer = setTimeout(function () {
					if (settled) {
						return;
					}
					settled = true;
					cleanup();
					reject(
						new LuffaJSSDKError(
							"bridge ready timeout",
							"BRIDGE_TIMEOUT",
							{
								errMsg: "sdk:fail bridge ready timeout",
								timeout: timeout,
							},
						),
					);
				}, timeout);

				finishWithBridge();
			});
		}

		return {
			getBridge: getBridge,
			getBridgeMeta: getBridgeMeta,
			getCandidateNames: function () {
				return candidateNames.slice();
			},
			whenReady: whenReady,
		};
	}

	function createLuffaJSSDK(config) {
		var cfg = toObject(config);
		var state = {
			debug: !!cfg.debug,
			createdAt: now(),
			listeners: {},
			diagnosticsHook:
				typeof cfg.onDiagnostics === "function"
					? cfg.onDiagnostics
					: null,
			readyTimeout:
				typeof cfg.readyTimeout === "number"
					? cfg.readyTimeout
					: 5000,
		};

		var bridgeManager = createBridgeManager(cfg);

		function getRuntimeInfo() {
			var meta = bridgeManager.getBridgeMeta();
			var ua =
				root.navigator && root.navigator.userAgent
					? root.navigator.userAgent
					: "";
			return {
				hasBridge: !!meta.bridge,
				bridgeName: meta.name,
				bridgeCandidates:
					bridgeManager.getCandidateNames(),
				readyEvents: READY_EVENTS.slice(),
				isMiniProgramUA:
					typeof ua === "string" &&
					ua
						.toLowerCase()
						.indexOf("miniprogram") !== -1,
				userAgent: ua,
			};
		}

		function emitDiagnostics(event, payload) {
			if (typeof state.diagnosticsHook === "function") {
				state.diagnosticsHook({
					event: event,
					timestamp: now(),
					payload: payload,
				});
			}
			if (
				state.debug &&
				root.console &&
				typeof root.console.log === "function"
			) {
				root.console.log(
					"[LuffaJSSDK]",
					event,
					payload,
				);
			}
		}

		function failUnsupported(method) {
			return Promise.reject(
				new LuffaJSSDKError(
					"bridge unavailable",
					"ENV_UNSUPPORTED",
					{
						errMsg:
							method +
							":fail no bridge available",
						method: method,
					},
				),
			);
		}

		function invoke(method, params, invokeOptions) {
			var request = toObject(params);
			var options = toObject(invokeOptions);
			var timeoutMs =
				typeof options.timeoutMs === "number"
					? options.timeoutMs
					: state.readyTimeout;

			var start = now();
			emitDiagnostics("invoke:start", {
				method: method,
				params: request,
			});

			return bridgeManager
				.whenReady(timeoutMs)
				.catch(function (error) {
					emitDiagnostics("bridge:not-ready", {
						method: method,
						error: error,
					});
					if (options.allowNoBridge) {
						throw error;
					}
					return null;
				})
				.then(function (bridge) {
					if (
						!bridge ||
						typeof bridge.invoke !==
							"function"
					) {
						return failUnsupported(method);
					}

					return new Promise(function (
						resolve,
						reject,
					) {
						try {
							bridge.invoke(
								method,
								request,
								function (
									rawResponse,
								) {
									var normalized =
										normalizeResponse(
											method,
											rawResponse,
										);
									emitDiagnostics(
										"invoke:response",
										{
											method: method,
											durationMs:
												now() -
												start,
											response: normalized,
										},
									);

									if (
										normalized.__status ===
										"success"
									) {
										resolve(
											normalized,
										);
										return;
									}

									reject(
										new LuffaJSSDKError(
											normalized.errMsg,
											"NATIVE_FAIL",
											normalized,
										),
									);
								},
							);
						} catch (error) {
							reject(
								new LuffaJSSDKError(
									"bridge invocation failed",
									"INVOKE_EXCEPTION",
									{
										errMsg:
											method +
											":fail invoke exception",
										cause: error,
									},
								),
							);
						}
					});
				});
		}

		function on(eventName, callback) {
			if (typeof callback !== "function") {
				throw new LuffaJSSDKError(
					"listener must be a function",
					"INVALID_ARGUMENT",
					{
						errMsg: "sdk:fail listener must be a function",
					},
				);
			}

			if (!state.listeners[eventName]) {
				state.listeners[eventName] = [];
			}
			state.listeners[eventName].push(callback);

			var bridge = bridgeManager.getBridge();
			if (bridge && typeof bridge.on === "function") {
				bridge.on(eventName, callback);
			}

			emitDiagnostics("listener:added", {
				eventName: eventName,
				count: state.listeners[eventName].length,
			});

			return function unsubscribe() {
				off(eventName, callback);
			};
		}

		function off(eventName, callback) {
			var list = state.listeners[eventName] || [];

			if (!callback) {
				state.listeners[eventName] = [];
			} else {
				state.listeners[eventName] = list.filter(
					function (fn) {
						return fn !== callback;
					},
				);
			}

			var bridge = bridgeManager.getBridge();
			if (bridge && typeof bridge.off === "function") {
				try {
					bridge.off(eventName, callback);
				} catch (error) {
					emitDiagnostics("listener:off-error", {
						eventName: eventName,
						error: error,
					});
				}
			}

			emitDiagnostics("listener:removed", {
				eventName: eventName,
				count: (state.listeners[eventName] || [])
					.length,
			});
		}

		function wrapMethod(method, params, options) {
			var opts = toObject(options);
			var disableCallbacks = !!opts.disableCallbacks;
			var promise = invoke(method, params, opts);
			return attachLegacyCallbacks(
				promise,
				params,
				disableCallbacks,
			);
		}

		function createRoutingMethod(methodName) {
			return function (options) {
				return wrapMethod(methodName, options, {
					disableCallbacks: true,
				});
			};
		}

		var miniProgram = {
			navigateTo: createRoutingMethod("navigateTo"),
			navigateBack: createRoutingMethod("navigateBack"),
			switchTab: createRoutingMethod("switchTab"),
			reLaunch: createRoutingMethod("reLaunch"),
			redirectTo: createRoutingMethod("redirectTo"),

			postMessage: function (options) {
				return wrapMethod("postMessage", options);
			},
			sendWebviewEvent: function (options) {
				return wrapMethod("sendWebviewEvent", options);
			},
			onWebviewEvent: function (callback) {
				return on("onWebviewEvent", callback);
			},
			offWebviewEvent: function (callback) {
				off("onWebviewEvent", callback);
			},
			getEnv: function (callback) {
				var bridge = bridgeManager.getBridge();
				var miniprogram = !!bridge;
				var result = { miniprogram: miniprogram };
				if (typeof callback === "function") {
					callback(result);
				}
				return Promise.resolve(result);
			},
		};

		var sdk = {
			version: "2.0.0-dev",
			miniProgram: miniProgram,

			getRuntimeInfo: function () {
				return getRuntimeInfo();
			},

			getCapabilities: function (options) {
				var opts = toObject(options);
				var list =
					Array.isArray(opts.jsApiList) &&
					opts.jsApiList.length
						? opts.jsApiList.slice()
						: KNOWN_API_LIST.slice();
				var runtime = getRuntimeInfo();

				if (!runtime.hasBridge) {
					var unsupportedMap = {};
					var details = {};
					for (
						var i = 0;
						i < list.length;
						i += 1
					) {
						unsupportedMap[list[i]] = false;
						details[list[i]] = {
							supported: false,
							reason: "bridge_unavailable",
						};
					}
					return Promise.resolve({
						errMsg: "getCapabilities:ok",
						checkResult: unsupportedMap,
						details: details,
						runtime: runtime,
					});
				}

				return wrapMethod(
					"checkJsApi",
					{ jsApiList: list },
					{
						allowNoBridge: true,
						disableCallbacks: true,
					},
				)
					.then(function (response) {
						var result = toObject(
							response.checkResult,
						);
						var detailMap = {};
						for (
							var i = 0;
							i < list.length;
							i += 1
						) {
							var api = list[i];
							var supported =
								!!result[api];
							detailMap[api] = {
								supported: supported,
								reason: supported
									? "supported"
									: "not_supported_by_client",
							};
						}
						return {
							errMsg: "getCapabilities:ok",
							checkResult: result,
							details: detailMap,
							runtime: runtime,
						};
					})
					.catch(function () {
						var fallback = {};
						var fallbackDetails = {};
						for (
							var i = 0;
							i < list.length;
							i += 1
						) {
							fallback[list[i]] =
								false;
							fallbackDetails[
								list[i]
							] = {
								supported: false,
								reason: "check_js_api_unavailable",
							};
						}
						return {
							errMsg: "getCapabilities:ok",
							checkResult: fallback,
							details: fallbackDetails,
							runtime: runtime,
						};
					});
			},

			isApiSupported: function (apiName) {
				if (!apiName || typeof apiName !== "string") {
					return Promise.reject(
						new LuffaJSSDKError(
							"apiName must be a non-empty string",
							"INVALID_ARGUMENT",
							{
								errMsg: "isApiSupported:fail apiName must be a non-empty string",
							},
						),
					);
				}
				return sdk
					.getCapabilities({
						jsApiList: [apiName],
					})
					.then(function (result) {
						return !!(
							result &&
							result.checkResult &&
							result.checkResult[
								apiName
							]
						);
					});
			},

			setDebug: function (enabled) {
				state.debug = !!enabled;
			},

			ready: function (callback) {
				var promise = bridgeManager
					.whenReady(state.readyTimeout)
					.then(function () {
						if (
							typeof callback ===
							"function"
						) {
							callback();
						}
					});
				return promise;
			},

			config: function (options) {
				var opts = toObject(options);
				if (typeof opts.debug === "boolean") {
					state.debug = opts.debug;
				}
				if (
					typeof opts.readyTimeout === "number" &&
					opts.readyTimeout > 0
				) {
					state.readyTimeout = opts.readyTimeout;
				}
				if (typeof opts.onDiagnostics === "function") {
					state.diagnosticsHook =
						opts.onDiagnostics;
				}
				return sdk;
			},

			checkJsApi: function (options) {
				return wrapMethod("checkJsApi", options, {
					allowNoBridge: true,
				}).catch(function () {
					var opts = toObject(options);
					var list = Array.isArray(opts.jsApiList)
						? opts.jsApiList
						: [];
					var checkResult = {};
					for (
						var i = 0;
						i < list.length;
						i += 1
					) {
						checkResult[list[i]] = false;
					}

					var fallback = {
						errMsg: "checkJsApi:ok",
						checkResult: checkResult,
						__method: "checkJsApi",
						__status: "success",
					};

					if (
						typeof opts.success ===
						"function"
					) {
						opts.success(fallback);
					}
					if (
						typeof opts.complete ===
						"function"
					) {
						opts.complete(fallback);
					}

					return fallback;
				});
			},

			invokeNativePlugin: function (options) {
				var opts = toObject(options);
				if (!opts.api_name) {
					return Promise.reject(
						new LuffaJSSDKError(
							"api_name is required",
							"INVALID_ARGUMENT",
							{
								errMsg: "invokeNativePlugin:fail api_name is required",
							},
						),
					);
				}
				return wrapMethod("invokeNativePlugin", opts);
			},

			canGoBack: function (options) {
				return wrapMethod("canGoBack", options);
			},

			setNavigationBarTitle: function (options) {
				return wrapMethod(
					"setNavigationBarTitle",
					options,
				);
			},

			getStorage: function (options) {
				return wrapMethod("getStorage", options);
			},
			setStorage: function (options) {
				return wrapMethod("setStorage", options);
			},
			removeStorage: function (options) {
				return wrapMethod("removeStorage", options);
			},
			clearStorage: function (options) {
				return wrapMethod("clearStorage", options);
			},
			getStorageInfo: function (options) {
				return wrapMethod("getStorageInfo", options);
			},

			chooseImage: function (options) {
				return wrapMethod("chooseImage", options);
			},
			previewImage: function (options) {
				return wrapMethod("previewImage", options);
			},
			getLocalImgData: function (options) {
				return wrapMethod("getLocalImgData", options);
			},
			startRecord: function (options) {
				return wrapMethod("startRecord", options);
			},
			stopRecord: function (options) {
				return wrapMethod("stopRecord", options);
			},
			playVoice: function (options) {
				return wrapMethod("playVoice", options);
			},
			pauseVoice: function (options) {
				return wrapMethod("pauseVoice", options);
			},
			stopVoice: function (options) {
				return wrapMethod("stopVoice", options);
			},

			getLocation: function (options) {
				return wrapMethod("getLocation", options);
			},
			openLocation: function (options) {
				return wrapMethod("openLocation", options);
			},
			chooseLocation: function (options) {
				return wrapMethod("chooseLocation", options);
			},

			openDocument: function (options) {
				return wrapMethod("openDocument", options);
			},
			scanCode: function (options) {
				return wrapMethod("scanCode", options);
			},
			getNetworkType: function (options) {
				return wrapMethod("getNetworkType", options);
			},

			navigateToMiniProgram: function (options) {
				return wrapMethod(
					"navigateToMiniProgram",
					options,
				);
			},
			navigateBackMiniProgram: function (options) {
				return wrapMethod(
					"navigateBackMiniProgram",
					options,
				);
			},
			exitMiniProgram: function (options) {
				return wrapMethod("exitMiniProgram", options);
			},

			sendWebviewEvent: function (options) {
				return wrapMethod("sendWebviewEvent", options);
			},
			onWebviewEvent: function (callback) {
				return on("onWebviewEvent", callback);
			},
			offWebviewEvent: function (callback) {
				off("onWebviewEvent", callback);
			},

			invoke: function (method, options) {
				if (!method || typeof method !== "string") {
					return Promise.reject(
						new LuffaJSSDKError(
							"method must be a non-empty string",
							"INVALID_ARGUMENT",
							{
								errMsg: "sdk:fail method must be a non-empty string",
							},
						),
					);
				}

				var disableCallbacks =
					!!ROUTING_METHODS[method];
				return wrapMethod(method, options, {
					disableCallbacks: disableCallbacks,
				});
			},

			create: function (options) {
				return createLuffaJSSDK(options);
			},

			LuffaJSSDKError: LuffaJSSDKError,
		};

		sdk.miniProgram.postMessage =
			sdk.miniProgram.postMessage || miniProgram.postMessage;
		sdk.miniProgram.sendWebviewEvent =
			sdk.miniProgram.sendWebviewEvent ||
			miniProgram.sendWebviewEvent;
		sdk.miniProgram.onWebviewEvent =
			sdk.miniProgram.onWebviewEvent ||
			miniProgram.onWebviewEvent;
		sdk.miniProgram.offWebviewEvent =
			sdk.miniProgram.offWebviewEvent ||
			miniProgram.offWebviewEvent;

		return sdk;
	}

	return createLuffaJSSDK();
});
