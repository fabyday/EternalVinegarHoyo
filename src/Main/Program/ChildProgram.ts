import { spawn, ChildProcess } from "child_process";
interface ParamRunProgramArgument {
    command: string;
    args?: string[];
    cwd?: string;
    // 환경 변수를 Key-Value 쌍으로 받을 수 있게 추가
    env?: Record<string, string>;
    onLog?: (data: string) => void;
    onError?: (data: string) => void;
}

interface ParamRunProgramReturn {
    Stop: () => Promise<void>;
    done: Promise<number>; // Exit Code
}

/**
 * run ShellCode or Programs
 */
export function runProgram(param: ParamRunProgramArgument): ParamRunProgramReturn {

    const combinedEnv = {
        ...process.env,      // 기존 환경 변수 유지 (중요!)
        ...param.env         // 사용자 정의 변수로 덮어쓰기 또는 추가
    };
    // 1. 프로세스 실행
    const child: ChildProcess = spawn(param.command, param.args || [], {
        cwd: param.cwd,
        env: combinedEnv,    // 합쳐진 환경 변수 적용
        shell: false,
    });

    // 2. 로그 핸들링
    child.stdout?.on("data", (data: Buffer) => {
        param.onLog?.(data.toString());
    });

    child.stderr?.on("data", (data: Buffer) => {
        // stderr가 항상 에러는 아님 (curl의 진행률도 stderr로 나옴)
        param.onError?.(data.toString());
    });

    // 3. 완료 처리 (Promise)
    const done = new Promise<number>((resolve, reject) => {
        child.on("close", (code) => {
            resolve(code ?? -1);
        });
        child.on("error", (err) => {
            reject(err);
        });
    });
    return {
        done: new Promise((resolve, reject) => {
            child.on("close", (code) => resolve(code ?? -1));
            child.on("error", (err) => reject(err));
        }),
        // src/Main/Program/ChildProgram.ts 수정
        Stop: async () => {
            if (child.pid && !child.killed) {
                try {
                    // 그룹이 살아있는지 확인 후 kill
                    process.kill(-child.pid, "SIGKILL");
                } catch (e: any) {
                    // ESRCH 에러는 이미 프로세스가 종료된 것이므로 무시해도 됩니다.
                    if (e.code !== 'ESRCH') {
                        console.error("Failed to kill process group:", e);
                    }
                }

                // 프로세스가 완전히 빠져나갈 때까지 대기
                return new Promise((resolve) => {
                    if (child.killed) return resolve();
                    child.on("exit", () => resolve());
                    // 혹시 모르니 1초 뒤 강제 resolve (Test hanging 방지)
                    setTimeout(resolve, 1000);
                });
            }
        }
    };
}