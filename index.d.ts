export type CallbackPayload = Record<string, unknown> & {
    errMsg?: string;
    __method?: string;
    __status?: "success" | "cancel" | "fail";
};

export interface CallbackOptions<T extends CallbackPayload = CallbackPayload> {
    success?: (res: T) => void;
    fail?: (err: CallbackPayload) => void;
    cancel?: (res: CallbackPayload) => void;
    complete?: (res: CallbackPayload) => void;
    [key: string]: unknown;
}

export interface RuntimeInfo {
    hasBridge: boolean;
    bridgeName: string | null;
    bridgeCandidates: string[];
    readyEvents: string[];
    isMiniProgramUA: boolean;
    userAgent: string;
}

export interface CapabilityDetail {
    supported: boolean;
    reason: "supported" | "not_supported_by_client" | "bridge_unavailable" | "check_js_api_unavailable";
}

export interface CapabilitiesResult {
    errMsg: string;
    checkResult: Record<string, boolean>;
    details: Record<string, CapabilityDetail>;
    runtime: RuntimeInfo;
}

export interface ConfigOptions {
    debug?: boolean;
    readyTimeout?: number;
    onDiagnostics?: (event: {
        event: string;
        timestamp: number;
        payload: unknown;
    }) => void;
    bridgeCandidates?: string[];
}

export interface MiniProgramAPI {
    navigateTo(options?: CallbackOptions): Promise<CallbackPayload>;
    navigateBack(options?: CallbackOptions): Promise<CallbackPayload>;
    switchTab(options?: CallbackOptions): Promise<CallbackPayload>;
    reLaunch(options?: CallbackOptions): Promise<CallbackPayload>;
    redirectTo(options?: CallbackOptions): Promise<CallbackPayload>;
    postMessage(options?: CallbackOptions): Promise<CallbackPayload>;
    sendWebviewEvent(options?: CallbackOptions): Promise<CallbackPayload>;
    onWebviewEvent(callback: (payload: CallbackPayload) => void): () => void;
    offWebviewEvent(callback?: (payload: CallbackPayload) => void): void;
    getEnv(callback?: (res: { miniprogram: boolean }) => void): Promise<{ miniprogram: boolean }>;
}

export interface LuffaJSSDK {
    version: string;
    miniProgram: MiniProgramAPI;
    LuffaJSSDKError: new (message: string, code?: string, context?: Record<string, unknown>) => Error;
    config(options?: ConfigOptions): LuffaJSSDK;
    ready(callback?: () => void): Promise<void>;
    setDebug(enabled: boolean): void;

    getRuntimeInfo(): RuntimeInfo;
    getCapabilities(options?: { jsApiList?: string[] }): Promise<CapabilitiesResult>;
    isApiSupported(apiName: string): Promise<boolean>;

    checkJsApi(options?: CallbackOptions<{ errMsg?: string; checkResult?: Record<string, boolean> }>): Promise<CallbackPayload>;
    invokeNativePlugin(options?: CallbackOptions & { api_name?: string }): Promise<CallbackPayload>;
    canGoBack(options?: CallbackOptions): Promise<CallbackPayload>;
    setNavigationBarTitle(options?: CallbackOptions): Promise<CallbackPayload>;

    getStorage(options?: CallbackOptions): Promise<CallbackPayload>;
    setStorage(options?: CallbackOptions): Promise<CallbackPayload>;
    removeStorage(options?: CallbackOptions): Promise<CallbackPayload>;
    clearStorage(options?: CallbackOptions): Promise<CallbackPayload>;
    getStorageInfo(options?: CallbackOptions): Promise<CallbackPayload>;

    chooseImage(options?: CallbackOptions): Promise<CallbackPayload>;
    previewImage(options?: CallbackOptions): Promise<CallbackPayload>;
    getLocalImgData(options?: CallbackOptions): Promise<CallbackPayload>;
    startRecord(options?: CallbackOptions): Promise<CallbackPayload>;
    stopRecord(options?: CallbackOptions): Promise<CallbackPayload>;
    playVoice(options?: CallbackOptions): Promise<CallbackPayload>;
    pauseVoice(options?: CallbackOptions): Promise<CallbackPayload>;
    stopVoice(options?: CallbackOptions): Promise<CallbackPayload>;

    getLocation(options?: CallbackOptions): Promise<CallbackPayload>;
    openLocation(options?: CallbackOptions): Promise<CallbackPayload>;
    chooseLocation(options?: CallbackOptions): Promise<CallbackPayload>;

    openDocument(options?: CallbackOptions): Promise<CallbackPayload>;
    scanCode(options?: CallbackOptions): Promise<CallbackPayload>;
    getNetworkType(options?: CallbackOptions): Promise<CallbackPayload>;

    navigateToMiniProgram(options?: CallbackOptions): Promise<CallbackPayload>;
    navigateBackMiniProgram(options?: CallbackOptions): Promise<CallbackPayload>;
    exitMiniProgram(options?: CallbackOptions): Promise<CallbackPayload>;

    sendWebviewEvent(options?: CallbackOptions): Promise<CallbackPayload>;
    onWebviewEvent(callback: (payload: CallbackPayload) => void): () => void;
    offWebviewEvent(callback?: (payload: CallbackPayload) => void): void;

    invoke(method: string, options?: CallbackOptions): Promise<CallbackPayload>;
    create(options?: ConfigOptions): LuffaJSSDK;
}

declare const sdk: LuffaJSSDK;
export default sdk;
export const wx: LuffaJSSDK;
