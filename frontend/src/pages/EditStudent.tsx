import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchStudent, updateStudent } from '../api';
import { StudentForm } from '../components/StudentForm';
import type { StudentFormData } from '../types';
import { ToastContainer, type ToastMessage } from '../components/Toast';

export function EditStudent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<Partial<StudentFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchStudent(Number(id))
      .then((s) => {
        setInitial({
          full_name: s.full_name,
          gender: s.gender,
          date_of_birth: s.date_of_birth,
          email: s.email,
          phone: s.phone,
          course: s.course,
          year_of_study: s.year_of_study,
          address: s.address,
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(data: StudentFormData) {
    await updateStudent(Number(id), data);
    setToasts((t) => [...t, { id: Date.now(), type: 'success', text: 'Student updated successfully' }]);
    setTimeout(() => navigate(`/students/${id}`), 800);
  }

  if (loading) return <div className="loading-center">Loading…</div>;
  if (error || !initial) return <div className="empty-state">Error: {error || 'Not found'}</div>;

  return (
    <>
      <ToastContainer toasts={toasts} remove={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Student</h1>
          <p className="page-subtitle">Update student information</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <StudentForm
            initial={initial}
            onSubmit={handleSubmit}
            submitLabel="Update Student"
            onCancel={() => navigate(`/students/${id}`)}
          />
        </div>
      </div>
    </>
  );
}
