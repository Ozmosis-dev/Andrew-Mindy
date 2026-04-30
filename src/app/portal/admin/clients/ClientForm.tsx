'use client'

import { useState, useEffect, useTransition, FormEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  createClient,
  updateClient,
  uploadHtml,
  checkSlugAvailability,
  generateSlug,
} from '../actions'

type Client = {
  id: string
  name: string
  slug: string
  email: string
  drive_folder_url: string | null
  active: boolean
  html_storage_path: string | null
  created_at: string
}

export default function ClientForm({ client }: { client?: Client }) {
  const router = useRouter()
  const isEdit = !!client

  const [name, setName] = useState(client?.name ?? '')
  const [slug, setSlug] = useState(client?.slug ?? '')
  const [email, setEmail] = useState(client?.email ?? '')
  const [driveUrl, setDriveUrl] = useState(client?.drive_folder_url ?? '')
  const [active, setActive] = useState(client?.active ?? true)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [slugChecking, setSlugChecking] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Auto-generate slug from name (new clients only)
  useEffect(() => {
    if (isEdit || !name) return
    generateSlug(name).then(s => setSlug(s))
  }, [name, isEdit])

  // Debounced slug availability check
  useEffect(() => {
    if (!slug) { setSlugAvailable(null); return }
    if (isEdit && slug === client?.slug) { setSlugAvailable(true); return }

    const timer = setTimeout(async () => {
      setSlugChecking(true)
      const available = await checkSlugAvailability(slug, client?.id)
      setSlugAvailable(available)
      setSlugChecking(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [slug, isEdit, client?.id, client?.slug])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const fd = new FormData()
    fd.append('name', name)
    fd.append('slug', slug)
    fd.append('email', email)
    fd.append('drive_folder_url', driveUrl)
    fd.append('active', String(active))

    const result = isEdit
      ? await updateClient(client!.id, fd)
      : await createClient(fd)

    setSaving(false)

    if ('error' in result && result.error) {
      setError(result.error)
      return
    }

    const id = isEdit ? client!.id : (result as { id: string }).id
    router.push(`/portal/admin/clients/${id}`)
    router.refresh()
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !client) return
    setUploading(true)
    setUploadMsg('')

    const fd = new FormData()
    fd.append('html', file)

    const result = await uploadHtml(client.id, client.slug, fd)
    setUploading(false)

    if (result.error) {
      setUploadMsg(`Error: ${result.error}`)
    } else {
      setUploadMsg('Uploaded successfully')
      router.refresh()
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const slugState = slugChecking
    ? 'checking'
    : slug
    ? slugAvailable === true
      ? 'available'
      : slugAvailable === false
      ? 'taken'
      : 'idle'
    : 'idle'

  return (
    <div style={formWrap}>
      {isEdit && client && (
        <div style={sectionStyle}>
          <h2 style={sectionTitle}>Brand HTML File</h2>
          <p style={fileStatus}>
            {client.html_storage_path
              ? `✓ ${client.html_storage_path.split('/').pop()} — uploaded`
              : 'No file uploaded yet'}
          </p>
          <label style={uploadLabel}>
            <input
              ref={fileRef}
              type="file"
              accept=".html"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            <span style={uploadBtn}>{uploading ? 'Uploading…' : 'Upload HTML file'}</span>
          </label>
          {uploadMsg && (
            <p style={{ fontSize: 12, margin: '8px 0 0', color: uploadMsg.startsWith('Error') ? '#ef4444' : '#22c55e' }}>
              {uploadMsg}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={sectionTitle}>{isEdit ? 'Client Details' : 'New Client'}</h2>

        <Field label="Client Name">
          <input
            style={inputStyle}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Acme Corp"
            required
          />
        </Field>

        <Field label="Slug">
          <input
            style={inputStyle}
            value={slug}
            onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="acme-corp"
            pattern="^[a-z0-9-]+$"
            required
          />
          <div style={{ fontSize: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#999' }}>
              andrewmindy.com/portal/{slug || '…'}
            </span>
            <span style={{
              color: slugState === 'available' ? '#22c55e'
                : slugState === 'taken' ? '#ef4444'
                : '#aaa'
            }}>
              {slugState === 'checking' ? 'checking…'
                : slugState === 'available' ? '✓ available'
                : slugState === 'taken' ? '✗ taken'
                : ''}
            </span>
          </div>
        </Field>

        <Field label="Client Email">
          <input
            style={inputStyle}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="client@company.com"
            required
          />
        </Field>

        <Field label="Google Drive Folder URL">
          <input
            style={inputStyle}
            type="url"
            value={driveUrl}
            onChange={e => setDriveUrl(e.target.value)}
            placeholder="https://drive.google.com/drive/folders/…"
          />
        </Field>

        <Field label="Status">
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
            <input
              type="checkbox"
              checked={active}
              onChange={e => setActive(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <span style={{ color: '#333' }}>Active (portal accessible to client)</span>
          </label>
        </Field>

        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button
            type="submit"
            disabled={saving || slugState === 'taken' || slugState === 'checking'}
            style={submitBtn}
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Client'}
          </button>
          <a href="/portal/admin" style={cancelLink}>Cancel</a>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

const formWrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  background: '#fff',
  border: '1px solid #e5e5e5',
  borderRadius: 10,
  padding: 28,
  maxWidth: 520,
}

const sectionStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e5e5',
  borderRadius: 10,
  padding: 28,
  maxWidth: 520,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: '#1a1a1a',
  margin: '0 0 16px',
  letterSpacing: '-0.02em',
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: '#555',
}

const inputStyle: React.CSSProperties = {
  padding: '9px 12px',
  fontSize: 14,
  border: '1px solid #d0d0d0',
  borderRadius: 8,
  fontFamily: 'system-ui, sans-serif',
  color: '#1a1a1a',
  outline: 'none',
}

const errorStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#ef4444',
  margin: 0,
  background: '#fef2f2',
  borderRadius: 6,
  padding: '8px 12px',
}

const submitBtn: React.CSSProperties = {
  padding: '10px 20px',
  background: '#1a1a1a',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'system-ui, sans-serif',
}

const cancelLink: React.CSSProperties = {
  padding: '10px 16px',
  color: '#777',
  fontSize: 14,
  textDecoration: 'none',
  borderRadius: 8,
  border: '1px solid #e0e0e0',
}

const fileStatus: React.CSSProperties = {
  fontSize: 13,
  color: '#555',
  margin: '0 0 12px',
}

const uploadLabel: React.CSSProperties = {
  cursor: 'pointer',
  display: 'inline-block',
}

const uploadBtn: React.CSSProperties = {
  display: 'inline-block',
  padding: '8px 16px',
  background: '#f5f5f5',
  border: '1px solid #d0d0d0',
  borderRadius: 8,
  fontSize: 13,
  color: '#333',
  fontFamily: 'system-ui, sans-serif',
  cursor: 'pointer',
}
