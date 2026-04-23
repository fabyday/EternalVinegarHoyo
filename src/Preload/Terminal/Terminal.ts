import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    sendToPty: (data: string) => ipcRenderer.send('terminal-keystroke', data),
    onPtyData: (callback: (data: string) => void) =>
        ipcRenderer.on('terminal-incoming-data', (_event, data) => callback(data)),
});