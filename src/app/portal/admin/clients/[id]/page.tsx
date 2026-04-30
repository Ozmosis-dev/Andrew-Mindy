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
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .client-page { animation: fadeUp 0.3s ease forwards; }
        .back-link { transition: color 0.15s ease; }
        .back-link:hover { color: #1a1a1a !important; }
        .preview-link {
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        }
        .preview-link:hover {
          background: #1a1a1a !important;
          border-color: #1a1a1a !important;
          color: #fff !important;
        }
      `}</style>
      <div style={{ marginBottom: 28 }} className="client-page">
        <Link href="/portal/admin" style={backLink} className="back-link">← All clients</Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <div>
            <h1 style={h1Style}>{client.name}</h1>
            <p style={slugLine}>andrewmindy.com/portal/{client.slug}</p>
          </div>
          <a
            href={`/portal/${client.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={previewLink}
            className="preview-link"
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
  color: '#aaa',
  textDecoration: 'none',
  display: 'inline-block',
}

const h1Style: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  color: '#1a1a1a',
  margin: 0,
  letterSpacing: '-0.03em',
}

const slugLine: React.CSSProperties = {
  fontSize: 12,
  color: '#aaa',
  margin: '3px 0 0',
  fontFamily: 'monospace',
}

const previewLink: React.CSSProperties = {
  fontSize: 13,
  color: '#1a1a1a',
  textDecoration: 'none',
  padding: '7px 14px',
  border: '1px solid rgba(0,0,0,0.18)',
  borderRadius: 7,
  fontWeight: 500,
  letterSpacing: '0.01em',
}
