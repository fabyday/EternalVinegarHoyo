import { app, BrowserWindow, ipcMain } from "electron";
import { IPC_CHANNELS, InstallRequest, LauncherPreferencePatch } from "../../Common/Types/IPC";
import { preferenceManager, PreferenceManager } from "./PreferenceManager";
import { updateManager, UpdateManager } from "./UpdateManager";
import { windowManager, WindowManager } from "./WindowManager";
import { wineManager, WineManager } from "./WineManager";
import { youtubeManager, YouTubeManager } from "./YouTubeManager";

export class IPCManager {
  private initialized = false;

  constructor(
    private readonly windows: WindowManager,
    private readonly wines: WineManager,
    private readonly updates: UpdateManager,
    private readonly preferences: PreferenceManager,
    private readonly youtube: YouTubeManager,
  ) {}

  init(): void {
    if (this.initialized) {
      return;
    }

    this.initWineIPC();
    this.initAppIPC();
    this.initPreferenceIPC();
    this.initYouTubeIPC();
    this.initialized = true;
  }

  private initWineIPC(): void {
    ipcMain.removeHandler(IPC_CHANNELS.WINE.GET_VERSION_LIST.channelName);
    ipcMain.handle(IPC_CHANNELS.WINE.GET_VERSION_LIST.channelName, async () => {
      return this.wines.getVersionList();
    });

    ipcMain.removeHandler(IPC_CHANNELS.WINE.INSTALL.channelName);
    ipcMain.handle(
      IPC_CHANNELS.WINE.INSTALL.channelName,
      async (event, request: InstallRequest) => {
        await this.wines.installWine(request, event.sender);
      },
    );
  }

  private initAppIPC(): void {
    this.onAppEvent(IPC_CHANNELS.APP.QUIT.channelName, () => {
      app.quit();
    });

    this.onAppEvent(IPC_CHANNELS.APP.MINIMIZE.channelName, (event) => {
      const window = BrowserWindow.fromWebContents(event.sender);
      window?.minimize();
    });

    this.onAppEvent(IPC_CHANNELS.APP.MAXIMIZE.channelName, (event) => {
      const window =
        BrowserWindow.fromWebContents(event.sender) ?? this.windows.getMainWindow();

      if (!window) {
        return;
      }

      if (window.isMaximized()) {
        window.unmaximize();
        return;
      }

      window.maximize();
    });

    this.onAppEvent(IPC_CHANNELS.APP.RESTART.channelName, () => {
      app.relaunch();
      app.exit(0);
    });

    this.onAppEvent(IPC_CHANNELS.APP.UPDATE.channelName, async (event) => {
      const window =
        BrowserWindow.fromWebContents(event.sender) ?? this.windows.getMainWindow();
      await this.updates.checkForUpdatesAndNotify(window ?? undefined);
    });
  }

  private initPreferenceIPC(): void {
    ipcMain.removeHandler(IPC_CHANNELS.APP.GET_PREFERENCE.channelName);
    ipcMain.handle(IPC_CHANNELS.APP.GET_PREFERENCE.channelName, async () => {
      return this.preferences.getPreference();
    });

    ipcMain.removeHandler(IPC_CHANNELS.APP.UPDATE_PREFERENCE.channelName);
    ipcMain.handle(
      IPC_CHANNELS.APP.UPDATE_PREFERENCE.channelName,
      async (_event, patch: LauncherPreferencePatch) => {
        return this.preferences.updatePreference(patch);
      },
    );
  }

  private initYouTubeIPC(): void {
    ipcMain.removeHandler(IPC_CHANNELS.YOUTUBE.GET_LIVE_STATUS.channelName);
    ipcMain.handle(
      IPC_CHANNELS.YOUTUBE.GET_LIVE_STATUS.channelName,
      async (_event, request) => {
        return this.youtube.getLiveStatus(request);
      },
    );
  }

  private onAppEvent(
    channel: string,
    listener: Parameters<typeof ipcMain.on>[1],
  ): void {
    ipcMain.removeAllListeners(channel);
    ipcMain.on(channel, listener);
  }
}

export const ipcManager = new IPCManager(
  windowManager,
  wineManager,
  updateManager,
  preferenceManager,
  youtubeManager,
);
