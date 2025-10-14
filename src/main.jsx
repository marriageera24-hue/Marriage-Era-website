// src/main.jsx (or src/index.js)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Adjust path if necessary
import './index.css';

// 🚨 IMPORTANT: Use BrowserRouter here!
import { BrowserRouter } from 'react-router-dom'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* This wrapper is essential for the routing in App.js to work */}
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);