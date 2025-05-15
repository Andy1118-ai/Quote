import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import '../components/loginpage.css';
import logo from '../assets/enhanced/cic_insurance.png';
import picture1 from '../assets/picture1.jpg';
import picture2 from '../assets/picture2.jpg';
import picture3 from '../assets/picture3.jpg';
import picture4 from '../assets/picture4.jpg';
import picture5 from '../assets/picture5.jpg';
import picture6 from '../assets/picture6.jpg';

import CoverPage from './CoverPage';
import ForgotPassword from './ForgotPassword';
import Dashboard from './Dashboard';
import Register from './register';
import QuoteFormSummary from './quoteformsummary';
import App from '../App';
import FAQs from './FAQs';
import CalendarExample from './examples/CalendarExample';

// Import authentication utilities
import {
  USER_TYPES,
  validateIdentifier,
  validatePassword,
  login,
  getIdentifierLabel,
  getIdentifierPlaceholder
} from '../utils/auth';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error("React Error Boundary caught an error:", error, errorInfo);
    }
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>Please try refreshing the page. If the problem persists, contact support.</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
              window.location.reload();
            }}
            className="refresh-button"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function LoginPage() {
  return (
    <div className="split-screen">
      <div className="left-panel">
        {/* Left panel remains empty with blue background */}
      </div>
      <div className="right-panel">
        <div className="login-container">
          <img src={logo} alt="CIC Logo" className="logo" />
          <div className="login-header">
            <h2>Sign in to CIC EasyBima</h2>
            <p>Getting Insured with us is as easy as 1-2-3</p>
          </div>
          <form>
            <div className="radio-group">
              <label>
                <input type="radio" name="userType" value="customer" /> A Customer
              </label>
              <label>
                <input type="radio" name="userType" value="intermediary" /> An Intermediary
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="identifier">ID/Passport Number</label>
              <input type="text" id="identifier" placeholder="Enter your ID/Passport Number" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" />
            </div>
            <button type="submit" className="btn-submit">Sign In</button>
          </form>
          <div className="form-links">
            <a href="/forgot-password">Create/Forgot your Password</a>
          </div>
          <div className="register-link">
            Don’t have an account? <a href="/register">Register</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cover" element={<CoverPage />} />
        <Route path="/home" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quoteformsummary" element={<QuoteFormSummary />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/calendar" element={<CalendarExample />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  if (process.env.NODE_ENV === 'development') {
    console.error("Root element with id 'root' not found. Ensure it exists in index.html.");
  }
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <AppWrapper />
        </BrowserRouter>
      </React.StrictMode>
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error rendering React application:", error);
    }
    // Fallback rendering directly to the body if root fails
    document.body.innerHTML = `
      <div style="padding: 20px; margin: 20px; border: 1px solid #fff; border-radius: 4px;
                  background-color: #f8d7da; color: #721c24; font-family: sans-serif;">
        <h2>Something went wrong while loading the application.</h2>
        <p>Please try refreshing the page. If the problem persists, contact support.</p>
        <button onclick="window.location.reload()"
                style="padding: 8px 16px; background-color: #dc3545; color: white;
                       border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
  }
}
