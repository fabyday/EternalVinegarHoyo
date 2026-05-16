import { app } from "electron";
import { ipcManager } from "./Manager/IPCManager";
import { logManager } from "./Manager/LogManager";
import { preferenceManager } from "./Manager/PreferenceManager";
import { shortcutManager } from "./Manager/ShortcutManager";
import { updateManager } from "./Manager/UpdateManager";
import { windowManager } from "./Manager/WindowManager";

logManager.init();

async function createApp(): Promise<void> {
  ipcManager.init();

  const mainWindow = await windowManager.createMainWindow();
  const preference = await preferenceManager.getPreference();

  if (preference.autoCheckUpdates) {
    void updateManager.checkForUpdatesAndNotify(mainWindow);
  }
}

app.whenReady().then(async () => {
  await createApp();

  app.on("activate", () => {
    if (!windowManager.getMainWindow()) {
      void createApp();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  shortcutManager.unregisterAll();
});
