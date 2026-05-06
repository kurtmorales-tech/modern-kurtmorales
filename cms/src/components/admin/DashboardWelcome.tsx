import type { ServerProps } from 'payload'

import React from 'react'

import { DashboardActionLink } from './DashboardActionLink'
import { dashboardConfig, type DashboardBlock } from './dashboardConfig'
import { getLinkStyle, styles } from './dashboardStyles'

type Counts = Record<(typeof dashboardConfig.stats)[number]['collection'], number>

function IntroBlock({ firstName }: { firstName: string }) {
  return (
    <div style={styles.block.spacing}>
      <p style={styles.text.eyebrow}>{dashboardConfig.intro.eyebrow}</p>
      <h1 style={styles.text.heading}>{dashboardConfig.intro.title(firstName)}</h1>
      <p style={styles.text.body}>{dashboardConfig.intro.description}</p>
    </div>
  )
}

function ActionsBlock() {
  return (
    <div
      style={{
        ...styles.block.spacing,
        alignItems: 'stretch',
        display: 'grid',
        gap: 12,
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        maxWidth: 920,
      }}
    >
      {dashboardConfig.actions.map((action) => (
        <DashboardActionLink
          href={action.href}
          key={action.label}
          label={action.label}
          style={getLinkStyle(action.variant)}
          target={action.target}
        />
      ))}
    </div>
  )
}

function StatsBlock({ counts }: { counts: Counts }) {
  return (
    <div
      style={{
        ...styles.block.spacing,
        display: 'grid',
        gap: dashboardConfig.grid.gap,
        gridTemplateColumns: `repeat(auto-fit, minmax(${dashboardConfig.grid.minCardWidth}px, 1fr))`,
      }}
    >
      {dashboardConfig.stats.map((stat) => (
        <div key={stat.collection} style={styles.card}>
          <p style={styles.stat.label}>{stat.label}</p>
          <p style={styles.stat.value}>{counts[stat.collection]}</p>
        </div>
      ))}
    </div>
  )
}

function WorkflowBlock() {
  return (
    <div style={{ ...styles.card, marginBottom: 0 }}>
      <p style={{ ...styles.stat.label, fontWeight: 800, letterSpacing: '0.12em', marginBottom: 12, textTransform: 'uppercase' }}>
        Editor workflow
      </p>
      <div style={{ display: 'grid', gap: 10 }}>
        {dashboardConfig.workflow.map((item, index) => (
          <div key={item} style={styles.workflow.item}>
            <span style={styles.workflow.badge}>{index + 1}</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

const blockRenderers: Record<DashboardBlock, (props: { firstName: string; counts: Counts }) => React.ReactElement> = {
  intro: ({ firstName }) => <IntroBlock firstName={firstName} />,
  actions: () => <ActionsBlock />,
  stats: ({ counts }) => <StatsBlock counts={counts} />,
  workflow: () => <WorkflowBlock />,
}

async function fetchCounts(payload: ServerProps['payload']): Promise<Counts> {
  const results = await Promise.all(
    dashboardConfig.stats.map(async (stat) => ({
      collection: stat.collection,
      count: (await payload.count({ collection: stat.collection })).totalDocs,
    })),
  )

  return Object.fromEntries(results.map((r) => [r.collection, r.count])) as Counts
}

function extractFirstName(user: ServerProps['user']): string {
  const displayName = (user as { name?: unknown } | undefined)?.name
  return typeof displayName === 'string' ? displayName.split(' ')[0] : 'Kurt'
}

export const DashboardWelcome = async ({ payload, user }: ServerProps) => {
  const counts = await fetchCounts(payload)
  const firstName = extractFirstName(user)

  return (
    <section style={styles.section.container}>
      <div aria-hidden="true" style={styles.section.orb} />
      <div style={styles.section.content}>
        {dashboardConfig.layout.map((block) => (
          <React.Fragment key={block}>{blockRenderers[block]({ firstName, counts })}</React.Fragment>
        ))}
      </div>
    </section>
  )
}
