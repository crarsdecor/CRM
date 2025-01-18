import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardAdmin from "./pages/Dashboard";
import DashboardManager from "./pages/Manager/ManagerDashboard";
import Signin from "./pages/signin/Signin";
import ProtectedRoute from "./ProtectedRoute";
import UserDashboard from "./pages/User/UserDashboard";
import AccountantDashboard from "./pages/Accountant/AccountantDashboard";
import NotFound from "./NotFound";
import Unauthorized from "./Unauthorized";

const App = () => (
  <Router>
    <Routes>
      {/* Redirect "/" to Signin */}
      <Route path="/" element={<Navigate to="/signin" replace />} />

      {/* Public route for sign-in */}
      <Route path="/signin" element={<Signin />} />

      {/* Admin dashboard (admin-only) */}
      <Route
        path="/dashboard-admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />

      {/* Manager dashboard (accessible by admin and manager) */}
      <Route
        path="/dashboard-manager"
        element={
          <ProtectedRoute allowedRoles={["manager", "admin"]}>
            <DashboardManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard-user"
        element={
          <ProtectedRoute allowedRoles={["manager", "admin", "user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard-accountant"
        element={
          <ProtectedRoute allowedRoles={["accountant", "admin"]}>
            <AccountantDashboard />
          </ProtectedRoute>
        }
      />

      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Fallback route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;
