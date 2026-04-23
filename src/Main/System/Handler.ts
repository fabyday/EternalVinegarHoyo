import { app, ipcMain } from "electron/main";
import { InstallRequest } from "../../Common/Types/IPC";

import { IPC_CHANNELS } from "../../Common/Constant/IPC"

/**
 * Renderer Main 브릿지 초기화
 */
export async function initHandler() {
    // 여기에 IPC 핸들러 등록

    await initAppIPC();
}

async function initWineIPC() {
    IPC
    ipcMain.handle(IPC_CHANNELS.WINE.GET_VERSION_LIST.channelName, async (event: Electron.IpcMainInvokeEvent) => {
        // 와인 버전 목록을 가져오는 로직
        return [];
    });

    ipcMain.handle(IPC_CHANNELS.WINE.INSTALL.channelName, async (event: Electron.IpcMainInvokeEvent, request: InstallRequest) => {
        // 와인 설치 로직
        return;
    });


    ipcMain.on(IPC_CHANNELS.WINE.STATUS_UPDATE.channelName, (event: Electron.IpcMainEvent, payload) => {
        // 와인 설치 상태 업데이트 로직
    });




}


async function initAppIPC() {
    ipcMain.on(IPC_CHANNELS.APP.APP_QUIT.channelName, () => {
        // TODO: 앱 종료 로직: 앱 종료 전에 필요한 정리 작업이 있다면 여기에 추가
        app.quit();
    });
}