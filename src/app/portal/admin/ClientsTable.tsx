'use client'

import { useState } from 'react'
import Link from 'next/link'
import { generateInviteLink } from './actions'

type Client = {
  id: string
  name: string
  slug: string
  email: string
  active: boolean
  created_at: string
  html_storage_path: string | null
}

export default function ClientsTable({ clients }: { clients: Client[] }) {
  const [inviteModal, setInviteModal] = useState<{ link: string; email: string } | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  async function handleInvite(client: Client) {
    setLoadingId(client.id)
    const result = await generateInviteLink(client.email)
    setLoadingId(null)
    if (result.link) {
      setInviteModal({ link: result.link, email: client.email })
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  function copyLink() {
    if (!inviteModal) return
    navigator.clipboard.writeText(inviteModal.link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const mailtoHref = inviteModal
    ? `mailto:${inviteModal.email}?subject=Your%20Brand%20Portal%20Access&body=Here%20is%20your%20sign-in%20link%20for%20the%20brand%20portal%3A%0A%0A${encodeURIComponent(inviteModal.link)}%0A%0AThis%20link%20expires%20in%2024%20hours.`
    : '#'

  if (clients.length === 0) {
    return (
      <div style={emptyStyle}>
        <p style={{ margin: 0, color: '#888', fontSize: 14 }}>No clients yet. Create your first one.</p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .table-wrap { animation: fadeUp 0.3s ease forwards; }
        .action-link {
          color: #555; font-size: 12px; text-decoration: none; margin-right: 12px;
          font-weight: 500; transition: color 0.15s ease;
        }
        .action-link:hover { color: #1a1a1a; }
        .action-btn {
          background: none; border: 1px solid #d0d0d0; border-radius: 6px;
          padding: 4px 10px; font-size: 12px; cursor: pointer;
          font-family: system-ui, sans-serif; color: #333;
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        }
        .action-btn:hover:not(:disabled) { background: #1a1a1a; border-color: #1a1a1a; color: #fff; }
        .action-btn:disabled { opacity: 0.5; cursor: default; }
        .modal-card { animation: modalIn 0.2s ease forwards; }
        .copy-btn { transition: background 0.15s ease; }
        .copy-btn:hover { background: #333 !important; }
        .mailto-btn { transition: background 0.15s ease, border-color 0.15s ease; }
        .mailto-btn:hover { background: #f5f5f5 !important; }
      `}</style>

      <div style={tableWrap} className="table-wrap">
        <table style={tableStyle}>
          <thead>
            <tr>
              {['Name', 'Slug', 'Email', 'Status', 'HTML', 'Created', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr
                key={client.id}
                onMouseEnter={() => setHoveredRow(client.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  ...trStyle,
                  background: hoveredRow === client.id ? '#f9fafb' : '#fff',
                  transition: 'background 0.15s ease',
                }}
              >
                <td style={tdStyle}><span style={{ fontWeight: 500 }}>{client.name}</span></td>
                <td style={tdStyle}><code style={codeStyle}>{client.slug}</code></td>
                <td style={tdStyle}>{client.email}</td>
                <td style={tdStyle}>
                  <span style={client.active ? activePill : inactivePill}>
                    {client.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{ color: client.html_storage_path ? '#22c55e' : '#d1d5db', fontSize: 12 }}>
                    {client.html_storage_path ? '✓ Uploaded' : '—'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{ color: '#999', fontSize: 12 }}>
                    {new Date(client.created_at).toLocaleDateString()}
                  </span>
                </td>
                <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                  <Link href={`/portal/admin/clients/${client.id}`} className="action-link">Edit</Link>
                  <a href={`/portal/${client.slug}`} target="_blank" rel="noopener noreferrer" className="action-link">Preview</a>
                  <button
                    onClick={() => handleInvite(client)}
                    disabled={loadingId === client.id}
                    className="action-btn"
                  >
                    {loadingId === client.id ? '…' : 'Send Invite'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {inviteModal && (
        <div style={overlayStyle} onClick={() => setInviteModal(null)}>
          <div style={modalStyle} className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 style={modalTitle}>Magic Link</h2>
            <p style={modalSub}>Send this link to <strong style={{ color: '#333' }}>{inviteModal.email}</strong>. Expires in 24 hours.</p>
            <div style={linkBox}>
              <span style={{ fontSize: 12, color: '#555', wordBreak: 'break-all', flex: 1 }}>
                {inviteModal.link}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={copyLink} style={copyBtn} className="copy-btn">
                {copied ? '✓ Copied' : 'Copy Link'}
              </button>
              <a href={mailtoHref} style={mailtoBtn} className="mailto-btn">Send via Email</a>
              <button onClick={() => setInviteModal(null)} style={closeBtn}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const tableWrap: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e5e5',
  borderRadius: 10,
  overflow: 'hidden',
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
}

const thStyle: React.CSSProperties = {
  padding: '10px 16px',
  textAlign: 'left',
  fontWeight: 500,
  color: '#999',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  background: '#fafafa',
  borderBottom: '1px solid #e5e5e5',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #f0f0f0',
  color: '#333',
  verticalAlign: 'middle',
}

const trStyle: React.CSSProperties = {}

const codeStyle: React.CSSProperties = {
  fontSize: 12,
  background: '#f5f5f5',
  padding: '2px 6px',
  borderRadius: 4,
  fontFamily: 'monospace',
}

const activePill: React.CSSProperties = {
  fontSize: 11,
  background: '#dcfce7',
  color: '#16a34a',
  padding: '2px 8px',
  borderRadius: 99,
  fontWeight: 500,
}

const inactivePill: React.CSSProperties = {
  fontSize: 11,
  background: '#f5f5f5',
  color: '#999',
  padding: '2px 8px',
  borderRadius: 99,
  fontWeight: 500,
}

const emptyStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e5e5',
  borderRadius: 10,
  padding: '40px',
  textAlign: 'center',
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
}

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 14,
  padding: '32px',
  maxWidth: 520,
  width: '90%',
  boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
}

const modalTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: '#1a1a1a',
  margin: '0 0 6px',
  letterSpacing: '-0.02em',
}

const modalSub: React.CSSProperties = {
  fontSize: 13,
  color: '#777',
  margin: '0 0 16px',
}

const linkBox: React.CSSProperties = {
  background: '#f5f5f5',
  borderRadius: 8,
  padding: '12px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}

const copyBtn: React.CSSProperties = {
  padding: '8px 16px',
  background: '#1a1a1a',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'system-ui, sans-serif',
}

const mailtoBtn: React.CSSProperties = {
  padding: '8px 16px',
  background: '#fff',
  color: '#1a1a1a',
  border: '1px solid #d0d0d0',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  textDecoration: 'none',
  fontFamily: 'system-ui, sans-serif',
  display: 'inline-block',
}

const closeBtn: React.CSSProperties = {
  padding: '8px 16px',
  background: 'none',
  color: '#999',
  border: 'none',
  borderRadius: 8,
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'system-ui, sans-serif',
  marginLeft: 'auto',
}
