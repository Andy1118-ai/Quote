import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CoverPage from './components/CoverPage';
import Dashboard from './components/Dashboard';
import FAQs from './components/FAQs';
import ForgotPassword from './components/ForgotPassword';
import Register from './components/register';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;