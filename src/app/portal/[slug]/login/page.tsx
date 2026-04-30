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
      <div style={cardStyle}>
        <h1 style={headingStyle}>
          Welcome to the<br />
          <span style={{ fontWeight: 700 }}>{client.name}</span> Brand Portal
        </h1>
        <p style={subStyle}>Enter your email to receive a sign-in link.</p>
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
  borderRadius: 12,
  padding: '40px 36px',
  width: '100%',
  maxWidth: 400,
}

const headingStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 400,
  color: '#1a1a1a',
  margin: '0 0 10px',
  lineHeight: 1.35,
  letterSpacing: '-0.02em',
}

const subStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#777',
  margin: '0 0 28px',
}
