import AdminLoginForm from './AdminLoginForm'

export default function AdminLoginPage() {
  return (
    <div style={pageStyle}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .admin-login-card { animation: fadeSlideUp 0.35s ease forwards; }
      `}</style>
      <div style={cardStyle} className="admin-login-card">
        <div style={logoMark}>A</div>
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
  borderRadius: 14,
  padding: '40px 36px',
  width: '100%',
  maxWidth: 380,
  boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
}

const logoMark: React.CSSProperties = {
  width: 36,
  height: 36,
  background: '#1a1a1a',
  borderRadius: 8,
  color: '#fff',
  fontSize: 16,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
  letterSpacing: '-0.02em',
}

const headingStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  color: '#1a1a1a',
  margin: '0 0 6px',
  letterSpacing: '-0.03em',
}

const subStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#999',
  margin: '0 0 28px',
}
