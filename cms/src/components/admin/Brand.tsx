import React from 'react'

const brandText: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  letterSpacing: '-0.04em',
  lineHeight: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

export const AdminLogo = () => (
  <div style={{ alignItems: 'center', display: 'flex', gap: 10, maxWidth: '100%', minWidth: 0 }}>
    <AdminIcon />
    <span style={brandText}>Kurt Morales CMS</span>
  </div>
)

export const AdminIcon = () => (
  <div
    aria-hidden="true"
    style={{
      alignItems: 'center',
      background: 'linear-gradient(135deg, #111827 0%, #7c3aed 55%, #06b6d4 100%)',
      borderRadius: 12,
      color: '#fff',
      aspectRatio: '1 / 1',
      boxSizing: 'border-box',
      display: 'flex',
      flex: '0 0 40px',
      flexShrink: 0,
      fontSize: 15,
      fontWeight: 900,
      height: 40,
      justifyContent: 'center',
      letterSpacing: '-0.08em',
      lineHeight: 1,
      minHeight: 40,
      minWidth: 40,
      overflow: 'hidden',
      width: 40,
    }}
  >
    KM
  </div>
)
