import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Header from './components/layout/Header';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/dashboard';
import ProjectDetails from './components/projects/ProjectDetails';
import PrivateRoute from './components/routing/PrivateRoute';

// Context
import AuthContext from './context/AuthContext';

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: localStorage.getItem('token') ? true : false,
    loading: true,
    user: null
  });

  useEffect(() => {
    // Check if user is authenticated when app loads
    const checkUser = async () => {
      if (auth.token) {
        try {
          const response = await fetch('https://task-tracker-backend-da1d.onrender.com/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${auth.token}`
            }
          });
          const data = await response.json();
          
          if (data.success) {
            setAuth(prev => ({
              ...prev,
              user: data.data,
              loading: false
            }));
          } else {
            // Token invalid
            localStorage.removeItem('token');
            setAuth({
              token: null,
              isAuthenticated: false,
              loading: false,
              user: null
            });
          }
        } catch (error) {
          localStorage.removeItem('token');
          setAuth({
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null
          });
        }
      } else {
        setAuth(prev => ({ ...prev, loading: false }));
      }
    };
    
    checkUser();
  }, [auth.token]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Router>
        <Header />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/project/:id" 
              element={
                <PrivateRoute>
                  <ProjectDetails />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;