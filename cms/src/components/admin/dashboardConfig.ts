export type DashboardBlock = 'intro' | 'actions' | 'stats' | 'workflow'

export type DashboardAction = {
  href: string
  label: string
  target?: '_blank'
  variant?: 'primary' | 'secondary'
}

export type DashboardStat = {
  collection: 'posts' | 'projects' | 'media'
  label: string
}

export const dashboardConfig = {
  // Reorder these IDs to change dashboard placement.
  // Available blocks: intro, actions, stats, workflow
  layout: ['intro', 'actions', 'stats', 'workflow'] satisfies DashboardBlock[],

  intro: {
    eyebrow: 'Light mode content workspace',
    title: (firstName: string) => `Welcome back, ${firstName}.`,
    description:
      'A clean CMS for non-developer team members and users: publish content, manage projects, and keep the site updated without touching code.',
  },

  actions: [
    { href: '/admin/collections/posts/create', label: 'New CMS article', variant: 'primary' },
    { href: '/admin/collections/posts', label: 'Manage articles', variant: 'secondary' },
    { href: '/admin/collections/projects', label: 'Manage projects', variant: 'secondary' },
    { href: 'http://localhost:3000', label: 'View site', target: '_blank', variant: 'secondary' },
  ] satisfies DashboardAction[],

  stats: [
    { collection: 'posts', label: 'Blog posts' },
    { collection: 'projects', label: 'Projects' },
    { collection: 'media', label: 'Media files' },
  ] satisfies DashboardStat[],

  workflow: [
    'Write in plain language.',
    'Save drafts until content is ready.',
    'Publish only reviewed updates.',
  ],

  grid: {
    minCardWidth: 160,
    gap: 14,
  },
}
