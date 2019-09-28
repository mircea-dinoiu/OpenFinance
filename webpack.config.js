const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const env = process.env.NODE_ENV || 'development';

console.log('Webpack building for', env);

const isProduction = env === 'production';
const isHot = env === 'hot';

module.exports = {
    devtool: isProduction ? false : process.env.DEVTOOL || 'eval-source-map',
    mode: isProduction ? 'production' : 'development',
    entry: {
        'bundles/Responsive': path.resolve('sources/mobile/index.js'),
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
                        options: {cacheDirectory: true},
                    },
                ].filter(Boolean),
            },
            {
                test: /\.css$/,
                use: [{loader: 'raw-loader'}],
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
            'react-dom': !isHot ? 'react-dom' : '@hot-loader/react-dom',
        },
    },
};
