import { describe, it, expect } from 'vitest'
import { createPage, setup } from '@nuxt/test-utils/e2e'

describe('setup', async () => {
  await setup({
    browser: true,
    server: true,
    build: true
  })

  it('starts successfully', async () => {
    const page = await createPage('/')

    page.on('response', (response) => {
      const status = response.status()
      expect(status, 'Expect the root url (/) to be a successful status code').toBeLessThan(400)
    })

    await page.reload()
  })
})
