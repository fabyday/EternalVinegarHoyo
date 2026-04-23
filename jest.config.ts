import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest/presets/default-esm', // ESM 전용 프리셋 사용
    testEnvironment: 'node',
    roots: ['<rootDir>/tests/'],
    testMatch: ['**/*.test.ts'],
    verbose: true,
    transform: {
        // ts-jest가 tsconfig.jest.json을 사용하도록 명시적으로 설정
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.jest.json',
            useESM: true,
        }],
    },
    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
    },
};
export default config;
