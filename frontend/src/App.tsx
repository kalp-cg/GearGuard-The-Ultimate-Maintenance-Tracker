import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import EquipmentListPage from './pages/equipment/EquipmentListPage';
import EquipmentDetailPage from './pages/equipment/EquipmentDetailPage';
import TeamsListPage from './pages/teams/TeamsListPage';
import RequestListPage from './pages/requests/RequestListPage';
import KanbanBoard from './pages/requests/KanbanBoard';
import CalendarView from './pages/requests/CalendarView';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';
import DepartmentsPage from './pages/departments/DepartmentsPage';
import PartsPage from './pages/inventory/PartsPage';

import DashboardPage from './pages/dashboard/DashboardPage';

// Placeholder Pages (Will be implemented in next steps)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Equipment */}
            <Route path="/equipment" element={<EquipmentListPage />} />
            <Route path="/equipment/:id" element={<EquipmentDetailPage />} />

            {/* Teams */}
            <Route path="/teams" element={<TeamsListPage />} />

            {/* Requests */}
            <Route path="/requests" element={<RequestListPage />} />
            <Route path="/requests/kanban" element={<KanbanBoard />} />
            <Route path="/requests/kanban" element={<KanbanBoard />} />
            <Route path="/requests/calendar" element={<CalendarView />} />
            <Route path="/requests/reports" element={<ReportsPage />} />

            {/* Departments */}
            <Route path="/departments" element={<DepartmentsPage />} />

            {/* Inventory */}
            <Route path="/inventory/parts" element={<PartsPage />} />

            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />

            {/* Default redirect to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
