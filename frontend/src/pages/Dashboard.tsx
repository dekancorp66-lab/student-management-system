import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronLeft, ChevronRight, Eye, Mail, Pencil, UserRound, UsersRound } from 'lucide-react';
import { fetchDashboard } from '../api';
import { Avatar } from '../components/Avatar';
import type { DashboardStats, Student } from '../types';

const COLORS = { male: '#2456c9', female: '#2f9e44', other: '#e0a20f' };

function Ring({ stats }: { stats: DashboardStats }) {
  const r = 78, c = 2 * Math.PI * r, total = stats.total_students;
  const parts = [
    { n: stats.male_count, color: COLORS.male },
    { n: stats.female_count, color: COLORS.female },
    { n: stats.other_count, color: COLORS.other },
  ];
  let offset = 0;
  return (
    <div className="ring">
      <svg viewBox="0 0 190 190" role="img" aria-label="Students by gender">
        <circle cx="95" cy="95" r={r} fill="none" stroke="#dfe6f4" strokeWidth="16" />
        {total > 0 && parts.map((p, i) => {
          const len = (p.n / total) * c;
          const el = p.n > 0 && (
            <circle key={i} cx="95" cy="95" r={r} fill="none" stroke={p.color} strokeWidth="16"
              strokeDasharray={`${Math.max(len - 3, 0)} ${c}`} strokeDashoffset={-offset} strokeLinecap="round" />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="ring-center"><strong>{total}</strong><span>students</span></div>
    </div>
  );
}

function Calendar({ students }: { students: Student[] }) {
  const [shift, setShift] = useState(0);
  const now = new Date();
  const view = new Date(now.getFullYear(), now.getMonth() + shift, 1);
  const y = view.getFullYear(), m = view.getMonth();
  const lead = (new Date(y, m, 1).getDay() + 6) % 7; // Monday first
  const days = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();
  const registered = new Set(students.map((s) => { const d = new Date(s.date_registered); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }));
  const cells: { label: number; cls: string }[] = [];
  for (let i = lead; i > 0; i--) cells.push({ label: prevDays - i + 1, cls: 'dim' });
  for (let d = 1; d <= days; d++) {
    const isToday = d === now.getDate() && m === now.getMonth() && y === now.getFullYear();
    cells.push({ label: d, cls: isToday ? 'today' : registered.has(`${y}-${m}-${d}`) ? 'has' : '' });
  }
  for (let d = 1; cells.length % 7 !== 0; d++) cells.push({ label: d, cls: 'dim' });
  return (
    <div className="cal-card">
      <div className="cal-head">
        <button onClick={() => setShift((s) => s - 1)} aria-label="Previous month"><ChevronLeft size={16} /></button>
        <span>{view.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => setShift((s) => s + 1)} aria-label="Next month"><ChevronRight size={16} /></button>
      </div>
      <div className="cal-grid">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => <span key={d} className="cal-dow">{d}</span>)}
        {cells.map((c, i) => <span key={i} className={`cal-day ${c.cls}`}>{c.label}</span>)}
      </div>
      <div className="cal-legend">
        <span><i style={{ background: '#2456c9' }} />Registration</span>
        <span><i style={{ background: '#1a1f4d' }} />Today</span>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard().then(setStats).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center">Loading dashboard…</div>;
  if (error || !stats) return <div className="empty-state">Failed to load: {error}</div>;

  const total = stats.total_students;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  const recent = stats.recent_students;
  const latest = recent[0];
  const rows = [
    { key: 'male', label: 'Male students', n: stats.male_count },
    { key: 'female', label: 'Female students', n: stats.female_count },
    { key: 'other', label: 'Other', n: stats.other_count },
  ] as const;
  const fmt = (d: string, o: Intl.DateTimeFormatOptions) => new Date(d).toLocaleDateString(undefined, o);

  return (
    <div className="dash">
      <div className="dash-main">
        <section className="stat-row" aria-label="Student statistics">
          <div className="stat-card"><span className="stat-icon navy"><UsersRound size={19} /></span><div><div className="stat-label">Total students</div><div className="stat-value">{total}</div></div></div>
          <div className="stat-card"><span className="stat-icon blue"><UserRound size={19} /></span><div><div className="stat-label">Male</div><div className="stat-value">{stats.male_count}</div></div></div>
          <div className="stat-card"><span className="stat-icon green"><UserRound size={19} /></span><div><div className="stat-label">Female</div><div className="stat-value">{stats.female_count}</div></div></div>
          <div className="stat-card"><span className="stat-icon yellow"><UsersRound size={19} /></span><div><div className="stat-label">Other</div><div className="stat-value">{stats.other_count}</div></div></div>
        </section>

        <section className="mid-row">
          <div>
            <h2 className="section-title">Gender split</h2>
            <Ring stats={stats} />
            <div className="latest-card">
              {latest ? (<>Last registered<strong>{latest.full_name}</strong>{fmt(latest.date_registered, { day: 'numeric', month: 'long', year: 'numeric' })}</>) : 'No students registered yet'}
            </div>
          </div>
          <div>
            <h2 className="section-title">Breakdown</h2>
            <div className="breakdown">
              {rows.map((r) => (
                <div className="breakdown-item" key={r.key}>
                  <span className={`avatar avatar-${r.key}`}><UserRound size={18} /></span>
                  <div className="breakdown-body">
                    <div className="breakdown-top"><span>{r.label}</span><span>{pct(r.n)}%</span></div>
                    <div className="breakdown-sub">{r.n} {r.n === 1 ? 'student' : 'students'}</div>
                    <div className="track"><span className={`fill-${r.key}`} style={{ width: `${pct(r.n)}%` }} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="promo">
            <h3>Add a new student</h3>
            <p>Create a record with contact details, course and year of study.</p>
            <Link to="/students/new" className="btn btn-accent btn-sm">Add student</Link>
            <span className="promo-hex" /><span className="promo-hex two" />
          </div>
        </section>

        <section>
          <h2 className="section-title">Recently added</h2>
          {recent.length === 0 ? (
            <div className="card card-body empty-state">No students yet. <Link to="/students/new" style={{ color: 'var(--blue)', fontWeight: 600 }}>Add the first one</Link>.</div>
          ) : (
            <div className="profile-row">
              {recent.slice(0, 3).map((s) => (
                <article className="profile-card" key={s.id}>
                  <Avatar name={s.full_name} gender={s.gender} large />
                  <h3>{s.full_name}</h3>
                  <p className="sub">{s.course}</p>
                  <div className="profile-stats">
                    <div><strong className="c-red">{s.id}</strong><small>ID</small></div>
                    <div><strong className="c-blue">{s.year_of_study}</strong><small>Year</small></div>
                    <div><strong className="c-green">{fmt(s.date_registered, { day: 'numeric', month: 'short' })}</strong><small>Registered</small></div>
                  </div>
                  <div className="profile-actions">
                    <Link to={`/students/${s.id}`} aria-label={`View ${s.full_name}`}><Eye size={17} /></Link>
                    <Link to={`/students/${s.id}/edit`} aria-label={`Edit ${s.full_name}`}><Pencil size={17} /></Link>
                    <a href={`mailto:${s.email}`} aria-label={`Email ${s.full_name}`}><Mail size={17} /></a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <aside className="dash-side">
        <div className="today-chip"><CalendarDays size={17} />{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
        <Calendar students={recent} />
        <div>
          <h2 className="section-title">Latest registrations</h2>
          {recent.length === 0 ? <p className="muted-note">Nothing to show yet.</p> : (
            <div className="sched">
              {recent.slice(0, 4).map((s) => (
                <Link to={`/students/${s.id}`} className={`sched-item ${s.gender}`} key={s.id}>
                  <span className="date-badge"><b>{new Date(s.date_registered).getDate()}</b>{fmt(s.date_registered, { month: 'short' })}</span>
                  <span><strong>{s.full_name}</strong><small>{s.course}</small></span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
