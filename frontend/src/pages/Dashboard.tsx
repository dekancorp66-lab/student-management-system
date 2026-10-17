import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of student records</p>
        </div>
        <Link to="/students/new" className="btn btn-primary">
          ➕ Add Student
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{stats.total_students}</div>
        </div>
        <div className="stat-card male">
          <div className="stat-label">Male Students</div>
          <div className="stat-value">{stats.male_count}</div>
        </div>
        <div className="stat-card female">
          <div className="stat-label">Female Students</div>
          <div className="stat-value">{stats.female_count}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Other</div>
          <div className="stat-value">{stats.other_count}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '1.1rem' }}>Recently Added Students</h2>
          <Link to="/students" className="btn btn-secondary btn-sm">
            View All
          </Link>
        </div>
        <div className="card-body">
          {stats.recent_students.length === 0 ? (
            <div className="empty-state">No students yet. Add your first student!</div>
          ) : (
            <ul className="recent-list">
              {stats.recent_students.map((s) => (
                <li key={s.id} className="recent-item">
                  <div>
                    <div className="recent-name">{s.full_name}</div>
                    <div className="recent-meta">
                      {s.course} · Year {s.year_of_study}
                    </div>
                  </div>
                  <div className="recent-meta">
                    {new Date(s.date_registered).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
