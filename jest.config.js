module.exports = {
    modulePathIgnorePatterns: ['package.json', 'sources/desktop/ext'],
    collectCoverage: true,
    coverageReporters: ['text-summary', 'html'],
    coverageDirectory: '<rootDir>/build/coverage',
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    modulePaths: ['<rootDir>/', '<rootDir>/sources/'],
    moduleNameMapper: {
        '.pcss$': 'test/emptyObjectStub.js',
    },
};
