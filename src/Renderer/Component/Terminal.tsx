import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

// xterm의 기본 CSS를 불러와야 스타일이 깨지지 않습니다.
// @ts-ignore (이 줄을 추가하여 바로 아래 import의 타입 체크를 강제로 끕니다)
import 'xterm/css/xterm.css';
const XTermTerminal: React.FC = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xterm = useRef<Terminal | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        // 1. 터미널 인스턴스 생성
        xterm.current = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#1e1e1e',
                foreground: '#00ff00',
            },
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 14,
        });

        // 2. 크기 조절 애드온 연결
        const fitAddon = new FitAddon();
        xterm.current.loadAddon(fitAddon);

        // 3. DOM에 터미널 연결
        xterm.current.open(terminalRef.current);
        fitAddon.fit();

        // 4. 초기 메시지 출력
        xterm.current.writeln('Welcome to \x1B[1;32mEternal Vinegar Hoyo\x1B[0m Terminal');
        xterm.current.write('\r\n$ ');

        // 5. 키 입력 이벤트 처리
        xterm.current.onData((data) => {
            const code = data.charCodeAt(0);
            if (code === 13) { // Enter
                xterm.current?.write('\r\n$ ');
            } else if (code === 127) { // Backspace
                // 지우기 로직 (간단하게 구현)
                xterm.current?.write('\b \b');
            } else {
                xterm.current?.write(data);
            }
        });

        return () => {
            xterm.current?.dispose();
        };
    }, []);

    return (
        <div 
            ref={terminalRef} 
            style={{ 
                width: '100%', 
                height: '500px', 
                backgroundColor: '#1e1e1e' 
            }} 
        />
    );
};

export default XTermTerminal;