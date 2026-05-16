import { BrowserWindow } from "electron";
import { updateManager } from "../Manager/UpdateManager";

export function initAppIPC(mainWindow?: BrowserWindow): void {
  initDefaultIPC();
  initTerminalIPC();
  initAppUpdaterIPC(mainWindow);
}

function initDefaultIPC(): void {}

function initTerminalIPC(): void {}

function initAppUpdaterIPC(mainWindow?: BrowserWindow): void {
  updateManager.init(mainWindow);
}
