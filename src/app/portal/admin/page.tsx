import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import Link from 'next/link'
import ClientsTable from './ClientsTable'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect('/portal/admin/login')
  }

  const service = createServiceClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: clients } = await service
    .from('clients')
    .select('id, name, slug, email, active, created_at, html_storage_path')
    .order('created_at', { ascending: false })

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={h1Style}>Brand Portal</h1>
          <p style={subtitleStyle}>Client management</p>
        </div>
        <Link href="/portal/admin/clients/new" style={newBtnStyle}>
          + New Client
        </Link>
      </header>

      <ClientsTable clients={clients ?? []} />
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#fafafa',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  padding: '40px 48px',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  marginBottom: 32,
}

const h1Style: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 600,
  color: '#1a1a1a',
  margin: 0,
  letterSpacing: '-0.03em',
}

const subtitleStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#888',
  margin: '4px 0 0',
}

const newBtnStyle: React.CSSProperties = {
  padding: '9px 16px',
  background: '#1a1a1a',
  color: '#fff',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  textDecoration: 'none',
  letterSpacing: '-0.01em',
}
