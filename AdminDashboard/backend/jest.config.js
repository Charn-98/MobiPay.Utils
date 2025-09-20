module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transformIgnorePatterns: [
    '/node_modules/(?!uuid)'
  ],
   moduleNameMapper: {
    "^uuid$": require.resolve('uuid')
  },
  testTimeout: 25000,
};