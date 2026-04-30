'use client'

export default function PortalIframe({ slug }: { slug: string }) {
  return (
    <iframe
      src={`/api/portal/html/${slug}`}
      style={{
        position: 'absolute',
        top: 52,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: 'calc(100% - 52px)',
        border: 'none',
        display: 'block',
      }}
      title="Brand Guidelines"
    />
  )
}
