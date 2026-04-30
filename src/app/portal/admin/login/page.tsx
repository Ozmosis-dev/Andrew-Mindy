import AdminLoginForm from './AdminLoginForm'

export default function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Portal Admin</h1>
        <p style={subStyle}>Enter your email to receive a sign-in link.</p>
        <AdminLoginForm />
      </div>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fafafa',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  padding: 24,
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e5e5',
  borderRadius: 12,
  padding: '40px 36px',
  width: '100%',
  maxWidth: 380,
}

const headingStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  color: '#1a1a1a',
  margin: '0 0 8px',
  letterSpacing: '-0.03em',
}

const subStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#777',
  margin: '0 0 28px',
}
