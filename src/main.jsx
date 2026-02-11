import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import ReactGA from "react-ga4";

// Initialize GA4 - Replace with your Measurement ID
ReactGA.initialize("G-YKY4Z85LDY");

ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Landing Page" });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
