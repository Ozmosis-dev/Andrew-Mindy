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

  const activeCount = (clients ?? []).filter(c => c.active).length

  return (
    <div style={pageStyle}>
      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .admin-header { animation: fadeDown 0.3s ease forwards; }
        .new-btn { transition: background 0.15s ease; }
        .new-btn:hover { background: #333 !important; }
        .signout-btn { transition: color 0.15s ease; }
        .signout-btn:hover { color: #1a1a1a !important; }
      `}</style>

      <header style={headerStyle} className="admin-header">
        <div>
          <h1 style={h1Style}>Brand Portal</h1>
          <p style={subtitleStyle}>
            {(clients ?? []).length} client{(clients ?? []).length !== 1 ? 's' : ''} · {activeCount} active
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <form action="/portal/auth/signout" method="POST">
            <button type="submit" style={signoutBtn} className="signout-btn">Sign out</button>
          </form>
          <Link href="/portal/admin/clients/new" style={newBtnStyle} className="new-btn">
            + New Client
          </Link>
        </div>
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

const signoutBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#bbb',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'system-ui, sans-serif',
  padding: '9px 4px',
}
