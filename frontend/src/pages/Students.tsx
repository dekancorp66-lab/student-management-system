import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { deleteStudent, fetchStudents } from '../api';
import type { Student, ListParams } from '../types';
import { ToastContainer, type ToastMessage } from '../components/Toast';

export function Students() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '');
  const [gender, setGender] = useState('');
  const [sortBy, setSortBy] = useState('date_registered');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const addToast = (type: 'success' | 'error', text: string) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, text }]);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: ListParams = {
        page,
        page_size: 10,
        search: search || undefined,
        gender: gender || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      const data = await fetchStudents(params);
      setStudents(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (e) {
      addToast('error', e instanceof Error ? e.message : 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [page, search, gender, sortBy, sortOrder]);

  useEffect(() => {
    load();
  }, [load]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search, gender]);

  function handleSort(column: string) {
    if (sortBy === column) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete student "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteStudent(id);
      addToast('success', 'Student deleted successfully');
      load();
    } catch (e) {
      addToast('error', e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'full_name', label: 'Student' },
    { key: 'gender', label: 'Gender' },
    { key: 'course', label: 'Course' },
    { key: 'year_of_study', label: 'Year' },
    { key: 'date_registered', label: 'Registered' },
  ];

  return (
    <>
      <ToastContainer toasts={toasts} remove={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{total} student{total !== 1 ? 's' : ''} registered</p>
        </div>
        <Link to="/students/new" className="btn btn-primary">
          <Plus size={16} /> Add student
        </Link>
      </div>

      <div className="card">
        <div className="card-body" style={{ paddingBottom: 0 }}>
          <div className="filters">
            <input
              type="search"
              placeholder="Search name, email, course…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
            />
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">All genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-center">Loading…</div>
          ) : students.length === 0 ? (
            <div className="empty-state">No students found. Try adjusting filters or add a new student.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} onClick={() => handleSort(col.key)}>
                      {col.label}
                      {sortBy === col.key && (
                        <span className="sort-icon">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>
                      <Link to={`/students/${s.id}`} className="name-cell">
                        <Avatar name={s.full_name} gender={s.gender} />
                        <span><strong>{s.full_name}</strong><small>{s.email}</small></span>
                      </Link>
                    </td>
                    <td>
                      <span className={`badge badge-${s.gender}`}>{s.gender}</span>
                    </td>
                    <td>{s.course}</td>
                    <td><span className="year-pill">Year {s.year_of_study}</span></td>
                    <td>{new Date(s.date_registered).toLocaleDateString()}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn btn-secondary btn-sm btn-icon"
                          title="View"
                          onClick={() => navigate(`/students/${s.id}`)}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm btn-icon"
                          title="Edit"
                          onClick={() => navigate(`/students/${s.id}/edit`)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm btn-icon"
                          title="Delete"
                          disabled={deletingId === s.id}
                          onClick={() => handleDelete(s.id, s.full_name)}
                        >
                          {deletingId === s.id ? '…' : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Page {page} of {totalPages} · {total} total
            </div>
            <div className="pagination-controls">
              <button
                className="btn btn-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
