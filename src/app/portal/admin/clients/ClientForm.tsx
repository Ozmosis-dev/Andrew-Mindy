'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  createClient,
  updateClient,
  getSignedUploadUrl,
  confirmHtmlUpload,
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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadMsg, setUploadMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [submitHovered, setSubmitHovered] = useState(false)
  const [cancelHovered, setCancelHovered] = useState(false)
  const [uploadHovered, setUploadHovered] = useState(false)

  useEffect(() => {
    if (isEdit || !name) return
    generateSlug(name).then(s => setSlug(s))
  }, [name, isEdit])

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
    if (!file.name.endsWith('.html')) {
      setUploadMsg('Error: Only .html files allowed')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadMsg('')

    const urlResult = await getSignedUploadUrl(client.slug)
    if (urlResult.error || !urlResult.signedUrl) {
      setUploadMsg(`Error: ${urlResult.error ?? 'Failed to get upload URL'}`)
      setUploading(false)
      return
    }

    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.addEventListener('progress', (ev) => {
          if (ev.lengthComputable) {
            setUploadProgress(Math.round((ev.loaded / ev.total) * 100))
          }
        })
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else reject(new Error(`Upload failed: ${xhr.status}`))
        })
        xhr.addEventListener('error', () => reject(new Error('Network error')))
        xhr.open('PUT', urlResult.signedUrl!)
        xhr.setRequestHeader('Content-Type', 'text/html')
        xhr.send(file)
      })
    } catch (err: unknown) {
      setUploadMsg(`Error: ${err instanceof Error ? err.message : 'Upload failed'}`)
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    const confirmResult = await confirmHtmlUpload(client.id, urlResult.path!)
    setUploading(false)
    setUploadProgress(0)

    if (confirmResult.error) {
      setUploadMsg(`Error: ${confirmResult.error}`)
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

  const inputStyle = (field: string): React.CSSProperties => ({
    padding: '9px 12px',
    fontSize: 14,
    border: '1px solid',
    borderColor: focusedField === field ? '#1a1a1a' : '#d0d0d0',
    borderRadius: 8,
    fontFamily: 'system-ui, sans-serif',
    color: '#1a1a1a',
    outline: 'none',
    background: '#fff',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(26,26,26,0.06)' : 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  })

  return (
    <>
      <style>{`
        .upload-btn-wrap { transition: opacity 0.15s ease; }
        .upload-btn-wrap:hover { opacity: 0.75; }
        .delete-btn { transition: color 0.15s ease, border-color 0.15s ease; }
        .delete-btn:hover { color: #ef4444 !important; border-color: #ef4444 !important; }
      `}</style>

      <div style={formWrap}>
        {isEdit && client && (
          <div style={sectionStyle}>
            <h2 style={sectionTitle}>Brand HTML File</h2>
            <p style={fileStatus}>
              {client.html_storage_path
                ? <><span style={{ color: '#22c55e' }}>✓</span> {client.html_storage_path.split('/').pop()} — uploaded</>
                : 'No file uploaded yet'}
            </p>
            <label style={uploadLabel} className="upload-btn-wrap">
              <input
                ref={fileRef}
                type="file"
                accept=".html"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              <span style={{
                ...uploadBtn,
                background: uploadHovered && !uploading ? '#ebebeb' : '#f5f5f5',
                cursor: uploading ? 'default' : 'pointer',
              }}
                onMouseEnter={() => setUploadHovered(true)}
                onMouseLeave={() => setUploadHovered(false)}
              >
                {uploading ? `Uploading… ${uploadProgress}%` : 'Upload HTML file'}
              </span>
            </label>
            {uploading && (
              <div style={progressTrack}>
                <div style={{ ...progressBar, width: `${uploadProgress}%` }} />
              </div>
            )}
            {uploadMsg && (
              <p style={{
                fontSize: 12, margin: '8px 0 0',
                color: uploadMsg.startsWith('Error') ? '#ef4444' : '#22c55e',
              }}>
                {uploadMsg}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <h2 style={sectionTitle}>{isEdit ? 'Client Details' : 'New Client'}</h2>

          <Field label="Client Name">
            <input
              style={inputStyle('name')}
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              placeholder="Acme Corp"
              required
            />
          </Field>

          <Field label="Slug">
            <input
              style={inputStyle('slug')}
              value={slug}
              onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              onFocus={() => setFocusedField('slug')}
              onBlur={() => setFocusedField(null)}
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
                  : '#aaa',
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
              style={inputStyle('email')}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="client@company.com"
              required
            />
          </Field>

          <Field label="Google Drive Folder URL">
            <input
              style={inputStyle('drive')}
              type="url"
              value={driveUrl}
              onChange={e => setDriveUrl(e.target.value)}
              onFocus={() => setFocusedField('drive')}
              onBlur={() => setFocusedField(null)}
              placeholder="https://drive.google.com/drive/folders/…"
            />
          </Field>

          <Field label="Status">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
              <input
                type="checkbox"
                checked={active}
                onChange={e => setActive(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#1a1a1a', cursor: 'pointer' }}
              />
              <span style={{ color: '#333' }}>Active (portal accessible to client)</span>
            </label>
          </Field>

          {error && <p style={errorStyle}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, marginTop: 8, alignItems: 'center' }}>
            <button
              type="submit"
              disabled={saving || slugState === 'taken' || slugState === 'checking'}
              onMouseEnter={() => setSubmitHovered(true)}
              onMouseLeave={() => setSubmitHovered(false)}
              style={{
                ...submitBtn,
                background: saving ? '#555' : submitHovered ? '#333' : '#1a1a1a',
                opacity: (saving || slugState === 'taken' || slugState === 'checking') ? 0.6 : 1,
              }}
            >
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Client'}
            </button>
            <a
              href="/portal/admin"
              onMouseEnter={() => setCancelHovered(true)}
              onMouseLeave={() => setCancelHovered(false)}
              style={{
                ...cancelLink,
                color: cancelHovered ? '#333' : '#777',
                borderColor: cancelHovered ? '#bbb' : '#e0e0e0',
              }}
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </>
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
  borderRadius: 12,
  padding: 28,
  maxWidth: 520,
  boxShadow: '0 1px 8px rgba(0,0,0,0.03)',
}

const sectionStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e5e5',
  borderRadius: 12,
  padding: 28,
  maxWidth: 520,
  boxShadow: '0 1px 8px rgba(0,0,0,0.03)',
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
  transition: 'background 0.15s ease, opacity 0.15s ease',
}

const cancelLink: React.CSSProperties = {
  padding: '10px 16px',
  color: '#777',
  fontSize: 14,
  textDecoration: 'none',
  borderRadius: 8,
  border: '1px solid #e0e0e0',
  transition: 'color 0.15s ease, border-color 0.15s ease',
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
  transition: 'background 0.15s ease',
}

const progressTrack: React.CSSProperties = {
  marginTop: 8,
  height: 4,
  background: '#e5e5e5',
  borderRadius: 99,
  overflow: 'hidden',
  width: '100%',
}

const progressBar: React.CSSProperties = {
  height: '100%',
  background: '#1a1a1a',
  borderRadius: 99,
  transition: 'width 0.2s ease',
}
