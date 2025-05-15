import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/auth.css';
import logo from '../assets/cic_insurance.png';
import MiniFAQ from './shared/MiniFAQ';
import { DateRangeCalendar, MonthPicker } from './shared/Calendar';
import { isAuthenticated, logout, getCurrentUser, USER_TYPES } from '../utils/auth';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const quoteData = location.state || null;
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    lastLogin: new Date().toLocaleString()
  });
  const [stats, setStats] = useState({
    totalVisits: 156,
    activeProjects: 3,
    notifications: 5
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [quoteOptions, setQuoteOptions] = useState([
    { id: 1, name: 'Basic Cover', price: 15000, coverage: 'Essential coverage' },
    { id: 2, name: 'Standard Cover', price: 25000, coverage: 'Comprehensive coverage with added benefits' },
    { id: 3, name: 'Premium Cover', price: 40000, coverage: 'Full coverage with all benefits included' }
  ]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check if user is authenticated using the centralized utility
    if (!isAuthenticated()) {
      // User is not authenticated, redirect to login
      navigate('/login');
      return;
    }

    // Simulate fetching user data
    const fetchUserData = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get user data using the centralized utility
        const currentUser = getCurrentUser();
        let userId = 'Unknown';
        let userType = USER_TYPES.CUSTOMER;

        if (currentUser) {
          userId = currentUser.id || 'Unknown';
          userType = currentUser.userType || USER_TYPES.CUSTOMER;
        }

        // For demo purposes, we'll use mock data
        if (isMounted) {
          setUserData({
            name: quoteData?.formData?.name || `User ${userId}`,
            email: quoteData?.formData?.email || 'user@example.com',
            lastLogin: new Date().toLocaleString(),
            userType: userType
          });

          setStats({
            totalVisits: 156,
            activeProjects: 3,
            notifications: 5
          });
        }

        // If we have quote data, generate some mock quote options based on product type
        if (quoteData && isMounted) {
          const productTitle = quoteData.productDetails.title;
          let basePrice = 10000;

          // Adjust base price based on product type
          if (productTitle.includes('Motor')) {
            basePrice = 15000;
          } else if (productTitle.includes('Family')) {
            basePrice = 20000;
          } else if (productTitle.includes('Seniors')) {
            basePrice = 25000;
          }

          setQuoteOptions([
            { id: 1, name: 'Basic Cover', price: basePrice, coverage: 'Essential coverage' },
            { id: 2, name: 'Standard Cover', price: basePrice * 1.5, coverage: 'Comprehensive coverage with added benefits' },
            { id: 3, name: 'Premium Cover', price: basePrice * 2.5, coverage: 'Full coverage with all benefits included' }
          ]);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching user data:', error);
        }
        if (isMounted) {
          setError('Failed to load user data. Please refresh the page.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();

    // Cleanup function to handle component unmounting
    return () => {
      setIsMounted(false);
    };
  }, [quoteData, navigate, isMounted]);

  const handleLogout = async () => {
    // Use the centralized logout function
    try {
      const result = await logout();

      if (result.success) {
        // Show logout confirmation
        alert('You have been logged out successfully');

        // Redirect to login page
        navigate('/login');
      } else {
        alert(result.error || 'Failed to logout. Please try again.');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Logout error:', error);
      }
      alert('Failed to logout. Please try again.');
    }
  };

  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
  };

  const handlePurchaseQuote = () => {
    alert('Thank you for your purchase! Your insurance policy will be processed shortly.');
    navigate('/');
  };

  const handleBackToProducts = () => {
    navigate('/');
  };

  const handleStartDateChange = (date) => {
    setDateRange(prev => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date) => {
    setDateRange(prev => ({ ...prev, endDate: date }));
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="reload-button"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render quote selection if we have quote data
  if (quoteData) {
    return (
      <div className="dashboard-page">
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <img src={logo} alt="CIC Insurance" className="sidebar-logo" />
          </div>
          <nav className="sidebar-nav modern-sidebar">
            <button className="nav-item active">
              <span className="nav-icon">📊</span>
              Quote Selection
            </button>
          </nav>
          <div className="sidebar-footer">
            <button className="back-button" onClick={handleBackToProducts}>
              <span className="nav-icon">←</span>
              Back to Products
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-header">
            <div className="header-title">
              <h1>Select Your {quoteData.productDetails.title} Quote</h1>
              <p className="user-greeting">Thank you for your interest, {quoteData.formData.name || 'Valued Customer'}</p>
            </div>
          </header>

          <div className="quote-options-container">
            <div className="product-summary">
              <h3>Product Details</h3>
              <div className="product-card">
                <img src={quoteData.productDetails.img} alt={quoteData.productDetails.title} className="product-img" />
                <div className="product-info">
                  <h4>{quoteData.productDetails.title}</h4>
                  <p>{quoteData.productDetails.desc}</p>
                </div>
              </div>
            </div>

            <div className="quote-options">
              <h3>Available Quote Options</h3>
              <div className="quote-cards">
                {quoteOptions.map(quote => (
                  <div
                    key={quote.id}
                    className={`quote-card ${selectedQuote === quote ? 'selected' : ''}`}
                    onClick={() => handleSelectQuote(quote)}
                  >
                    <h4>{quote.name}</h4>
                    <div className="quote-price">KES {quote.price.toLocaleString()}</div>
                    <div className="quote-details">
                      <p>{quote.coverage}</p>
                    </div>
                    <button className="select-quote-btn">
                      {selectedQuote === quote ? '✓ Selected' : 'Select'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {selectedQuote && (
              <div className="quote-action">
                <button className="purchase-btn" onClick={handlePurchaseQuote}>
                  Purchase Selected Quote
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Render regular dashboard if no quote data
  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="CIC Insurance" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav modern-sidebar">
          <button
            className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveMenu('dashboard')}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          <button
            className={`nav-item ${activeMenu === 'policies' ? 'active' : ''}`}
            onClick={() => setActiveMenu('policies')}
          >
            <span className="nav-icon">📋</span>
            My Policies
          </button>
          <button
            className={`nav-item ${activeMenu === 'claims' ? 'active' : ''}`}
            onClick={() => setActiveMenu('claims')}
          >
            <span className="nav-icon">🔔</span>
            Claims
          </button>
          <button
            className={`nav-item ${activeMenu === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveMenu('payments')}
          >
            <span className="nav-icon">💰</span>
            Payments
          </button>
          <button
            className={`nav-item ${activeMenu === 'support' ? 'active' : ''}`}
            onClick={() => setActiveMenu('support')}
          >
            <span className="nav-icon">🧑‍💼</span>
            Support
          </button>
          <button
            className={`nav-item ${activeMenu === 'faqs' ? 'active' : ''}`}
            onClick={() => navigate('/faqs')}
          >
            <span className="nav-icon">❓</span>
            FAQs
          </button>
          <button
            className={`nav-item ${activeMenu === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveMenu('settings')}
          >
            <span className="nav-icon">⚙️</span>
            Settings
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title">
            <h1>Dashboard</h1>
            <p className="user-greeting">Welcome back, {userData.name}</p>
          </div>
          <div className="user-profile">
            <span className="notification-badge">{stats.notifications}</span>
            <div className="profile-info">
              <p className="user-email">{userData.email}</p>
              <p className="last-login">Last login: {userData.lastLogin}</p>
              <p className="user-type">{userData.userType === USER_TYPES.INTERMEDIARY ? 'Intermediary' : 'Customer'}</p>
            </div>
            <div className="profile-avatar">
              {userData.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="dashboard-stats modern-stats">
          <div className="stat-card modern-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-details">
              <h3>Total Visits</h3>
              <p className="stat-number">{stats.totalVisits}</p>
            </div>
          </div>
          <div className="stat-card modern-card">
            <div className="stat-icon">📝</div>
            <div className="stat-details">
              <h3>Active Policies</h3>
              <p className="stat-number">{stats.activeProjects}</p>
            </div>
          </div>
          <div className="stat-card modern-card">
            <div className="stat-icon">🔔</div>
            <div className="stat-details">
              <h3>Notifications</h3>
              <p className="stat-number">{stats.notifications}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Recent Activity</h2>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-icon">📝</span>
                <div className="activity-details">
                  <p>Updated your motor insurance policy</p>
                  <small>2 hours ago</small>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">📊</span>
                <div className="activity-details">
                  <p>Premium payment confirmed</p>
                  <small>5 hours ago</small>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">👥</span>
                <div className="activity-details">
                  <p>Customer service chat completed</p>
                  <small>1 day ago</small>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions modern-actions">
              <button className="action-button modern-button">
                <span className="action-icon">📋</span>
                New Policy
              </button>
              <button className="action-button modern-button">
                <span className="action-icon">📊</span>
                Pay Premium
              </button>
              <button className="action-button modern-button">
                <span className="action-icon">⚙️</span>
                Update Profile
              </button>
            </div>
          </div>

          <MiniFAQ
            title="Need Help?"
            category="general"
            maxItems={2}
            showViewAll={true}
          />

          <div className="dashboard-card">
            <div className="card-header">
              <h2>Date Selection</h2>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1rem' }}>Filter by Date Range</h3>
              <DateRangeCalendar
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onChangeStart={handleStartDateChange}
                onChangeEnd={handleEndDateChange}
                startLabel="From"
                endLabel="To"
                showSelectedRange={true}
              />

              <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1rem' }}>Select Month</h3>
              <MonthPicker
                selectedDate={selectedMonth}
                onChange={setSelectedMonth}
                label="View Reports For"
                showSelectedValue={true}
              />

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;