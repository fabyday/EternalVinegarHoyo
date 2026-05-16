# IPC Notes

IPC는 `IPCManager`로 통합하는 방향으로 정리했다. 목적은 `System/Handler.ts`가 개별 handler를 직접 계속 늘려가지 않게 하고, Main Manager들의 public action을 한곳에서 Renderer에 노출하는 것이다.

## 주요 파일

| File | 역할 |
| --- | --- |
| `src/Main/Manager/IPCManager.ts` | IPC handler 등록 진입점 |
| `src/Main/System/Handler.ts` | 기존 handler 진입점을 `IPCManager`로 위임 |
| `src/Main/System/AppIPC.ts` | 앱/update/terminal 관련 IPC 진입점 |
| `src/Main/System/WineIPC.ts` | Wine catalog/install 관련 IPC 진입점 |
| `src/Preload/preload.ts` | Renderer에 안전하게 API expose |
| `src/Preload/preload.d.ts` | Renderer에서 사용할 preload API 타입 |
| `src/Common/Constant/IPC.ts` | IPC channel 상수 |
| `src/Common/Types/IPC.ts` | IPC payload/response 타입 |

## 방향

- Renderer는 `ipcRenderer`를 직접 import하지 않는다.
- Preload가 expose한 API만 Renderer Store/App container에서 호출한다.
- View 컴포넌트는 가능하면 IPC를 모르고 props로 데이터와 action을 받는다.
- IPC channel 이름은 `Common/Constant/IPC.ts`에 모아둔다.

## 아직 비어 있거나 mock에 가까운 부분

- Terminal IPC는 아직 실제 `node-pty` 연결 전 단계다.
- LogViewer는 UI가 먼저 만들어졌고, 파일 로그를 읽는 IPC는 아직 필요하다.
- PreferenceView는 화면과 Storybook 상태가 먼저 정리되었고, 실제 저장 IPC 연결은 다음 단계다.

## 다음 작업 후보

- `terminal:start/input/output/resize/stop` channel 추가.
- `log:listSessions/read/tail` channel 추가.
- `preference:get/update/reset` channel을 PreferenceView와 연결.
