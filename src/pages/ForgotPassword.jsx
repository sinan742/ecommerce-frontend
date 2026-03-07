import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  // English: If user is already logged in, don't show this page
  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Step 1: Send OTP to Email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ecommerce-project-backend-wm1z.onrender.com/api/forgot-password/', { email: email });
      if (response.status === 200) {
        setOtpSent(true); 
        toast.success("OTP sent to your email!");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Email not found");
    }
  };

  // Step 2: Reset Password with OTP
  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ecommerce-project-backend-wm1z.onrender.com/api/reset-password/', {
        email: email,        
        otp: otp,            
        new_password: newPassword 
      });
      
      if (response.status === 200) {
        toast.success("Password Updated successfully!");
        
        // English: Navigate to login and REMOVE this page from history
        // { replace: true } makes sure back button won't return here
        navigate('/login', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid OTP or request failed");
    }
  };

  return (
    <div className='forgot-password-container'>
      <div className='forgot-glass-box'>
        <div className='forgot-header'>
          <h2>RECOVER <span className='neon-text'>ACCOUNT</span></h2>
          <p>{otpSent ? "Check your inbox for OTP" : "Enter email to receive reset code"}</p>
        </div>

        {/* Conditional Rendering Logic */}
        {!otpSent ? (
          <form className='forgot-form' onSubmit={handleSendOTP}>
            <div className='forgot-input-group'>
              <label>Registered Email</label>
              <input 
                type="email" 
                value={email}
                placeholder='example@gmail.com' 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <button type='submit' className='forgot-btn'>Send OTP</button>
          </form>
        ) : (
          <form className='forgot-form' onSubmit={handleReset}>
            <div className='forgot-input-group'>
              <label>OTP Code</label>
              <input 
                type="text" 
                placeholder='Enter 6-digit OTP' 
                onChange={(e) => setOtp(e.target.value)} 
                required 
              />
            </div>
            <div className='forgot-input-group'>
              <label>New Password</label>
              <input 
                type="password" 
                placeholder='Enter new password' 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
              />
            </div>
            <button type='submit' className='forgot-btn'>Update Password</button>
          </form>
        )}

        <div className='forgot-footer'>
          {/* Back button with replace logic */}
          <span onClick={() => navigate('/login', { replace: true })}>Back to Login</span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;