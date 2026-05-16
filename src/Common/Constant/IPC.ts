import {
    AppChannelSchema,
    AppUpdateStatusPayload,
    LauncherPreferencePatch,
    WineChannelSchema,
    WineInstallPayload,
    WineStatusPayload,
    YouTubeLiveStatusRequest,
} from "../Types/IPC";

// 1. 채널명 정의 (String Enum 또는 상수 객체)
export const WINE = {
    INSTALL: {
        channelName: 'wine:install',
        direction: 'RENDERER_TO_MAIN',
        method: 'invoke',
        payload: {
        } as WineInstallPayload
    },
    STATUS_UPDATE: {
        channelName: 'wine:status-update',
        method: 'on',
        direction: 'MAIN_TO_RENDERER',
        payload: {} as WineStatusPayload
    },
    GET_VERSION_LIST: {
        channelName: 'wine:get-list',
        method: 'invoke',
        direction: 'MAIN_TO_RENDERER',
        payload: {} as never
    }
} as const;

type S = typeof WINE;

export const APP = {
    QUIT: {
        channelName: 'app:quit',
        method: 'send',
        direction: 'RENDERER_TO_MAIN',
        payload: {} as never
    },
    MINIMIZE: {
        channelName: 'app:minimize',
        direction: 'RENDERER_TO_MAIN',
        method: 'send',
        payload: {} as never
    },
    MAXIMIZE: {
        channelName: 'app:maximize',
        direction: 'RENDERER_TO_MAIN',
        method: 'send',
        payload: {} as never
    },
    RESTART: {
        channelName: 'app:restart',
        direction: 'RENDERER_TO_MAIN',
        method: 'send',
        payload: {} as never
    },
    UPDATE: {
        channelName: 'app:update',
        direction: 'RENDERER_TO_MAIN',
        method: 'send',
        payload: {} as never
    },
    UPDATE_STATUS: {
        channelName: 'app:update-status',
        direction: 'MAIN_TO_RENDERER',
        method: 'on',
        payload: {} as AppUpdateStatusPayload
    },
    GET_PREFERENCE: {
        channelName: 'app:get-preference',
        direction: 'RENDERER_TO_MAIN',
        method: 'invoke',
        payload: {} as never
    },
    UPDATE_PREFERENCE: {
        channelName: 'app:update-preference',
        direction: 'RENDERER_TO_MAIN',
        method: 'invoke',
        payload: {} as LauncherPreferencePatch
    }
} as const;

export const YOUTUBE = {
    GET_LIVE_STATUS: {
        channelName: 'youtube:get-live-status',
        direction: 'RENDERER_TO_MAIN',
        method: 'invoke',
        payload: {} as YouTubeLiveStatusRequest
    }
} as const;

export const IPC_CHANNELS = {
    WINE,
    APP,
    YOUTUBE
} as const;



//
type AllDomains = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];


type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends
    ((k: infer I) => void) ? I : never;

type QQS = UnionToIntersection<AllDomains>



export type InvokeChannelNames = {
    [K in keyof QQS]: QQS[K] extends { method: "invoke" } ?
    QQS[K]["channelName"] : never;

}[keyof QQS];


// export type SendChannelNames = {
//     [K in keyof AllDomains]: AllDomains[K] extends { method: "send" } ?
//     AllDomains[K]["channelName"] : never;
// };

// export type OnChannelNames = {
//     [K in keyof AllDomains]: AllDomains[K] extends { method: "on" } ?
//     AllDomains[K]["channelName"] : never;
// };


// type AnyUnit = AllDomains extends any ? AllDomains[keyof AllDomains] : never;

// type FindUnit<C extends string> = Extract<AnyUnit, { channelName: C }>;


// export type PayloadOf<T extends string> =
//     FindUnit<T> extends { 'payload': infer P } ? P : never;
