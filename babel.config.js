module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
                modules: process.env.NODE_ENV === 'test' && 'auto',
                debug: process.env.BABEL_DEBUG === 'true',
            },
        ],
        '@babel/preset-react',
        '@babel/preset-flow',
    ],
    plugins: [
        'babel-plugin-styled-components',
        'react-hot-loader/babel',
        ['@babel/plugin-proposal-class-properties', {loose: true}],
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-optional-chaining',
    ],
};
