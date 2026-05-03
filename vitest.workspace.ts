import { defineWorkspace } from 'vitest/config'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineWorkspace([
  {
    test: {
      include: ['./tests/unit/**/*'],
      name: 'unit',
      environment: 'node'
    }
  },
  defineVitestConfig({
    test: {
      include: ['./tests/e2e/**/*'],
      name: 'e2e',
      environment: 'nuxt'
    }
  })
])
