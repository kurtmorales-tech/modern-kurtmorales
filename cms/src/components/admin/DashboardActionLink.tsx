'use client'

import { Link } from '@payloadcms/ui'
import type React from 'react'

type Props = {
  href: string
  label: string
  style: React.CSSProperties
  target?: '_blank'
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href)
}

export function DashboardActionLink({ href, label, style, target }: Props) {
  if (target === '_blank' || isExternalHref(href)) {
    return (
      <a href={href} rel="noreferrer" style={style} target="_blank">
        {label}
      </a>
    )
  }

  return (
    <Link href={href} prefetch={false} style={style}>
      {label}
    </Link>
  )
}
