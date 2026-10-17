export type Gender = 'male' | 'female' | 'other';

export interface Student {
  id: number;
  full_name: string;
  gender: Gender;
  date_of_birth: string;
  email: string;
  phone: string;
  course: string;
  year_of_study: number;
  address: string;
  date_registered: string;
}

export interface StudentFormData {
  full_name: string;
  gender: Gender;
  date_of_birth: string;
  email: string;
  phone: string;
  course: string;
  year_of_study: number;
  address: string;
}

export interface StudentListResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: Student[];
}

export interface DashboardStats {
  total_students: number;
  male_count: number;
  female_count: number;
  other_count: number;
  recent_students: Student[];
}

export interface ListParams {
  page?: number;
  page_size?: number;
  search?: string;
  gender?: string;
  course?: string;
  year?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
