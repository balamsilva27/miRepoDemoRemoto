import { Outlet, NavLink } from 'react-router-dom'
import './Layout.css'

function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <h2>Attendance</h2>
        </div>
        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Dashboard
          </NavLink>
          <NavLink to="/groups" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Grupos
          </NavLink>
          <NavLink to="/students" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Alumnos
          </NavLink>
          <NavLink to="/attendance" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Asistencia
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout