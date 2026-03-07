import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import './Register.css';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || ""; 
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // English: If user is already logged in, redirect them to home
  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      navigate('/', { replace: true });
    }
    
    // Safety check: email illengil register page-ilekku thirichu vidanam
    if (!email) {
      toast.warn("Please register first.");
      navigate('/register', { replace: true });
    }
  }, [navigate, email]);

  const handleVerify = (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Email not found. Please register again.");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);
    const payload = { email, otp };

    axios.post('https://ecommerce-project-backend-wm1z.onrender.com/api/verify-otp/', payload) 
      .then((res) => {
        toast.success("Email verified! You can now login.");
        
        // English: Replace history so user can't go back to OTP screen
        navigate('/login', { replace: true });
      })
      .catch((err) => {
        console.error("Verification Error:", err.response?.data);
        toast.error(err.response?.data?.error || "Invalid OTP. Try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className='register-page-wrapper'>
      <div className='register-glass-card'>
        <div className='register-header'>
          <h2>VERIFY <span className='highlight'>OTP</span></h2>
          <p>We sent a 6-digit code to <strong>{email}</strong></p>
        </div>

        <form className='register-form' onSubmit={handleVerify}>
          <div className='input-group'>
            <label>Enter 6-Digit Code</label>
            <input
              type="text"
              placeholder='000000'
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="otp-input-field"
              style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
            />
          </div>

          <button type="submit" className='register-submit-btn' disabled={loading}>
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <div className='register-footer'>
          <span>Didn't get a code?</span>
          <button className='login-link' onClick={() => navigate('/register', { replace: true })}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}