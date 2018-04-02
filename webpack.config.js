const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

console.log('Webpack building for', env);

const isProduction = env === 'production';
const isHot = env === 'hot';

const enableSourceMaps = isProduction === false;

module.exports = {
    devtool: isProduction ? false : 'cheap-source-map',
    entry: {
        'bundles/Responsive': path.resolve('sources/mobile/Responsive.js'),
        'bundles/Desktop': path.resolve('sources/desktop/Desktop.js'),
    },
    devServer: isHot ? {
        contentBase: path.resolve('./public'),
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    } : undefined,
    output: {
        path: path.resolve('./public/dist'),
        // filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
        filename: '[name].js',
        publicPath: `${isHot ? 'http://localhost:8080' : ''}/dist/`
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/
                ],
                use: [
                    isHot ? {loader: 'react-hot-loader'} : null,
                    {loader: 'babel-loader', options: {cacheDirectory: true}}
                ].filter(Boolean)
            },
            {
                test: /\.scss$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader', options: {sourceMap: enableSourceMaps, url: false}},
                    {loader: 'sass-loader', options: {sourceMap: enableSourceMaps}}
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader', options: {sourceMap: enableSourceMaps, url: false}}
                ]
            }
        ]
    },
    plugins: [
        isProduction && new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify(env)}}),
        isProduction && new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}, sourceMap: false}),
        isProduction && new CompressionPlugin({
            algorithm: 'gzip'
        })
    ].filter(Boolean),
    resolve: {
        modules: [
            path.resolve('sources'),
            path.resolve('node_modules')
        ]
    }
};