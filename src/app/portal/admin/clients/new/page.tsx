import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import ClientForm from '../ClientForm'

export default async function NewClientPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect('/portal/admin/login')
  }

  return (
    <div style={pageStyle}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/portal/admin" style={backLink}>← Admin</Link>
        <h1 style={h1Style}>New Client</h1>
      </div>
      <ClientForm />
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#fafafa',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  padding: '40px 48px',
}

const backLink: React.CSSProperties = {
  fontSize: 13,
  color: '#999',
  textDecoration: 'none',
  display: 'block',
  marginBottom: 8,
}

const h1Style: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  color: '#1a1a1a',
  margin: 0,
  letterSpacing: '-0.03em',
}
