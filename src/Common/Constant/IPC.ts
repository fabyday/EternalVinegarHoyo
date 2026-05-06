import { AppChannelSchema, WineChannelSchema, WineInstallPayload, WineStatusPayload } from "../Types/IPC";



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
