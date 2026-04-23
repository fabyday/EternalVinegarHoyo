// src/shared/types/wine.ts

export type InstallStatus = 'idle' | 'downloading' | 'extracting' | 'installed' | 'error';

export type WineType = 'official' | 'custom';



export interface WineVersion {
  id: string;
  name: string;      // 예: "Wine 9.0", "Proton 8.0-GE-1"
  version: string;
  status: InstallStatus;
  path?: string;     // 설치된 경로
  progress: number;  // 0 ~ 100
  type: WineType;    // 'official' 또는 'custom'
}


export interface WineError {
  code: string;
  message: string;
}