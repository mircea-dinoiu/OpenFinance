const path = require('path');

const isProduction = false;
const enableSourceMaps = isProduction === false;

module.exports = {
    devtool: isProduction ? null : 'cheap-module-eval-source-map',
    entry: {
        'bundles/Mobile': path.resolve('sources/mobile/Mobile.js')
    },
    output: {
        path: 'public/dist',
        filename: '[name].js',
        publicPath: '/dist/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/
                ],
                loaders: ['babel?cacheDirectory=true']
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
    resolve: {
        root: [
            path.resolve('sources')
        ]
    }
};