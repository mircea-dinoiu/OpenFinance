const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const env = process.env.NODE_ENV || 'development';

console.log('Webpack building for', env);

const isProduction = env === 'production';
const isHot = env === 'hot';
const enableSourceMaps = isProduction === false;

module.exports = {
    devtool: isProduction ? false : 'cheap-source-map',
    mode: isProduction ? 'production' : 'development',
    entry: {
        'bundles/Responsive': path.resolve('sources/mobile/index.js'),
        'bundles/Desktop': path.resolve('sources/desktop/Desktop.js'),
    },
    devServer: isHot
        ? {
            contentBase: path.resolve('./public'),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        }
        : undefined,
    output: {
        path: path.resolve('./public/dist'),
        filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
        publicPath: `${isHot ? 'http://localhost:8080' : ''}/dist/`,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: { cacheDirectory: true },
                    },
                ].filter(Boolean),
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: enableSourceMaps, url: false },
                    },
                ],
            },
            {
                test: /\.pcss$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            localIdentName:
                                '[name]__[local]--[hash:base64:5]',
                            sourceMap: false,
                            url: false,
                            modules: true,
                            importLoaders: 1,
                        },
                    },
                    { loader: 'postcss-loader' },
                ],
            },
        ],
    },
    plugins: [
        isProduction &&
            new webpack.LoaderOptionsPlugin({
                minimize: true,
            }),
        isProduction &&
            new CompressionPlugin({
                algorithm: 'gzip',
            }),
        !isProduction && new webpack.NamedModulesPlugin(),
        new ManifestPlugin(),
    ].filter(Boolean),
    resolve: {
        alias: {
            common: path.resolve(__dirname, 'sources/common'),
            mobile: path.resolve(__dirname, 'sources/mobile'),
            shared: path.resolve(__dirname, 'shared'),
        }
    },
};
