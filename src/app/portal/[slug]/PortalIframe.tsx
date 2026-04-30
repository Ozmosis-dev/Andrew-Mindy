'use client'

export default function PortalIframe({ slug }: { slug: string }) {
  return (
    <iframe
      src={`/api/portal/html/${slug}`}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      title="Brand Guidelines"
    />
  )
}
