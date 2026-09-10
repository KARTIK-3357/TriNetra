import { Navigate, Route, Routes } from 'react-router-dom';

import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import CitizenProjects from '../pages/citizen/CitizenProjects';
import ProjectDetails from '../pages/citizen/ProjectDetails';
import Contractors from '../pages/citizen/Contractors';
import ContractorDetails from '../pages/citizen/ContractorDetails';
import ReportIssue from '../pages/citizen/ReportIssue';
import Feedback from '../pages/citizen/Feedback';
import GovernmentDashboard from '../pages/government/GovernmentDashboard';
import GovernmentProjects from '../pages/government/GovernmentProjects';
import AIRiskMonitor from '../pages/government/AIRiskMonitor';
import Investigation from '../pages/government/Investigation';
import Analytics from '../pages/government/Analytics';
import ConstructorDashboard from '../pages/constructor/ConstructorDashboard';
import { GuestRoute, ProtectedRoute } from './ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route element={<ProtectedRoute roles={['citizen']} />}>
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/citizen/projects" element={<CitizenProjects />} />
        <Route path="/citizen/projects/:id" element={<ProjectDetails />} />
        <Route path="/citizen/contractors" element={<Contractors />} />
        <Route path="/citizen/contractors/:name" element={<ContractorDetails />} />
        <Route path="/citizen/report" element={<ReportIssue />} />
        <Route path="/citizen/feedback" element={<Feedback />} />
      </Route>

      <Route element={<ProtectedRoute roles={['government']} />}>
        <Route path="/government" element={<GovernmentDashboard />} />
        <Route path="/government/projects" element={<GovernmentProjects />} />
        <Route path="/government/risk-monitor" element={<AIRiskMonitor />} />
        <Route path="/government/risk" element={<Navigate to="/government/risk-monitor" replace />} />
        <Route path="/government/investigations" element={<Investigation />} />
        <Route path="/government/investigation" element={<Navigate to="/government/investigations" replace />} />
        <Route path="/government/analytics" element={<Analytics />} />
      </Route>

      <Route element={<ProtectedRoute roles={['contractor']} />}>
        <Route path="/constructor" element={<ConstructorDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
