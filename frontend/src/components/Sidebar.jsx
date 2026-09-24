import { NavLink, useNavigate } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  ClipboardList,
  FileHeart,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Users,
} from 'lucide-react'

const mainLinks = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Patients',
    path: '/patients',
    icon: Users,
  },
  {
    label: 'Medical Reports',
    path: '/reports',
    icon: FileHeart,
  },
  {
    label: 'Clinical Trials',
    path: '/trials',
    icon: FlaskConical,
  },
]

export default function Sidebar() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('clinicalTrialAuth')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">
          <Activity size={23} />
        </div>

        <div>
          <div style={{ fontWeight: 850, fontSize: 15 }}>
            TrialMatch
          </div>

          <div style={{ fontSize: 10, color: '#8191a8' }}>
            AI Clinical Platform
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">
          Workspace
        </div>

        {mainLinks.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}

        <div className="nav-section-title" style={{ marginTop: 15 }}>
          Intelligence
        </div>

        <NavLink
          to="/matches/1"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <BarChart3 size={18} />
          <span>Trial Matching</span>
        </NavLink>

        <NavLink
          to="/analysis"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <ClipboardList size={18} />
          <span>AI Analysis</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="avatar">AB</div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: '#fff',
              }}
            >
              Clinical Admin
            </div>

            <div
              style={{
                fontSize: 10,
                color: '#718096',
                marginTop: 2,
              }}
            >
              Administrator
            </div>
          </div>

          <button
            onClick={logout}
            title="Logout"
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 0,
              color: '#7f91a8',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
