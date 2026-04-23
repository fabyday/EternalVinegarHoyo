import { merge } from 'webpack-merge';
import baseConfig from './webpack.base';
import TerserPlugin from 'terser-webpack-plugin';

export default merge(baseConfig, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        splitChunks: { chunks: 'all' }, // 공통 라이브러리 분리
    },
});