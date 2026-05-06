import type React from 'react'

export const styles = {
  card: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 18,
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
    padding: 18,
  } as React.CSSProperties,

  link: {
    base: {
      alignItems: 'center',
      borderRadius: 999,
      display: 'inline-flex',
      fontSize: 13,
      fontWeight: 800,
      justifyContent: 'center',
      minHeight: 44,
      padding: '10px 16px',
      textAlign: 'center',
      textDecoration: 'none',
      width: '100%',
    } as React.CSSProperties,

    primary: {
      background: '#111827',
      border: '1px solid #111827',
      color: '#fff',
    } as React.CSSProperties,

    secondary: {
      background: '#fff',
      border: '1px solid #d1d5db',
      color: '#111827',
    } as React.CSSProperties,
  },

  stat: {
    label: {
      color: '#6b7280',
      fontSize: 13,
      margin: 0,
    } as React.CSSProperties,

    value: {
      color: '#111827',
      fontSize: 34,
      fontWeight: 900,
      letterSpacing: '-0.06em',
      lineHeight: 1,
      margin: '8px 0 0',
    } as React.CSSProperties,
  },

  text: {
    eyebrow: {
      color: '#7c3aed',
      fontSize: 13,
      fontWeight: 900,
      letterSpacing: '0.16em',
      margin: 0,
      textTransform: 'uppercase',
    } as React.CSSProperties,

    heading: {
      fontSize: 'clamp(32px, 6vw, 58px)',
      letterSpacing: '-0.08em',
      lineHeight: 0.95,
      margin: '12px 0 12px',
    } as React.CSSProperties,

    body: {
      color: '#4b5563',
      fontSize: 16,
      lineHeight: 1.6,
      margin: 0,
      maxWidth: 780,
    } as React.CSSProperties,
  },

  section: {
    container: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 48%, #eef2ff 100%)',
      border: '1px solid #e5e7eb',
      borderRadius: 28,
      boxShadow: '0 24px 80px rgba(15, 23, 42, 0.10)',
      color: '#111827',
      marginBottom: 28,
      overflow: 'hidden',
      padding: 28,
      position: 'relative',
    } as React.CSSProperties,

    orb: {
      background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 62%)',
      height: 300,
      position: 'absolute',
      right: -90,
      top: -120,
      width: 300,
    } as React.CSSProperties,

    content: {
      position: 'relative',
      zIndex: 1,
    } as React.CSSProperties,
  },

  block: {
    spacing: { marginBottom: 24 } as React.CSSProperties,
  },

  workflow: {
    badge: {
      alignItems: 'center',
      background: '#eef2ff',
      borderRadius: 999,
      color: '#4338ca',
      display: 'inline-flex',
      fontSize: 12,
      fontWeight: 900,
      height: 26,
      justifyContent: 'center',
      width: 26,
    } as React.CSSProperties,

    item: {
      alignItems: 'center',
      color: '#374151',
      display: 'flex',
      gap: 10,
      fontSize: 14,
    } as React.CSSProperties,
  },
} as const

export function getLinkStyle(variant: 'primary' | 'secondary' = 'secondary'): React.CSSProperties {
  return { ...styles.link.base, ...styles.link[variant] }
}
