'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function LoginForm({ slug }: { slug: string }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const redirectTo = `${window.location.origin}/portal/auth/callback?next=/portal/${slug}`
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })
    // Always show confirmation — never reveal whether email is registered
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div style={confirmStyle}>
        <p style={{ margin: 0, fontSize: 14, color: '#333' }}>
          Check your email for a sign-in link. It expires in 1 hour.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        placeholder="you@company.com"
        style={inputStyle}
        autoFocus
      />
      <button type="submit" disabled={loading} style={btnStyle}>
        {loading ? 'Sending…' : 'Send sign-in link'}
      </button>
    </form>
  )
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

const confirmStyle: React.CSSProperties = {
  background: '#f5f5f5',
  borderRadius: 8,
  padding: '16px',
}
