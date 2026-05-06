export type IpcDirection =
  | "RENDERER_TO_MAIN"
  | "MAIN_TO_RENDERER"
  | "BIDIRECTIONAL";
export type MethodType = "invoke" | "on" | "once" | "send";

export interface IpcChannelUnit<P = any> {
  readonly channelName: string; // 채널명
  readonly direction: IpcDirection; // 방향성 추가
  readonly method: MethodType;
  readonly payload: P; // 페이로드 타입 (추출용)
}
export interface WineInstallPayload {
  versionId: string;
  installPath: string;
}
// WINE 섹션
export interface WineChannelSchema {
  readonly INSTALL: IpcChannelUnit<WineInstallPayload>;
  readonly STATUS_UPDATE: IpcChannelUnit<WineStatusPayload>;
  readonly GET_VERSION_LIST: IpcChannelUnit<void>;
}

type WineStatus =
  | "installed"
  | "downloading"
  | "installing"
  | "extracting"
  | "completed"
  | "error";

export interface WineStatusPayload {
  versionId: string;
  status: WineStatus;
  progress: number;
  message?: string;
}

///

// APP 섹션 전체의 규격
export interface AppChannelSchema {
  readonly QUIT: IpcChannelUnit<void>;
  readonly RESTART: IpcChannelUnit<void>;
  readonly UPDATE: IpcChannelUnit<void>;
}

// 2. 요청/응답 페이로드 타입
export interface InstallRequest {
  versionId: string;
  installPath: string;
}

export interface StatusUpdatePayload {
  versionId: string;
  status: WineStatus;
  progress: number;
  message?: string;
}

////////////////////////////////////////////////////////
//                  LITERAL TYPE DEFINITION           //
////////////////////////////////////////////////////////

// 1. 채널명 정의 (String Enum 또는 상수 객체)
export const WINE = {
  INSTALL: {
    channelName: "wine:install",
    direction: "RENDERER_TO_MAIN",
    method: "invoke",
    payload: {} as WineInstallPayload,
  },
  STATUS_UPDATE: {
    channelName: "wine:status-update",
    method: "on",
    direction: "MAIN_TO_RENDERER",
    payload: {} as WineStatusPayload,
  },
  GET_VERSION_LIST: {
    channelName: "wine:get-list",
    method: "invoke",
    direction: "MAIN_TO_RENDERER",
    payload: {} as never,
  },
} as const;

export const APP = {
  QUIT: {
    channelName: "app:quit",
    method: "send",
    direction: "RENDERER_TO_MAIN",
    payload: {} as never,
  },
  RESTART: {
    channelName: "app:restart",
    direction: "RENDERER_TO_MAIN",
    method: "send",
    payload: {} as never,
  },
  UPDATE: {
    channelName: "app:update",
    direction: "RENDERER_TO_MAIN",
    method: "send",
    payload: {} as never,
  },
} as const;

export const IPC_CHANNELS = {
  WINE,
  APP,
} as const;

//
type AllDomains = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];

// Flatten complicated Nested Union Types like ... {A} | {B} to  A | B
// I Used Function argument Inference
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type DomainUnionKeyType = UnionToIntersection<AllDomains>;
type AnyDomainUint = DomainUnionKeyType extends any
  ? DomainUnionKeyType[keyof DomainUnionKeyType]
  : never;

type FindChannelNameByMethodType<M extends MethodType> = {
  [K in keyof DomainUnionKeyType]: DomainUnionKeyType[K] extends { method: M }
    ? DomainUnionKeyType[K]["channelName"]
    : never;
}[keyof DomainUnionKeyType];

/**
 * Alias Helper Types
 */
export type InvokeChannelNames = FindChannelNameByMethodType<"invoke">;
export type SendChannelNames = FindChannelNameByMethodType<"send">;
export type OnChannelNames = FindChannelNameByMethodType<"on">;

type FindChannelInfoByName<C extends string> = Extract<
  AnyDomainUint,
  { channelName: C }
>;

export type PayloadOf<T extends string> =
  FindChannelInfoByName<T> extends { payload: infer P } ? P : never;

// GOod GoOd GoOd GooD
// type isnstallCommandTest = PayloadOf<"wine:install">;
