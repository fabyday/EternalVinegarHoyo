import path from 'path'
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import commonConfig from './webpack.base'

const prodConfig: Configuration = {
    mode: 'production',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../../dist/main')
    }
}

export default merge(commonConfig, prodConfig)
