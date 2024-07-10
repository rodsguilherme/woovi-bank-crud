import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testTimeout: 80000,
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}

export default config
