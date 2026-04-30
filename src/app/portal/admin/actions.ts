'use server'

import { createClient as createServiceClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

function service() {
  return createServiceClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function checkSlugAvailability(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = service()
  let query = supabase.from('clients').select('id').eq('slug', slug)
  if (excludeId) query = query.neq('id', excludeId)
  const { data } = await query
  return !data || data.length === 0
}

export async function generateSlug(name: string): Promise<string> {
  return slugify(name)
}

export async function createClient(formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const email = formData.get('email') as string
  const driveUrl = formData.get('drive_folder_url') as string
  const active = formData.get('active') === 'true'

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: 'Slug must be lowercase letters, numbers, and hyphens only' }
  }

  const supabase = service()
  const { data, error } = await supabase
    .from('clients')
    .insert({ name, slug, email, drive_folder_url: driveUrl || null, active })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'Slug already taken' }
    return { error: error.message }
  }

  revalidatePath('/portal/admin')
  return { id: data.id }
}

export async function updateClient(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const email = formData.get('email') as string
  const driveUrl = formData.get('drive_folder_url') as string
  const active = formData.get('active') === 'true'

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: 'Slug must be lowercase letters, numbers, and hyphens only' }
  }

  const supabase = service()
  const { error } = await supabase
    .from('clients')
    .update({ name, slug, email, drive_folder_url: driveUrl || null, active })
    .eq('id', id)

  if (error) {
    if (error.code === '23505') return { error: 'Slug already taken' }
    return { error: error.message }
  }

  revalidatePath('/portal/admin')
  revalidatePath(`/portal/admin/clients/${id}`)
  return { success: true }
}

// Returns a signed upload URL so the browser can PUT the file directly to
// Supabase Storage — bypasses Next.js body size limits entirely.
export async function getSignedUploadUrl(slug: string): Promise<{ signedUrl?: string; path?: string; error?: string }> {
  const supabase = service()
  const path = `${slug}/guidelines.html`
  const { data, error } = await supabase.storage
    .from('brand-guidelines')
    .createSignedUploadUrl(path, { upsert: true })
  if (error) return { error: error.message }
  return { signedUrl: data.signedUrl, path }
}

export async function confirmHtmlUpload(id: string, path: string) {
  const supabase = service()
  const { error } = await supabase
    .from('clients')
    .update({ html_storage_path: path })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/portal/admin')
  revalidatePath(`/portal/admin/clients/${id}`)
  return { success: true }
}

export async function generateInviteLink(email: string): Promise<{ link?: string; error?: string }> {
  const supabase = service()
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/portal/auth/callback`

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo },
  })

  if (error) return { error: error.message }
  return { link: data.properties?.action_link }
}

export async function deleteClient(id: string) {
  const supabase = service()
  await supabase.from('clients').delete().eq('id', id)
  revalidatePath('/portal/admin')
}
