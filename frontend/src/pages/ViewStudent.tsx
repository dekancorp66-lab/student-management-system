import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteStudent, fetchStudent } from '../api';
import type { Student } from '../types';
import { ToastContainer, type ToastMessage } from '../components/Toast';

export function ViewStudent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchStudent(Number(id))
      .then(setStudent)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!student || !window.confirm(`Delete "${student.full_name}"?`)) return;
    setDeleting(true);
    try {
      await deleteStudent(student.id);
      setToasts((t) => [...t, { id: Date.now(), type: 'success', text: 'Student deleted' }]);
      setTimeout(() => navigate('/students'), 600);
    } catch (e) {
      setToasts((t) => [
        ...t,
        { id: Date.now(), type: 'error', text: e instanceof Error ? e.message : 'Delete failed' },
      ]);
      setDeleting(false);
    }
  }

  if (loading) return <div className="loading-center">Loading…</div>;
  if (error || !student) return <div className="empty-state">Error: {error || 'Not found'}</div>;

  return (
    <>
      <ToastContainer toasts={toasts} remove={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
      <div className="page-header">
        <div>
          <h1 className="page-title">{student.full_name}</h1>
          <p className="page-subtitle">Student ID #{student.id}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Link to={`/students/${student.id}/edit`} className="btn btn-primary">
            ✎ Edit
          </Link>
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : '🗑 Delete'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="detail-grid">
            <div className="detail-item">
              <label>Gender</label>
              <span className={`badge badge-${student.gender}`}>{student.gender}</span>
            </div>
            <div className="detail-item">
              <label>Date of Birth</label>
              <span>{new Date(student.date_of_birth).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <label>Email</label>
              <span>{student.email}</span>
            </div>
            <div className="detail-item">
              <label>Phone</label>
              <span>{student.phone}</span>
            </div>
            <div className="detail-item">
              <label>Course / Program</label>
              <span>{student.course}</span>
            </div>
            <div className="detail-item">
              <label>Year of Study</label>
              <span>{student.year_of_study}</span>
            </div>
            <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
              <label>Address</label>
              <span>{student.address}</span>
            </div>
            <div className="detail-item">
              <label>Date Registered</label>
              <span>{new Date(student.date_registered).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <Link to="/students" className="btn btn-secondary">
          ← Back to list
        </Link>
      </div>
    </>
  );
}
