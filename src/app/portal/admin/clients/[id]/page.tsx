import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import Link from 'next/link'
import ClientForm from '../ClientForm'

type Props = { params: Promise<{ id: string }> }

export default async function EditClientPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect('/portal/admin/login')
  }

  const service = createServiceClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: client } = await service
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (!client) notFound()

  return (
    <div style={pageStyle}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/portal/admin" style={backLink}>← Admin</Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={h1Style}>{client.name}</h1>
          <a
            href={`/portal/${client.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={previewLink}
          >
            Preview portal →
          </a>
        </div>
      </div>
      <ClientForm client={client} />
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

const previewLink: React.CSSProperties = {
  fontSize: 13,
  color: '#555',
  textDecoration: 'none',
  padding: '6px 12px',
  border: '1px solid #e0e0e0',
  borderRadius: 6,
}
