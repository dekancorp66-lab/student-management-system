import { useNavigate } from 'react-router-dom';
import { createStudent } from '../api';
import { StudentForm } from '../components/StudentForm';
import type { StudentFormData } from '../types';
import { useState } from 'react';
import { ToastContainer, type ToastMessage } from '../components/Toast';

export function AddStudent() {
  const navigate = useNavigate();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  async function handleSubmit(data: StudentFormData) {
    await createStudent(data);
    setToasts((t) => [...t, { id: Date.now(), type: 'success', text: 'Student created successfully' }]);
    setTimeout(() => navigate('/students'), 800);
  }

  return (
    <>
      <ToastContainer toasts={toasts} remove={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Student</h1>
          <p className="page-subtitle">Register a new student record</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <StudentForm
            onSubmit={handleSubmit}
            submitLabel="Create Student"
            onCancel={() => navigate('/students')}
          />
        </div>
      </div>
    </>
  );
}
