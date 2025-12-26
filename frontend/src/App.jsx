import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/profile/Profile';
import UserList from './pages/users/UserList';
import ChantierList from './pages/chantiers/ChantierList';
import ChantierForm from './pages/chantiers/ChantierForm';
import AffectationList from './pages/affectations/AffectationList';
import Planning from './pages/planning/Planning';
import LogList from './pages/logs/LogList';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            
            {/* User Routes - Admin only */}
            <Route
              path="users"
              element={
                <ProtectedRoute roles={['admin']}>
                  <UserList />
                </ProtectedRoute>
              }
            />

            {/* Chantier Routes */}
            <Route path="chantiers" element={<ChantierList />} />
            <Route
              path="chantiers/new"
              element={
                <ProtectedRoute roles={['admin', 'chef']}>
                  <ChantierForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="chantiers/:id/edit"
              element={
                <ProtectedRoute roles={['admin', 'chef']}>
                  <ChantierForm />
                </ProtectedRoute>
              }
            />

            {/* Affectation Routes - Admin and Chef */}
            <Route
              path="affectations"
              element={
                <ProtectedRoute roles={['admin', 'chef']}>
                  <AffectationList />
                </ProtectedRoute>
              }
            />

            {/* Planning Route */}
            <Route path="planning" element={<Planning />} />

            {/* Logs Routes - Admin only */}
            <Route
              path="logs"
              element={
                <ProtectedRoute roles={['admin']}>
                  <LogList />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
