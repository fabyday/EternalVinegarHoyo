# Common Types And IPC

`src/Common`은 Main, Preload, Renderer가 함께 보는 계약을 두는 위치다.

## 역할

| Directory/File | 역할 |
| --- | --- |
| `src/Common/Constant/IPC.ts` | IPC channel 이름 |
| `src/Common/Constant/WineCatalog.ts` | 기본 Wine catalog / predefined Wine data |
| `src/Common/Types/IPC.ts` | IPC request/response 타입 |
| `src/Common/Types/Wine.ts` | Wine version/status 타입 |

## 방향

- IPC channel 문자열은 가능한 `Common/Constant/IPC.ts`에서만 정의한다.
- Renderer와 Main이 공유해야 하는 payload는 `Common/Types`에 둔다.
- Electron main 전용 타입이나 Node API는 `Common`으로 올리지 않는다.

## Wine 타입

Wine 관련 UI와 Manager가 같은 status/type을 공유하기 위해 `Wine.ts`를 사용한다.

Renderer에서 사용하는 대표 컴포넌트:

- `WineVersionCard`
- `InstalledWinePanel`
- `DashboardView`

Main에서 사용하는 대표 Manager:

- `WineManager`
- `DownloadManager`

## 다음 작업 후보

- log session/read 타입 추가.
- preference schema 타입 추가.
- terminal IPC payload 타입 추가.
