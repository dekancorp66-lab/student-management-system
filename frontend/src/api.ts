import type {
  Student,
  StudentFormData,
  StudentListResponse,
  DashboardStats,
  ListParams,
} from './types';

const BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = 'Request failed';
    try {
      const data = await res.json();
      detail = data.detail || JSON.stringify(data);
      if (Array.isArray(detail)) {
        detail = detail.map((e: { msg?: string }) => e.msg || String(e)).join(', ');
      }
    } catch {
      detail = res.statusText;
    }
    throw new Error(detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function fetchDashboard(): Promise<DashboardStats> {
  const res = await fetch(`${BASE}/stats/dashboard`);
  return handleResponse(res);
}

export async function fetchStudents(params: ListParams = {}): Promise<StudentListResponse> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      searchParams.set(k, String(v));
    }
  });
  const res = await fetch(`${BASE}/students?${searchParams}`);
  return handleResponse(res);
}

export async function fetchStudent(id: number): Promise<Student> {
  const res = await fetch(`${BASE}/students/${id}`);
  return handleResponse(res);
}

export async function createStudent(data: StudentFormData): Promise<Student> {
  const res = await fetch(`${BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateStudent(id: number, data: Partial<StudentFormData>): Promise<Student> {
  const res = await fetch(`${BASE}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteStudent(id: number): Promise<void> {
  const res = await fetch(`${BASE}/students/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}

export async function fetchCourses(): Promise<string[]> {
  const res = await fetch(`${BASE}/students/courses`);
  return handleResponse(res);
}
