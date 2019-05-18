module.exports = {
    modulePathIgnorePatterns: ['package.json'],
    collectCoverage: true,
    coverageReporters: ['text-summary', 'html'],
    coverageDirectory: '<rootDir>/build/coverage',
    modulePaths: ['<rootDir>/', '<rootDir>/sources/'],
    moduleNameMapper: {
        '.pcss$': 'test/emptyObjectStub.js',
    },
};
