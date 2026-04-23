import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';

const commonConfig: Configuration = {
  mode: 'development',
  target: 'electron-renderer',
  entry: {
    MainView: path.resolve(__dirname, 'View/MainView/App.tsx'),
    TerminalView: path.resolve(__dirname, 'View/TerminalView/App.tsx'),
  },
  output: {
    path: path.resolve(__dirname, '../../dist/renderer/View'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      // TypeScript rules
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.json'),
        },
      },
      // css rules
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // 설정 파일이 src/renderer/postcss.config.js에 있다고 가정
                // config: path.resolve(__dirname, 'src/renderer/postcss.config.ts'),
                plugins: [
                  // require('@tailwindcss/postcss'),
                  // require('autoprefixer'),
                  "tailwindcss",
                  "autoprefixer",
                ],
              },
            },
          },
        ],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'MainView.html',
      template: './src/renderer/template/index.html', // 렌더러가 담길 기본 HTML
      chunks: ['MainView'], // 해당 HTML에 main.bundle.js만 삽입
    }),
    new HtmlWebpackPlugin({
      filename: 'TerminalView.html',
      template: './src/renderer/template/index.html', // 동일한 템플릿 사용
      chunks: ['TerminalView'], // 해당 HTML에 terminal.bundle.js만 삽입
    }),
  ],
};

export default commonConfig;