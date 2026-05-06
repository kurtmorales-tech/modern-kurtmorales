import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'createdAt'],
    group: 'Newsletter',
  },
  access: {
    // Only authenticated users can manage the subscriber list
    read: ({ req: { user } }) => !!user,
    // Public can create (sign up)
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'subscribed',
      required: true,
      options: [
        {
          label: 'Subscribed',
          value: 'subscribed',
        },
        {
          label: 'Unsubscribed',
          value: 'unsubscribed',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
