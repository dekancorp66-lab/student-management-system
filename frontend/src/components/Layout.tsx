import { useState } from 'react';
import type { FormEvent } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, GraduationCap, LayoutDashboard, Menu, Plus, Search, Settings, UsersRound, X } from 'lucide-react';

const titles: Record<string, string> = { '/': 'Welcome, Admin', '/students': 'Students', '/students/new': 'Add student' };

export function Layout() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = titles[pathname] ?? 'Student profile';
  const close = () => setOpen(false);
  const linkClass = ({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'active' : ''}`;

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/students?search=${encodeURIComponent(query)}` : '/students');
  }

  return (
    <div className="app-layout">
      <button className="menu-toggle" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={close} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <NavLink to="/" className="sidebar-brand" onClick={close}>
          <span className="sidebar-logo"><GraduationCap size={22} /></span>
          <span className="sidebar-title">SRMS</span>
        </NavLink>
        <ul className="nav-links">
          <li><NavLink to="/" end className={linkClass} onClick={close}><LayoutDashboard size={18} /> Dashboard</NavLink></li>
          <li><NavLink to="/students" end className={linkClass} onClick={close}><UsersRound size={18} /> Students</NavLink></li>
          <li><NavLink to="/students/new" className={linkClass} onClick={close}><Plus size={18} /> Add student</NavLink></li>
        </ul>
        <div className="sidebar-user">
          <span className="avatar avatar-admin">SA</span>
          <strong>Student Admin</strong>
          <small>Records manager</small>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <h1 className="topbar-title">{title}</h1>
          <form className="topbar-search" onSubmit={handleSearch}>
            <Search size={16} aria-hidden="true" />
            <input aria-label="Search students" placeholder="Search students" value={search} onChange={(e) => setSearch(e.target.value)} />
          </form>
          <button className="icon-btn" type="button" aria-label="Notifications"><Bell size={17} /><span className="notification-dot" /></button>
          <button className="icon-btn" type="button" aria-label="Settings"><Settings size={17} /></button>
          <div className="account"><span className="avatar avatar-admin" style={{ width: 38, height: 38, fontSize: '0.8rem' }}>SA</span><span>Admin</span></div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}
