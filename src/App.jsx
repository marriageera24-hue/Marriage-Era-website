import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import Profile from './profile';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
   // 1. State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to change the login state (will be passed to LoginPage)
  const handleLogin = (status) => {
    // In a real app, 'status' would be a token or user object
    setIsAuthenticated(status);
  }

 return (
    // Assuming BrowserRouter is in your main.jsx
    <div className="App">
      <Routes>
        {/* Public Route: Login Page 
           Pass the handleLogin function to allow LoginPage to update the state.
        */}
        <Route 
          path="/" 
          element={<LoginPage onLoginSuccess={() => handleLogin(true)} />} 
        />
        
        {/* 2. Protected Route Setup 
          If isAuthenticated is TRUE, the <Outlet /> renders the child Route.
          If isAuthenticated is FALSE, it redirects to the login path ("/").
        */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          {/* Child Route: The actual Dashboard page */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/:userId" element={<Profile />} />
        </Route>

        {/* Catch-all: Redirects all unknown paths to the login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App
