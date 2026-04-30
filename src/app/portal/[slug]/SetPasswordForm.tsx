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

    // Set password and mark metadata so future logins skip this prompt
    const { error } = await supabase.auth.updateUser({
      password,
      data: { password_set: true },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // Replace URL to strip first_login param before entering portal
    router.replace(`/portal/${slug}`)
    router.refresh()
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Create your password</h1>
        <p style={subStyle}>You&apos;ll use this to sign in on future visits.</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="New password (min. 8 characters)"
            style={inputStyle}
            autoFocus
          />
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            placeholder="Confirm password"
            style={inputStyle}
          />
          {error && <p style={errorStyle}>{error}</p>}
          <button type="submit" disabled={loading} style={btnStyle}>
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
  borderRadius: 12,
  padding: '40px 36px',
  width: '100%',
  maxWidth: 400,
}

const headingStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  color: '#1a1a1a',
  margin: '0 0 10px',
  letterSpacing: '-0.02em',
}

const subStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#777',
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
}

const errorStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#ef4444',
  margin: 0,
  background: '#fef2f2',
  borderRadius: 6,
  padding: '8px 12px',
}
