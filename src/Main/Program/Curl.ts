import { spawn } from "child_process";

interface CurlCallback {
    onStart: () => void;
    onProgress: (progress: number) => void; // total은 curl -#에서 계산하기 번거로우므로 퍼센트 위주
    onError: (error: Error) => void;
    onEnd: (success: boolean) => void;
}

interface CurlArgs {
    outputDir?: string;
    fileName?: string; // 파일명 지정 추천
    otherArgs?: string[]; // 문자열보다 배열이 안전함
}

interface CurlReturn {
    StopCurl: () => Promise<void>;

};


export function downloadByCurl(url: string, args: CurlArgs, progressCallback: CurlCallback): CurlReturn {
    // 1. 인자 구성
    const curlArgs = ["-L", url, "-#"]; // -#은 진행률 파싱을 위해 필수

    if (args.outputDir) {
        // macOS curl은 --create-dirs와 --output-dir을 지원함
        curlArgs.push("--create-dirs", "--output-dir", args.outputDir);
    }

    if (args.fileName) {
        curlArgs.push("-o", args.fileName);
    }

    if (args.otherArgs) {
        curlArgs.push(...args.otherArgs);
    }

    progressCallback.onStart();

    // 2. 실행 (shell: false 권장)
    const curl = spawn("curl", curlArgs);

    // 3. 진행률 파싱 (curl -#은 stderr로 진행 상황을 보냄)
    curl.stderr.on("data", (data: Buffer) => {
        const str = data.toString();
        // curl -# 출력 예시: "######### 15.0%"
        const match = str.match(/([\d.]+)%/);
        if (match) {
            const progress = parseFloat(match[1]);
            progressCallback.onProgress(progress);
        }
    });

    // 4. 종료 처리
    curl.on("close", (code) => {
        if (code === 0) {
            progressCallback.onEnd(true);
        } else {
            console.error(`Curl failed with code ${code}`);
            progressCallback.onEnd(false);
        }
    });

    curl.on("error", (err) => {
        console.error("Spawn error:", err);
        progressCallback.onEnd(false);
    });


    return {
        StopCurl: async () => {
            if (!curl.killed) {
                await curl.kill();
            }
        }
    }
}