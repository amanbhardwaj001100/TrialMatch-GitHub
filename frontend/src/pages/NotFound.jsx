import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f5f8fc',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          className="brand-mark"
          style={{
            margin: '0 auto',
          }}
        >
          <Compass size={23} />
        </div>

        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#172033',
            letterSpacing: '-.06em',
            marginTop: 15,
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 850,
          }}
        >
          Page not found
        </h1>

        <p
          style={{
            color: '#94a3b8',
            fontSize: 12,
            marginTop: 7,
          }}
        >
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/dashboard"
          className="btn btn-primary"
          style={{ marginTop: 20 }}
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </Link>
      </div>
    </main>
  )
}
