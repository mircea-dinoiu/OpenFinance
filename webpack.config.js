const path = require('path');
const enableSourceMaps = true;

module.exports = {
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