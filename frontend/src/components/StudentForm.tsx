import { useState } from 'react';
import type { FormEvent } from 'react';
import type { StudentFormData, Gender } from '../types';

interface Props {
  initial?: Partial<StudentFormData>;
  onSubmit: (data: StudentFormData) => Promise<void>;
  submitLabel?: string;
  onCancel?: () => void;
}

const empty: StudentFormData = {
  full_name: '',
  gender: 'male',
  date_of_birth: '',
  email: '',
  phone: '',
  course: '',
  year_of_study: 1,
  address: '',
};

export function StudentForm({ initial, onSubmit, submitLabel = 'Save Student', onCancel }: Props) {
  const [form, setForm] = useState<StudentFormData>({ ...empty, ...initial });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2) {
      e.full_name = 'Full name is required (min 2 characters)';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Valid email is required';
    }
    if (!form.phone.trim() || form.phone.trim().length < 7) {
      e.phone = 'Valid phone number is required';
    }
    if (!form.date_of_birth) {
      e.date_of_birth = 'Date of birth is required';
    } else {
      const dob = new Date(form.date_of_birth);
      const today = new Date();
      if (dob > today) e.date_of_birth = 'Date of birth cannot be in the future';
    }
    if (!form.course.trim()) e.course = 'Course is required';
    if (!form.address.trim() || form.address.trim().length < 5) {
      e.address = 'Address is required (min 5 characters)';
    }
    if (form.year_of_study < 1 || form.year_of_study > 10) {
      e.year_of_study = 'Year must be between 1 and 10';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function update<K extends keyof StudentFormData>(key: K, value: StudentFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div style={{ marginBottom: '1rem', color: 'var(--danger)', fontWeight: 500 }}>
          {serverError}
        </div>
      )}
      <div className="form-grid">
        <div className="form-group full">
          <label htmlFor="full_name">Full Name *</label>
          <input
            id="full_name"
            value={form.full_name}
            onChange={(e) => update('full_name', e.target.value)}
            placeholder="Jane Doe"
            disabled={loading}
          />
          {errors.full_name && <span className="error">{errors.full_name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender *</label>
          <select
            id="gender"
            value={form.gender}
            onChange={(e) => update('gender', e.target.value as Gender)}
            disabled={loading}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date_of_birth">Date of Birth *</label>
          <input
            id="date_of_birth"
            type="date"
            value={form.date_of_birth}
            onChange={(e) => update('date_of_birth', e.target.value)}
            disabled={loading}
          />
          {errors.date_of_birth && <span className="error">{errors.date_of_birth}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="jane@example.com"
            disabled={loading}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input
            id="phone"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+1 555 000 0000"
            disabled={loading}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="course">Course / Program *</label>
          <input
            id="course"
            value={form.course}
            onChange={(e) => update('course', e.target.value)}
            placeholder="Computer Science"
            disabled={loading}
          />
          {errors.course && <span className="error">{errors.course}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="year_of_study">Year of Study *</label>
          <input
            id="year_of_study"
            type="number"
            min={1}
            max={10}
            value={form.year_of_study}
            onChange={(e) => update('year_of_study', parseInt(e.target.value, 10) || 1)}
            disabled={loading}
          />
          {errors.year_of_study && <span className="error">{errors.year_of_study}</span>}
        </div>

        <div className="form-group full">
          <label htmlFor="address">Address *</label>
          <textarea
            id="address"
            rows={3}
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            placeholder="123 Main Street, City"
            disabled={loading}
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading && <span className="spinner" />}
          {loading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
