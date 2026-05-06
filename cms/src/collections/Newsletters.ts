import type { CollectionConfig } from 'payload'

export const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'sentAt', 'createdAt'],
    group: 'Newsletter',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal name for this campaign',
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      admin: {
        description: 'Email subject line subscribers will see',
      },
    },
    {
      name: 'preheader',
      type: 'text',
      label: 'Preheader text',
      admin: {
        description: 'Preview text shown after the subject in email clients',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Body content',
      admin: {
        description: 'Main email body — use rich text formatting',
      },
    },
    {
      name: 'contentMarkdown',
      type: 'textarea',
      label: 'Fallback / Plain content',
      admin: {
        description: 'Plain text fallback. If empty, plain text is auto-extracted from rich text.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sending', value: 'sending' },
        { label: 'Sent', value: 'sent' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      label: 'Sent at',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
        description: 'Timestamp when this campaign was sent',
      },
    },
    {
      name: 'recipientsCount',
      type: 'number',
      label: 'Recipients count',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Number of subscribers at time of send',
      },
    },
  ],
  timestamps: true,
}
