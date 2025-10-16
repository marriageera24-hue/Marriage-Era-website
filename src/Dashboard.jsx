// src/Dashboard.js

import React, { useState, useEffect } from 'react';
import './assets/Dashboard.css'; 
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns';

// --- Helper components (Header and Sidebar remain the same) ---

// Main Dashboard Component
function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // 🛑 1. State for fetched data and loading/error status
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // 🛑 2. Use useEffect for data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(import.meta.env.VITE_APP_URL);
        // Replace this URL with your actual API endpoint
        const response = await fetch(import.meta.env.VITE_APP_URL+'admin/users/search?limit=10',{
            method: 'GET',
            headers: {
                // Set the Content-Type header
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa("admin:admin@7641")}`, 
                // Set the Accept-Language header
                'Accept-Language': 'en-US,en;q=0.9',
            }
        }); 
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result); // Set the fetched array of data
        setError(null);
      } catch (e) {
        console.error("Fetching data failed:", e);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false); // Stop loading regardless of success/failure
      }
    };
    if(data.length === 0){
      fetchData();  
    }
  }, []); // Empty dependency array means this runs once on mount

  // --- RENDERING LOGIC ---
  
  // Define helper components inline or import them from another file
  const Header = ({ title, toggleSidebar }) => (
    <header className="dashboard-header">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button> 
      <h1>{title}</h1>
      <nav>
        <span>Welcome, User!</span> 
        <button onClick={() => alert('Logging Out...')}>Log Out</button>
      </nav>
    </header>
  );

  const Sidebar = ({ isOpen }) => (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">App Logo</div>
      <nav className="sidebar-nav">
        <ul>
          <li><a href="/dashboard">🏠 Dashboard</a></li>
          <li><a href="/profile">👤 Profile</a></li>
          <li><a href="/settings">⚙️ Settings</a></li>
        </ul>
      </nav>
    </aside>
  );

  return (
    <div className="dashboard-layout">
      
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className="dashboard-main">
        <Header title="Data Dashboard" toggleSidebar={toggleSidebar} />
        
        <div className="dashboard-content">
          <h2>API Data Grid</h2>
          
          {/* 🛑 3. Conditional Rendering of Data Status */}
          {loading && <p>Loading data...</p>}
          {error && <p className="error-message">{error}</p>}
          
          {/* 🛑 4. Render the data in a grid */}
          {!loading && !error && (
            <div className="data-grid">
              {data.map(user => (
                console.log(user),
                <div key={user.id} className="grid-card" onClick={() => navigate(`/profile/${user.uuid}`,  { state: { userProfile: user } })} data-uuid={user.uuid}>
                  <h4>{user.first_name + " " + user.last_name}</h4>
                  <p><a href={`tel:${user.phone}`} onClick={(e) => {e.preventDefault(); window.open(`tel:${user.phone}`)}}>{user.phone}</a></p>
                  <p>Last Logged In: {format(user.last_login_at.Time, 'yyyy-MM-dd')}</p>
                  <span className="verified" style={{color: user.is_verified ? 'green' : 'red'}}>
                    {user.is_verified ? 'Verified' : 'To be verified'}
                  </span>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
    </div>
  );
}

export default Dashboard;