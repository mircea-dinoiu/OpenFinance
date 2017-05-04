const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

const env = process.env.NODE_ENV;

const isProduction = env === 'production';
const isHot = env === 'hot';

const enableSourceMaps = isProduction === false;

module.exports = {
    devtool: isProduction ? null : 'cheap-eval-source-map',
    entry: {
        'bundles/Mobile': path.resolve('sources/mobile/Mobile.js')
    },
    devServer: isHot ? {
        contentBase: path.resolve('./public'),
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    } : null,
    output: {
        path: path.resolve('./public/dist'),
        // filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
        filename: '[name].js',
        publicPath: `${isHot ? 'http://localhost:8080' : ''}/dist/`
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/
                ],
                loaders: [isHot ? 'react-hot' : null, 'babel?cacheDirectory=true'].filter(Boolean)
            },
            {
                test: /\.scss$/,
                loaders: ['style', `css?sourceMap=${enableSourceMaps}&url=false`, `sass?sourceMap=${enableSourceMaps}`]
            },
            {
                test: /\.css$/,
                loaders: ['style', `css?sourceMap=${enableSourceMaps}&url=false`]
            }
        ]
    },
    plugins: [
        isProduction && new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify('production')}}),
        isProduction && new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}, sourceMap: false}),
        isProduction && new CompressionPlugin({
            algorithm: 'gzip'
        })
    ].filter(Boolean),
    resolve: {
        root: [
            path.resolve('sources')
        ]
    }
};