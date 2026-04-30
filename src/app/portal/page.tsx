import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export default async function PortalRootPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/portal/admin/login')
  }

  if (session.user.email === process.env.ADMIN_EMAIL) {
    redirect('/portal/admin')
  }

  redirect('/portal/admin/login')
}
