import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/portal'

  if (code) {
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
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Client portal routes get a first_login flag so the portal page can
      // prompt password creation before showing brand content.
      const isClientPortal =
        next.startsWith('/portal/') &&
        !next.startsWith('/portal/admin') &&
        !next.startsWith('/portal/auth')

      const redirectUrl = isClientPortal
        ? `${origin}${next}?first_login=1`
        : `${origin}${next}`

      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.redirect(`${origin}/portal/admin/login?error=auth_failed`)
}
