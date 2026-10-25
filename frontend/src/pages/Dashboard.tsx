import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, FilePlus2, UsersRound, UserRound, UserRoundPlus } from 'lucide-react';
import { fetchDashboard } from '../api';
import type { DashboardStats } from '../types';

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-center">Loading dashboard…</div>;
  }

  if (error || !stats) {
    return <div className="empty-state">Failed to load: {error}</div>;
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const genderStats = [
    { label: 'Male students', count: stats.male_count, color: 'blue', icon: UserRound },
    { label: 'Female students', count: stats.female_count, color: 'rose', icon: UserRound },
    { label: 'Other', count: stats.other_count, color: 'amber', icon: UsersRound },
  ];

  return (
    <div className="dashboard-page">
      <section className="welcome-banner">
        <div className="welcome-copy">
          <span className="eyebrow">STUDENT RECORDS</span>
          <h1>{greeting}, <span>Student Admin</span></h1>
          <p>Your student community, at a glance.</p>
          <Link to="/students" className="banner-link">Explore students <ArrowRight size={15} /></Link>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <span className="art-sun" />
          <BookOpen className="art-book" size={104} strokeWidth={1.15} />
          <span className="art-spark spark-one">✳</span>
          <span className="art-spark spark-two">✦</span>
        </div>
        <span className="banner-index">01 / OVERVIEW</span>
      </section>

      <section className="stats-grid dashboard-stats" aria-label="Student statistics">
        <article className="stat-card dashboard-stat stat-total">
          <div className="stat-icon"><UsersRound size={19} /></div>
          <div className="stat-label">Total students</div>
          <div className="stat-value">{stats.total_students.toLocaleString()}</div>
          <div className="stat-foot">In your records</div>
        </article>
        <article className="stat-card dashboard-stat stat-male">
          <div className="stat-icon"><UserRound size={19} /></div>
          <div className="stat-label">Male students</div>
          <div className="stat-value">{stats.male_count.toLocaleString()}</div>
          <div className="stat-foot">Registered profiles</div>
        </article>
        <article className="stat-card dashboard-stat stat-female">
          <div className="stat-icon"><UserRound size={19} /></div>
          <div className="stat-label">Female students</div>
          <div className="stat-value">{stats.female_count.toLocaleString()}</div>
          <div className="stat-foot">Registered profiles</div>
        </article>
        <article className="stat-card dashboard-stat stat-other">
          <div className="stat-icon"><BookOpen size={19} /></div>
          <div className="stat-label">Other</div>
          <div className="stat-value">{stats.other_count.toLocaleString()}</div>
          <div className="stat-foot">Registered profiles</div>
        </article>
      </section>

      <div className="dashboard-panels">
        <section className="dashboard-panel recent-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">LATEST ACTIVITY</span>
              <h2>Recently added students</h2>
            </div>
            <Link to="/students" className="text-link">View all <ArrowUpRight size={15} /></Link>
          </div>
          {stats.recent_students.length === 0 ? (
            <div className="dashboard-empty">
              <span className="empty-icon"><UsersRound size={22} /></span>
              <strong>No students yet</strong>
              <span>Add a student to start building your records.</span>
              <Link to="/students/new" className="text-link">Add a student <ArrowRight size={14} /></Link>
            </div>
          ) : (
            <div className="recent-table-wrap">
              <table className="recent-table">
                <thead>
                  <tr><th>Student</th><th>Course</th><th>Year</th><th>Registered</th></tr>
                </thead>
                <tbody>
                  {stats.recent_students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <Link to={`/students/${student.id}`} className="student-cell">
                          <span className={`student-avatar avatar-${student.gender}`}>{student.full_name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>
                          <span><strong>{student.full_name}</strong><small>{student.email}</small></span>
                        </Link>
                      </td>
                      <td>{student.course}</td>
                      <td><span className="year-pill">Year {student.year_of_study}</span></td>
                      <td className="date-cell">{new Date(student.date_registered).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="dashboard-panel overview-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">YOUR COMMUNITY</span>
              <h2>Student overview</h2>
            </div>
            <span className="overview-icon"><UsersRound size={18} /></span>
          </div>
          <div className="overview-total">
            <strong>{stats.total_students.toLocaleString()}</strong>
            <span>total profiles</span>
          </div>
          <div className="gender-bars">
            {genderStats.map(({ label, count, color, icon: Icon }) => {
              const percentage = stats.total_students ? Math.round((count / stats.total_students) * 100) : 0;
              return (
                <div className="gender-row" key={label}>
                  <div className="gender-row-label">
                    <span className={`gender-dot ${color}`}><Icon size={13} /></span>
                    <span>{label}</span><strong>{percentage}%</strong>
                  </div>
                  <div className="gender-track"><span className={color} style={{ width: `${percentage}%` }} /></div>
                </div>
              );
            })}
          </div>
          <Link to="/students" className="overview-link">Open student directory <ArrowRight size={15} /></Link>
        </section>
      </div>

      <div className="dashboard-bottom">
        <section className="dashboard-panel quick-panel">
          <div className="panel-heading">
            <div><span className="panel-kicker">SHORTCUTS</span><h2>Quick access</h2></div>
          </div>
          <div className="quick-actions">
            <Link to="/students/new" className="quick-action">
              <span className="quick-icon quick-blue"><FilePlus2 size={19} /></span>
              <span><strong>Add student</strong><small>Create a new record</small></span>
              <ArrowRight size={15} className="quick-arrow" />
            </Link>
            <Link to="/students" className="quick-action">
              <span className="quick-icon quick-green"><UsersRound size={19} /></span>
              <span><strong>Browse students</strong><small>Search your directory</small></span>
              <ArrowRight size={15} className="quick-arrow" />
            </Link>
          </div>
        </section>

        <section className="latest-card">
          <div className="latest-card-top"><span className="latest-icon"><UserRoundPlus size={19} /></span><span className="panel-kicker">RECORDS SNAPSHOT</span></div>
          <h2>{stats.recent_students.length ? 'Growing together.' : 'A fresh start.'}</h2>
          <p>{stats.recent_students.length ? `${stats.recent_students.length} recent ${stats.recent_students.length === 1 ? 'addition' : 'additions'} in your student directory.` : 'Your student directory is ready for its first profile.'}</p>
          <Link to="/students/new" className="latest-link">Create a record <ArrowRight size={15} /></Link>
          <span className="latest-orbit orbit-one" /><span className="latest-orbit orbit-two" />
        </section>
      </div>

      <footer className="dashboard-footer"><span>SRMS · Student Records Management System</span><span>Keeping student information in one place.</span></footer>
    </div>
  );
}
