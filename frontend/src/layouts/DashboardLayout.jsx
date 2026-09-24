import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function DashboardLayout() {
  const location = useLocation()

  const titles = {
    '/dashboard': 'Dashboard',
    '/patients': 'Patient Management',
    '/patients/add': 'Add Patient',
    '/reports': 'Medical Reports',
    '/reports/upload': 'Upload Medical Report',
    '/trials': 'Clinical Trials',
    '/analysis': 'AI Analysis',
  }

  const title =
    titles[location.pathname] ||
    (location.pathname.startsWith('/patients/')
      ? 'Patient Details'
      : location.pathname.startsWith('/matches/')
        ? 'Trial Matching'
        : location.pathname.startsWith('/trials/')
          ? 'Trial Details'
          : 'Clinical Trial Platform')

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-area">
        <Topbar title={title} />

        <Outlet />
      </div>
    </div>
  )
}
