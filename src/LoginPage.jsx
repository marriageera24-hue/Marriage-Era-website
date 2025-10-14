import React, { useState } from 'react';
import './assets/LoginPage.css'; // Assume you have a CSS file for styling
import { useNavigate } from 'react-router-dom';

function LoginPage({onLoginSuccess}) {
  // State for input fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    // --- Basic Authentication Logic (Example) ---
    if (username === 'admin' && password === 'Admin@7641') {
        // 1. Update the overall application state (isAuthenticated in App.js)
        onLoginSuccess();
        setErrorMessage('');
        navigate('/dashboard', { replace: true }); 
      
      // In a real application, you would typically:
      // 1. Store a token (e.g., in localStorage)
      // 2. Redirect the user to the dashboard or home page (e.g., using React Router)
      
    } else {
      setErrorMessage('Invalid username or password.');
    }
    // --- End of Basic Authentication Logic ---
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        {/* Username Input */}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Error Message Display */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Submit Button */}
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginPage;