import { app, BrowserWindow } from 'electron';
import path from 'path';

// 전역 변수로 선언하여 가비지 컬렉션으로부터 보호합니다.
let mainWindow: BrowserWindow | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: '#0d1117', // 하얀 화면 깜빡임 방지
        webPreferences: {
            // 빌드된 main.js 위치 기준으로 preload.js 경로 설정
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    const isDev = process.env.NODE_ENV === 'development';


    const htmlPath = path.join(__dirname, '../renderer/View/TerminalView.html');
    mainWindow.loadFile(htmlPath).catch(err => {
        console.error('HTML 파일을 로드할 수 없습니다:', err);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 핵심: 앱이 준비되었을 때만 실행
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // macOS에서 독 아이콘을 클릭했을 때 창이 없으면 다시 생성
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// 모든 창이 닫혔을 때 앱 종료 (macOS 제외)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});