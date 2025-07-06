import node from '@astrojs/node'
import { defineConfig } from 'astro/config'

// E2Eテストモードの検出
const isE2E = process.env.NODE_ENV === 'test' || process.env.VITE_TEST_MODE === 'true'

// https://astro.build/config
export default defineConfig({
  experimental: {
    liveContentCollections: true,
  },
  vite: {
    define: {
      'import.meta.env.VITE_TEST_MODE': JSON.stringify(isE2E ? 'true' : 'false'),
    },
  },
  adapter: node({
    mode: 'standalone',
  }),
})
