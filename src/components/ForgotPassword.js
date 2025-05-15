import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/enhanced/cic_insurance.png';
import { USER_TYPES } from '../utils/auth';

function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: USER_TYPES.CUSTOMER,
    identifierValue: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifierValue.trim()) {
      newErrors.identifierValue = 'Please enter your email or ID';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Reset link sent to:', formData.identifierValue);
      setResetSent(true);
    } catch (error) {
      console.error('Error sending reset link:', error);
      setErrors({ general: 'Failed to send reset link. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-header">
        <img src={logo} alt="CIC Group Logo" className="forgot-password-logo" />
        <h2>Forgot Password</h2>
        <p>Enter your email or ID to reset your password.</p>
      </div>
      {resetSent ? (
        <div className="reset-success">
          <p>A reset link has been sent to your email or ID.</p>
          <button onClick={() => navigate('/login')} className="btn-submit">Back to Login</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="identifierValue">Email or ID</label>
            <input
              type="text"
              id="identifierValue"
              name="identifierValue"
              value={formData.identifierValue}
              onChange={handleChange}
              placeholder="Enter your email or ID"
            />
            {errors.identifierValue && <span className="error">{errors.identifierValue}</span>}
          </div>
          {errors.general && <span className="error general-error">{errors.general}</span>}
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;