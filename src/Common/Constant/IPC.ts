import { AppChannelSchema, WineChannelSchema, WineInstallPayload, WineStatusPayload } from "../Types/IPC";

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
} satisfies WineChannelSchema;



export const APP = {
    QUIT: {
        channelName: 'app:quit',
        method: 'send',
        direction: 'RENDERER_TO_MAIN',
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
    }
} satisfies AppChannelSchema;

export const IPC_CHANNELS = {
    WINE,
    APP
} as const;

// type AllDomains = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];


// export type InvokeChannelNames = {
//     [K in keyof AllDomains]: AllDomains extends { method: "invoke" } ?
//     AllDomains[K]["channelName"] : never;

// };

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
