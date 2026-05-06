import { BTIH_API } from "./preload"; // preload 파일 경로

declare global {
    interface Window {
        /**
         * BTIH API - Electron IPC Bridge
         */
        readonly BTIH_API: BTIH_API;
    }
}

export { };