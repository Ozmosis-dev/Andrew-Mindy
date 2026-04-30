'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function LoginForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [btnHovered, setBtnHovered] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Incorrect email or password.')
      return
    }
    router.push(`/portal/${slug}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField(null)}
        required
        placeholder="you@company.com"
        style={{
          ...inputStyle,
          borderColor: focusedField === 'email' ? '#1a1a1a' : '#d0d0d0',
          boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(26,26,26,0.06)' : 'none',
        }}
        autoFocus
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onFocus={() => setFocusedField('password')}
        onBlur={() => setFocusedField(null)}
        required
        placeholder="Password"
        style={{
          ...inputStyle,
          borderColor: focusedField === 'password' ? '#1a1a1a' : '#d0d0d0',
          boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(26,26,26,0.06)' : 'none',
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
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
      <p style={hintStyle}>
        First time? Your account manager will send you a sign-in link to get started.
      </p>
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

const hintStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#aaa',
  margin: '4px 0 0',
  textAlign: 'center',
}
