module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                modules: process.env.NODE_ENV === 'test' && 'auto',
                debug: process.env.BABEL_DEBUG === 'true',
            },
        ],
        '@babel/preset-react',
        '@babel/preset-flow',
    ],
    plugins: [
        'react-hot-loader/babel',
        ['@babel/plugin-proposal-class-properties', {loose: true}],
        '@babel/plugin-proposal-object-rest-spread',
    ],
};
