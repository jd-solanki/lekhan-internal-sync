import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          globals: true,
          name: 'unit',
          include: [
            'eslint/tests/**/*.test.ts',
            'test/unit/**/*.{test,spec}.ts',
          ],
          environment: 'node',
          typecheck: {
            enabled: true,
          },
        },
      },
      {
        test: {
          name: 'api',
          include: [
            'test/api/**/*.{test,spec}.ts',
          ],
          environment: 'node',
          typecheck: {
            enabled: true,
          },
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
})
