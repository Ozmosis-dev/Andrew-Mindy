import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import PortalIframe from './PortalIframe'
import PortalHeader from './PortalHeader'
import SetPasswordForm from './SetPasswordForm'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ first_login?: string }>
}

export default async function PortalPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { first_login } = await searchParams

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
        <p style={{ color: '#888', fontSize: 14 }}>This portal is currently unavailable.</p>
      </div>
    )
  }

  if (!isAdmin && session.user.email !== client.email) {
    return (
      <div style={centerStyle}>
        <p style={{ color: '#888', fontSize: 14 }}>You don&apos;t have access to this page.</p>
        <form action="/portal/auth/signout" method="POST">
          <button style={linkBtn} type="submit">Sign out</button>
        </form>
      </div>
    )
  }

  const needsPassword =
    !isAdmin &&
    first_login === '1' &&
    !session.user.user_metadata?.password_set

  if (needsPassword) {
    return <SetPasswordForm slug={slug} />
  }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      <PortalHeader name={client.name} driveUrl={client.drive_folder_url} />
      <PortalIframe slug={slug} />
    </div>
  )
}

const centerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  background: '#fafafa',
}

const linkBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#999',
  fontSize: 13,
  cursor: 'pointer',
  textDecoration: 'underline',
}
