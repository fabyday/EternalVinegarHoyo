// pnpm add node-pty 설치 필요
import * as pty from 'node-pty';
import { ipcMain } from 'electron';



export function setupTerminal(mainWindow: Electron.BrowserWindow) {

    const shell = 'bash';

    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env,
    });

    ptyProcess.onData((data) => {
        mainWindow.webContents.send('terminal-incoming-data', data);
    });

    // 렌더러에서 온 입력을 PTY에 쓰기
    ipcMain.on('terminal-keystroke', (event, data) => {
        ptyProcess.write(data);
    });
}









