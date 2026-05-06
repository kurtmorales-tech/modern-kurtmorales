import type { CollectionConfig } from 'payload'

export const Templates: CollectionConfig = {
  slug: 'templates',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'tech', 'featured', 'order'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'demoUrl',
      type: 'text',
      label: 'Demo URL',
      admin: {
        description: 'Live demo link',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'Source Code URL',
      admin: {
        description: 'GitHub or download link',
      },
    },
    {
      name: 'tech',
      type: 'text',
      label: 'Tech Stack',
      admin: {
        description: 'e.g. "React / Vite / Tailwind"',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
    },
    {
      name: 'price',
      type: 'number',
      label: 'Price (USD)',
      admin: {
        description: 'Leave 0 for free',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
