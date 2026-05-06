import type { Access, CollectionConfig, PayloadRequest } from 'payload'

function automationToken(req: PayloadRequest): string | null {
  const headers = req.headers as Headers | Record<string, string | string[] | undefined>

  if (typeof (headers as Headers).get === 'function') {
    return (headers as Headers).get('x-automation-token')
  }

  const value = (headers as Record<string, string | string[] | undefined>)['x-automation-token']
  return Array.isArray(value) ? value[0] ?? null : value ?? null
}

const canCreateOrUpdatePost: Access = ({ req }) => {
  if (req.user) return true

  const configuredToken = process.env.CONTENT_AUTOMATION_TOKEN
  if (!configuredToken) return false

  return automationToken(req) === configuredToken
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'date', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: canCreateOrUpdatePost,
    update: canCreateOrUpdatePost,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'contentMarkdown',
      type: 'textarea',
      admin: {
        description: 'Markdown fallback content (used when rich text is empty)',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
      },
    },
    {
      name: 'readTime',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
