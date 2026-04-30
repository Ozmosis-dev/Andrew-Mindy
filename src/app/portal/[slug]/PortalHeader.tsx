'use client'

import { useState } from 'react'

export default function PortalHeader({
  name,
  driveUrl,
}: {
  name: string
  driveUrl: string | null
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .portal-header {
          animation: fadeSlideDown 0.3s ease forwards;
        }
      `}</style>
      <header
        className="portal-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(255,255,255,0.82)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
        }}
      >
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#1a1a1a',
          letterSpacing: '-0.02em',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          {name}
        </span>

        {driveUrl && (
          <a
            href={driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: hovered ? '#fff' : '#1a1a1a',
              textDecoration: 'none',
              padding: '7px 14px',
              background: hovered ? '#1a1a1a' : 'transparent',
              border: '1px solid',
              borderColor: hovered ? '#1a1a1a' : 'rgba(0,0,0,0.18)',
              borderRadius: 7,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '0.01em',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            Download Assets
            <span style={{
              display: 'inline-block',
              transform: hovered ? 'translateX(2px)' : 'translateX(0)',
              transition: 'transform 0.15s ease',
            }}>→</span>
          </a>
        )}
      </header>
    </>
  )
}
