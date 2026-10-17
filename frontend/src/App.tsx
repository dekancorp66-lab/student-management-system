import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { AddStudent } from './pages/AddStudent';
import { EditStudent } from './pages/EditStudent';
import { ViewStudent } from './pages/ViewStudent';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="students/new" element={<AddStudent />} />
          <Route path="students/:id" element={<ViewStudent />} />
          <Route path="students/:id/edit" element={<EditStudent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
