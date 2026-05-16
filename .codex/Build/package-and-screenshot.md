# Package And Screenshot

패키징과 screenshot 자동화를 위해 `package.json`, `electron-builder`, Storybook screenshot script를 추가했다.

## package scripts

`package.json` 주요 script:

```json
{
  "pack": "pnpm build && electron-builder --dir",
  "dist": "pnpm build && electron-builder",
  "screenshot": "pnpm build-storybook && node scripts/capture-storybook-screenshot.mjs"
}
```

| Script | 역할 |
| --- | --- |
| `pack` | 앱을 빌드하고 unpacked app 디렉토리를 생성 |
| `dist` | 앱을 빌드하고 배포 artifact 생성 |
| `screenshot` | Storybook 정적 빌드 후 launcher screenshot 저장 |

## electron-builder

`electron-builder`와 `electron-updater`를 추가했다.

설정 방향:

- `appId`, `productName`, output directory를 `package.json`의 `build` 필드에 둔다.
- mac/win/linux target을 electron-builder 기준으로 관리한다.
- update 관련 동작은 `UpdateManager`가 담당한다.

Windows에서는 native dependency가 있으면 rebuild 도구chain이 필요할 수 있다. `node-pty`를 실제로 추가하면 Windows 빌드 환경에서 Visual Studio Build Tools 관련 요구사항을 별도로 확인해야 한다.

## screenshot 명령

파일:

- `scripts/capture-storybook-screenshot.mjs`

동작:

1. `pnpm build-storybook`으로 `storybook-static`을 만든다.
2. headless Chrome/Edge를 찾아 실행한다.
3. `View/MainView/MainView`의 launcher shell story를 연다.
4. screenshot을 저장한다.

출력:

```text
output/screenshot/launcher-view.png
```

명령:

```bash
pnpm screenshot
```

## 주의

- 이 screenshot은 Storybook static build 기준이다.
- Electron runtime의 실제 window chrome, preload 연결, IPC 결과까지 포함하는 screenshot은 아니다.
- Storybook story id가 바뀌면 `capture-storybook-screenshot.mjs`의 target URL도 같이 바꿔야 한다.
