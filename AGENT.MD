# Agent Guide

이 저장소에서 작업하기 전에 `.codex` 아래 문서를 먼저 확인한다.

## Codex Notes

| Path | 내용 |
| --- | --- |
| `.codex/README.md` | 지금까지 정리한 문서 index |
| `.codex/name-convention.md` | 파일/타입/함수/변수 naming convention |
| `.codex/Main/dir.md` | Main directory/file 목록 |
| `.codex/Main/managers.md` | Main process Manager 구조와 초기화 순서 |
| `.codex/Main/logging.md` | LogManager, app/wine 로그 분리, 파일 로그 전략 |
| `.codex/Main/ipc.md` | IPCManager, AppIPC, WineIPC, preload 연결 방향 |
| `.codex/Common/types-and-ipc.md` | Common type과 IPC channel 계약 |
| `.codex/Renderer/dir.md` | Renderer directory guide |
| `.codex/Renderer/views.md` | MainView, PreferenceView, SplashView, TerminalView 정리 |
| `.codex/Renderer/components.md` | Renderer 공용 컴포넌트 정리 |
| `.codex/Renderer/storybook.md` | Storybook story 구성과 검증 방식 |
| `.codex/Build/package-and-screenshot.md` | electron-builder와 screenshot 명령 정리 |

## Working Notes

- Main process 작업은 `.codex/Main/managers.md`, `.codex/Main/ipc.md`, `.codex/Main/logging.md`를 먼저 본다.
- Renderer UI 작업은 `.codex/Renderer/views.md`, `.codex/Renderer/components.md`, `.codex/Renderer/storybook.md`를 먼저 본다.
- 패키징, screenshot, electron-builder 관련 작업은 `.codex/Build/package-and-screenshot.md`를 먼저 본다.
- IPC payload나 공유 타입을 추가할 때는 `.codex/Common/types-and-ipc.md`를 확인한다.
