'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/portal/auth/callback`
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div style={confirmStyle}>
        <div style={{ fontSize: 22, marginBottom: 8 }}>✉️</div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
          Check your email
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#888' }}>
          Sign-in link sent to {email}
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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
        placeholder="you@example.com"
        style={{
          ...inputStyle,
          borderColor: focused ? '#1a1a1a' : '#d0d0d0',
          boxShadow: focused ? '0 0 0 3px rgba(26,26,26,0.06)' : 'none',
        }}
        autoFocus
      />
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
  transition: 'background 0.15s ease, opacity 0.15s ease',
}

const confirmStyle: React.CSSProperties = {
  background: '#f5f5f5',
  borderRadius: 10,
  padding: '24px',
  textAlign: 'center',
}
