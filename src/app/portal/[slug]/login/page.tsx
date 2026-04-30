import { notFound } from 'next/navigation'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import LoginForm from '../LoginForm'

type Props = { params: Promise<{ slug: string }> }

export default async function PortalLoginPage({ params }: Props) {
  const { slug } = await params

  const service = createServiceClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: client } = await service
    .from('clients')
    .select('name, active')
    .eq('slug', slug)
    .single()

  if (!client || !client.active) notFound()

  return (
    <div style={pageStyle}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: fadeSlideUp 0.35s ease forwards; }
      `}</style>
      <div style={cardStyle} className="login-card">
        <div style={logoMark}>A</div>
        <h1 style={headingStyle}>
          {client.name}
        </h1>
        <p style={subStyle}>Brand Portal — sign in to continue</p>
        <LoginForm slug={slug} />
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
  lineHeight: 1.3,
  letterSpacing: '-0.03em',
}

const subStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#999',
  margin: '0 0 28px',
}
