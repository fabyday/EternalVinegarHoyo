import path from 'path'
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import commonConfig from './webpack.base'

const devConfig: Configuration = {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../../dist/main')
    }
}

export default merge(commonConfig, devConfig)