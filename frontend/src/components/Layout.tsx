import { useState } from 'react';
import type { FormEvent } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, GraduationCap, LayoutDashboard, Menu, Plus, Search, UsersRound, X } from 'lucide-react';

export function Layout() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/students?search=${encodeURIComponent(query)}` : '/students');
  }

  return (
    <div className="app-layout">
      <button className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close menu' : 'Open menu'}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div
        className={`sidebar-overlay ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
      />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <NavLink to="/" className="sidebar-brand" onClick={() => setOpen(false)}>
          <span className="sidebar-logo"><GraduationCap size={27} strokeWidth={1.8} /></span>
          <span className="sidebar-title">SRMS</span>
          <span className="sidebar-subtitle">Student Records<br />Management System</span>
        </NavLink>
        <div className="nav-caption">Workspace</div>
        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard size={17} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/students"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <UsersRound size={17} /> Students
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/students/new"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Plus size={17} /> Add student
            </NavLink>
          </li>
          </ul>
        <div className="sidebar-bottom">
          <span className="sidebar-status-dot" />
          <span>Records system online</span>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <form className="topbar-search" onSubmit={handleSearch}>
            <Search size={16} aria-hidden="true" />
            <input
              aria-label="Search students"
              placeholder="Search students..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <kbd>ENTER</kbd>
          </form>
          <div className="topbar-account">
            <button className="notification-button" type="button" aria-label="Notifications">
              <Bell size={18} />
              <span className="notification-dot" />
            </button>
            <span className="account-avatar">SA</span>
            <span className="account-copy"><strong>Student Admin</strong><small>Records manager</small></span>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}
