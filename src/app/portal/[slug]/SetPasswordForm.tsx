'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function SetPasswordForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [btnHovered, setBtnHovered] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      password,
      data: { password_set: true },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.replace(`/portal/${slug}`)
    router.refresh()
  }

  return (
    <div style={pageStyle}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .setpw-card { animation: fadeSlideUp 0.35s ease forwards; }
      `}</style>
      <div style={cardStyle} className="setpw-card">
        <div style={logoMark}>A</div>
        <h1 style={headingStyle}>Create your password</h1>
        <p style={subStyle}>You&apos;ll use this to sign in on future visits.</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            required
            placeholder="New password (min. 8 characters)"
            style={{
              ...inputStyle,
              borderColor: focusedField === 'password' ? '#1a1a1a' : '#d0d0d0',
              boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(26,26,26,0.06)' : 'none',
            }}
            autoFocus
          />
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            onFocus={() => setFocusedField('confirm')}
            onBlur={() => setFocusedField(null)}
            required
            placeholder="Confirm password"
            style={{
              ...inputStyle,
              borderColor: focusedField === 'confirm' ? '#1a1a1a' : '#d0d0d0',
              boxShadow: focusedField === 'confirm' ? '0 0 0 3px rgba(26,26,26,0.06)' : 'none',
            }}
          />
          {error && <p style={errorStyle}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            style={{
              ...btnStyle,
              background: loading ? '#555' : btnHovered ? '#333' : '#1a1a1a',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Saving…' : 'Set password & continue'}
          </button>
        </form>
      </div>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fafafa',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  padding: 24,
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e5e5',
  borderRadius: 14,
  padding: '40px 36px',
  width: '100%',
  maxWidth: 400,
  boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
}

const logoMark: React.CSSProperties = {
  width: 36,
  height: 36,
  background: '#1a1a1a',
  borderRadius: 8,
  color: '#fff',
  fontSize: 16,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
  letterSpacing: '-0.02em',
}

const headingStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  color: '#1a1a1a',
  margin: '0 0 6px',
  letterSpacing: '-0.02em',
}

const subStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#999',
  margin: '0 0 24px',
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: 14,
  border: '1px solid #d0d0d0',
  borderRadius: 8,
  outline: 'none',
  fontFamily: 'system-ui, sans-serif',
  color: '#1a1a1a',
  background: '#fff',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
}

const btnStyle: React.CSSProperties = {
  padding: '11px 14px',
  fontSize: 14,
  fontWeight: 500,
  background: '#1a1a1a',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontFamily: 'system-ui, sans-serif',
  letterSpacing: '-0.01em',
  transition: 'background 0.15s ease, opacity 0.15s ease',
}

const errorStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#ef4444',
  margin: 0,
  background: '#fef2f2',
  borderRadius: 6,
  padding: '8px 12px',
}
