module.exports = {
    json: true,
    setupFilesAfterEnv: ['./jest.test-setup.js', 'jest-extended/all', './src/index.js'],
    rootDir: './',
    testTimeout: 100000,
    testMatch: [
        '<rootDir>/src/test/**/**/*.test.js',
        '<rootDir>/src/test/**/*.test.js',
        '<rootDir>/src/test/*.test.js',
        '<rootDir>/src/*.test.js',
        '<rootDir>/src/**/**/**/*.test.js',
    ],
    reporters: ['default'],
};
