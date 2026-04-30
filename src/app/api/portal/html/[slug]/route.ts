import { createServerClient } from '@supabase/ssr'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Verify session
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

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Fetch client via service role (bypasses RLS for admin check)
  const service = createServiceClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: client } = await service
    .from('clients')
    .select('email, active, html_storage_path')
    .eq('slug', slug)
    .single()

  if (!client) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Allow admin to preview any client; otherwise enforce email match
  const isAdmin = session.user.email === process.env.ADMIN_EMAIL
  if (!isAdmin && session.user.email !== client.email) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  if (!client.active && !isAdmin) {
    return new NextResponse('Portal unavailable', { status: 403 })
  }

  if (!client.html_storage_path) {
    return new NextResponse('No brand file uploaded yet', { status: 404 })
  }

  // Generate signed URL and fetch HTML content
  const { data: signedData, error: signError } = await service.storage
    .from('brand-guidelines')
    .createSignedUrl(client.html_storage_path, 300) // 5 min is enough for a server fetch

  if (signError || !signedData?.signedUrl) {
    return new NextResponse('Failed to generate file URL', { status: 500 })
  }

  const htmlRes = await fetch(signedData.signedUrl)
  if (!htmlRes.ok) {
    return new NextResponse('Failed to fetch brand file', { status: 500 })
  }

  const html = await htmlRes.text()

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
    },
  })
}
