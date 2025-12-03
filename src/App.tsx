import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import WaterDistribution from './components/WaterDistribution';
import WaterOrder from './components/WaterOrder';

export interface User {
  id: string;
  fullName: string;
  region: string;
  phone: string;
  email: string;
  profileImage?: string;
  verified2FA: boolean;
}

export interface Field {
  id: string;
  name: string;
  size: number;
  cropType: 'cotton' | 'wheat';
  distanceToCanal: number;
  waterNeed: number;
}

export interface WaterApplication {
  id: string;
  fieldId: string;
  fieldName: string;
  waterAmount: number;
  requestedTime: string;
  notes: string;
  status: 'submitted' | 'reviewing' | 'approved' | 'rejected';
  createdAt: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [applications, setApplications] = useState<WaterApplication[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('waterhack_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    // Load fields
    const storedFields = localStorage.getItem('waterhack_fields');
    if (storedFields) {
      setFields(JSON.parse(storedFields));
    }

    // Load applications
    const storedApplications = localStorage.getItem('waterhack_applications');
    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('waterhack_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('waterhack_user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('waterhack_user', JSON.stringify(updatedUser));
  };

  const updateFields = (updatedFields: Field[]) => {
    setFields(updatedFields);
    localStorage.setItem('waterhack_fields', JSON.stringify(updatedFields));
  };

  const updateApplications = (updatedApplications: WaterApplication[]) => {
    setApplications(updatedApplications);
    localStorage.setItem('waterhack_applications', JSON.stringify(updatedApplications));
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register onRegister={handleLogin} />
          } 
        />
        <Route 
          path="/forgot-password" 
          element={<ForgotPassword />} 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated && user ? (
              <Dashboard 
                user={user} 
                fields={fields} 
                applications={applications}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/profile" 
          element={
            isAuthenticated && user ? (
              <Profile 
                user={user} 
                fields={fields}
                onUpdateUser={updateUser}
                onUpdateFields={updateFields}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/water-distribution" 
          element={
            isAuthenticated && user ? (
              <WaterDistribution 
                user={user}
                fields={fields}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/water-order" 
          element={
            isAuthenticated && user ? (
              <WaterOrder 
                user={user}
                fields={fields}
                applications={applications}
                onUpdateApplications={updateApplications}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
