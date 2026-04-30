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
      <div style={tableWrap}>
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
              <tr key={client.id} style={trStyle}>
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
                  <Link href={`/portal/admin/clients/${client.id}`} style={actionLink}>Edit</Link>
                  <a href={`/portal/${client.slug}`} target="_blank" rel="noopener noreferrer" style={actionLink}>Preview</a>
                  <button
                    onClick={() => handleInvite(client)}
                    disabled={loadingId === client.id}
                    style={actionBtn}
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
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h2 style={modalTitle}>Magic Link for {inviteModal.email}</h2>
            <p style={modalSub}>Copy this link and send it to your client. It expires in 24 hours.</p>
            <div style={linkBox}>
              <span style={{ fontSize: 12, color: '#555', wordBreak: 'break-all', flex: 1 }}>
                {inviteModal.link}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={copyLink} style={copyBtn}>
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <a href={mailtoHref} style={mailtoBtn}>Send via Email</a>
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

const actionLink: React.CSSProperties = {
  color: '#555',
  fontSize: 12,
  textDecoration: 'none',
  marginRight: 12,
  fontWeight: 500,
}

const actionBtn: React.CSSProperties = {
  background: 'none',
  border: '1px solid #d0d0d0',
  borderRadius: 6,
  padding: '4px 10px',
  fontSize: 12,
  cursor: 'pointer',
  fontFamily: 'system-ui, sans-serif',
  color: '#333',
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
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
}

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: '32px',
  maxWidth: 520,
  width: '90%',
}

const modalTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: '#1a1a1a',
  margin: '0 0 8px',
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
}
