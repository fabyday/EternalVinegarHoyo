import { runProgram } from "../../src/Main/Program/ChildProgram";


describe('runProgram Unit Tests', () => {

    // 1. 단순 명령어 실행 테스트
    test('ls 명령어가 정상적으로 0을 반환해야 함', async () => {
        const program = runProgram({
            command: 'ls',
            args: ['-la']
        });

        const exitCode = await program.done;
        expect(exitCode).toBe(0);
    });

    // 2. 환경 변수 전달 테스트
    test('env variable set Test', async () => {
        let output = '';
        const program = runProgram({
            command: 'sh',
            args: ['-c', 'echo $TEST_VAR'],
            env: { TEST_VAR: 'HELLO_GEMS' },
            onLog: (data) => { output += data.trim(); }
        });

        await program.done;
        expect(output).toBe('HELLO_GEMS');
    });

    // 3. 중단(Stop) 및 프로세스 그룹 킬 테스트
    test('Child Process Stop Test', async () => {
        const program = runProgram({
            command: 'sleep',
            args: ['100']
        });

        // 1초 뒤 중단
        await new Promise(res => setTimeout(res, 1000));
        await program.Stop();

        const exitCode = await program.done;
        expect(exitCode).not.toBe(0);
    }, 10000); // 테스트 타임아웃을 10초로 설정
});