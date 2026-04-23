/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/Renderer/**/*.{js,jsx,ts,tsx,html}", // 렌더러 내 파일들 감시
    "./src/Renderer/.storybook/**/*.{js,ts,jsx,tsx}", // 이 라인이 반드시 있어야 합니다!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}