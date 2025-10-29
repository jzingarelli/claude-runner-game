module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/backend', '<rootDir>/tests/backend'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'backend/**/*.ts',
    '!backend/**/*.d.ts',
    '!backend/**/*.test.ts',
    '!backend/**/*.spec.ts',
    '!backend/**/index.ts',
  ],
  coverageDirectory: 'coverage/backend',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/backend/$1',
    '^@models/(.*)$': '<rootDir>/backend/models/$1',
    '^@services/(.*)$': '<rootDir>/backend/services/$1',
    '^@controllers/(.*)$': '<rootDir>/backend/controllers/$1',
    '^@middleware/(.*)$': '<rootDir>/backend/middleware/$1',
    '^@utils/(.*)$': '<rootDir>/backend/utils/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/backend/setup.ts'],
  testTimeout: 10000,
  verbose: true,
};
