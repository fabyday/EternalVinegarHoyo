# Codex Notes

지금까지 추가하거나 크게 정리한 코드의 작업 메모를 기능 단위로 나눈 문서이다.

## 문서 목록

| Path | 내용 |
| --- | --- |
| `.codex/Main/managers.md` | Main process Manager 구조, 초기화 순서, 각 Manager 역할 |
| `.codex/Main/logging.md` | LogManager 전략, app/wine 로그 분리, 메모리/파일 로그 방향 |
| `.codex/Main/ipc.md` | IPCManager, AppIPC, WineIPC, preload 연결 방향 |
| `.codex/Renderer/views.md` | MainView, PreferenceView, SplashView, TerminalView 구성 |
| `.codex/Renderer/components.md` | Renderer 공용 컴포넌트 역할 |
| `.codex/Renderer/storybook.md` | Storybook에서 확인할 수 있는 주요 스토리와 의도 |
| `.codex/Build/package-and-screenshot.md` | electron-builder, screenshot 명령, 출력 위치 |

## 큰 방향

- Main process는 기능별 Manager가 책임을 갖고, `Main.ts`는 초기화 순서와 생명주기 연결만 담당한다.
- Renderer는 View와 Component를 분리하고, 실제 Electron/IPC 연결은 가능한 App container 또는 Store 쪽으로 밀어둔다.
- Storybook은 실제 로직 연결 전 UI와 상호작용 상태를 확인하는 용도로 사용한다.
- 로그는 화면 표시용 메모리와 영구 보관용 파일을 분리해서 생각한다.
