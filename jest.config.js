module.exports = {
    modulePathIgnorePatterns: ['package.json', 'sources/desktop/ext'],
    collectCoverage: true,
    coverageReporters: ['text-summary', 'html'],
    coverageDirectory: '<rootDir>/build/coverage',
    modulePaths: ['<rootDir>/', '<rootDir>/sources/'],
    moduleNameMapper: {
        '.pcss$': 'test/emptyObjectStub.js',
    },
};
