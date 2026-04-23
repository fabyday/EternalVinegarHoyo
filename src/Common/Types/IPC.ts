type IpcDirection = 'RENDERER_TO_MAIN' | 'MAIN_TO_RENDERER' | 'BIDIRECTIONAL';
type MethodType = "invoke" | "on" | "once" | "send" ;


export interface IpcChannelUnit<P = any> {
    readonly channelName: string;   // 채널명
    readonly direction: IpcDirection; // 방향성 추가
    readonly method : MethodType;
    readonly payload: P;      // 페이로드 타입 (추출용)
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


type WineStatus = 'installed' | 'downloading' | 'installing' | 'extracting' | 'completed' | 'error';



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

