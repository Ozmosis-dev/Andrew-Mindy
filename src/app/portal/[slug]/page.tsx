import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import PortalIframe from './PortalIframe'

type Props = { params: Promise<{ slug: string }> }

export default async function PortalPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/portal/${slug}/login`)
  }

  const service = createServiceClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: client } = await service
    .from('clients')
    .select('name, email, drive_folder_url, active, html_storage_path')
    .eq('slug', slug)
    .single()

  if (!client) notFound()

  const isAdmin = session.user.email === process.env.ADMIN_EMAIL

  if (!client.active && !isAdmin) {
    return (
      <div style={centerStyle}>
        <p style={{ color: '#666', fontSize: 15 }}>This portal is currently unavailable.</p>
      </div>
    )
  }

  if (!isAdmin && session.user.email !== client.email) {
    return (
      <div style={centerStyle}>
        <p style={{ color: '#666', fontSize: 15 }}>You don&apos;t have access to this page.</p>
        <form action="/portal/auth/signout" method="POST">
          <button style={linkBtn} type="submit">Sign out</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      <PortalIframe slug={slug} />
      <FloatingHeader
        name={client.name}
        driveUrl={client.drive_folder_url}
      />
    </div>
  )
}

function FloatingHeader({ name, driveUrl }: { name: string; driveUrl: string | null }) {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: 'rgba(255,255,255,0.72)',
      borderBottom: '1px solid rgba(0,0,0,0.07)',
    }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', letterSpacing: '-0.01em', fontFamily: 'system-ui, sans-serif' }}>
        {name}
      </span>
      {driveUrl && (
        <a
          href={driveUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: '#1a1a1a',
            textDecoration: 'none',
            padding: '6px 12px',
            border: '1px solid rgba(0,0,0,0.15)',
            borderRadius: 6,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.01em',
          }}
        >
          Download Assets →
        </a>
      )}
    </header>
  )
}

const centerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  fontFamily: 'system-ui, sans-serif',
}

const linkBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#666',
  fontSize: 13,
  cursor: 'pointer',
  textDecoration: 'underline',
}
