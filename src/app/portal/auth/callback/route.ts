import { createServerClient } from '@supabase/ssr'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/portal/admin/login?error=auth_failed`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !session) {
    return NextResponse.redirect(`${origin}/portal/admin/login?error=auth_failed`)
  }

  const email = session.user.email

  if (!email) {
    return NextResponse.redirect(`${origin}/portal/admin/login?error=auth_failed`)
  }

  // Admin → go straight to admin dashboard
  if (email === process.env.ADMIN_EMAIL) {
    return NextResponse.redirect(`${origin}/portal/admin`)
  }

  // Client → look up their slug and send to portal with first_login flag
  const service = createServiceClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: client } = await service
    .from('clients')
    .select('slug')
    .eq('email', email)
    .single()

  if (client?.slug) {
    return NextResponse.redirect(`${origin}/portal/${client.slug}?first_login=1`)
  }

  // Unknown email — back to login
  return NextResponse.redirect(`${origin}/portal/admin/login`)
}
