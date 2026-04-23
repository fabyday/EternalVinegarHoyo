import { merge } from 'webpack-merge';
import baseConfig from './webpack.base';
import 'webpack-dev-server'; // 이 한 줄이 Configuration에 devServer 타입을 주입합니다.



export default merge(baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 3000,
    }
});
