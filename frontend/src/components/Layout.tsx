import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-layout">
      <button className="menu-toggle" onClick={() => setOpen(true)} aria-label="Open menu">
        ☰
      </button>
      <div
        className={`sidebar-overlay ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
      />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">SM</div>
          <div>
            <div className="sidebar-title">Student Mgmt</div>
            <div className="sidebar-subtitle">Admin Dashboard</div>
          </div>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span className="nav-icon">📊</span> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/students"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span className="nav-icon">👥</span> Students
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/students/new"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span className="nav-icon">➕</span> Add Student
            </NavLink>
          </li>
        </ul>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
