import { getPayload } from 'payload'

import config from '../src/payload.config'

const dryRun = process.argv.includes('--dry-run')

async function main() {
  const payload = await getPayload({ config })
  const posts = await payload.find({ collection: 'posts', limit: 500, depth: 0, pagination: false })
  const generated = posts.docs.filter((post: any) => String(post.contentMarkdown ?? '').includes('image.pollinations.ai'))

  for (const post of generated) {
    if (dryRun) {
      console.log(`DRY delete: ${post.slug}`)
    } else {
      await payload.delete({ collection: 'posts', id: post.id })
    }
  }

  console.log(`${dryRun ? 'Would delete' : 'Deleted'} ${generated.length} generated RSS posts`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
