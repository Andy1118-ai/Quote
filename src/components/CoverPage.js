import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';
import ProductSelectionModal from './productselectionmodule';
import cicLogo from '../assets/cic_insurance.png';
import fillFormImg from '../assets/fill-form.png';
import quotationImg from '../assets/quotation.png';
import policyImg from '../assets/policy.png';

function CoverPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="page-container">
      <header className="cover-header">
        <div className="logo">
          <img src={cicLogo} alt="CIC GROUP" />
        </div>
        <nav className="cover-nav">
          <Link to="/faqs" className="nav-link">FAQs</Link>
          <Link to="/login" className="nav-link login-link">Login/Register</Link>
        </nav>
      </header>

      <main className="content-wrap">
        <section className="welcome-section">
          <h2>Welcome to CIC Insurance Group</h2>
          <h1>We keep our word</h1>
          <p>Getting Insured with us is as easy as 1-2-3</p>
        </section>

        <section className="steps-section">
          <div className="step">
            <img src={fillFormImg} alt="Fill in details" />
            <h3>Fill in some details</h3>
            <p>Fill in basic information about yourself and what you want to cover.</p>
          </div>
          <div className="step">
            <img src={quotationImg} alt="Get a quotation" />
            <h3>Get a quotation</h3>
            <p>Pick from different quotations the cover that is best for you.</p>
          </div>
          <div className="step">
            <img src={policyImg} alt="Buy & Get Covered" />
            <h3>Buy & Get Covered</h3>
            <p>Buy the cover you like and enjoy the personal attention you deserve.</p>
          </div>
        </section>

        <div className="cta-container">
          <button className="start-btn" onClick={() => setShowModal(true)}>
            Let’s start!
          </button>
        </div>
      </main>

      <footer className="cic-footer">
        <p>Let us guide you through your life's journey</p>
        <p>Call us directly on 0703 099 120 or Email us at <a href="mailto:callc@cic.co.ke">callc@cic.co.ke</a>.</p>
      </footer>

      <ProductSelectionModal
        open={showModal}
        onClose={() => {
          console.log('Modal closed');
          setShowModal(false);
        }}
        onSelect={setSelectedProduct}
      />
    </div>
  );
}

export default CoverPage;
