import { ipcManager } from "../Manager/IPCManager";

export async function initHandler(): Promise<void> {
  ipcManager.init();
}
