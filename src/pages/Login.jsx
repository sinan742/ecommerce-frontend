import React, { useEffect, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';

function Login() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '', 
    password: ''
  });

  const [error, setError] = useState({});

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      navigate('/', { replace: true }); 
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.username) tempErrors.username = 'Username is required.';
    if (!formData.password) tempErrors.password = 'Password is required.';
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const loginData = {
        username: formData.username, 
        password: formData.password
      };

      axios.post('https://ecommerce-project-backend-wm1z.onrender.com/api/login/', loginData)
        .then(res => {
          // English: Set cookies for access, refresh and username
          if (res.data.access) Cookies.set('accessToken', res.data.access, { expires: 7 });
          if (res.data.refresh) Cookies.set('refreshToken', res.data.refresh, { expires: 7 });
          if (res.data.username) Cookies.set('userName', res.data.username, { expires: 7 });

          toast.success(`Welcome back, ${res.data.username}!`);

          // English: Proper navigation with history replacement
          // replace: true prevents going back to login screen
          if (res.data.isAdmin === true) {
            navigate('/dashboard', { replace: true }); 
            
          }
          
          else {
            navigate('/', { replace: true }); 
          }
          
          window.location.reload();
        })
        .catch(err => {
          console.error("Login Error:", err.response?.data);
          if (err.response?.status === 401) {
            toast.error("Invalid username or password.");
          }
         
          else {
            toast.error("Could not connect to server.");
          }
        });
    }
  };

  return (
    <div className='login-page-wrapper'>
      <div className='login-glass-card'>
        <div className='login-header'>
          <h2>BEYOND <span className='highlight'>THE PITCH</span></h2>
          <p>Login to your football gear account</p>
        </div>

        <form className='login-form' onSubmit={handleSubmit}>
          <div className='input-group'>
            <label>Username</label>
            <input
              type="text"
              placeholder='Enter your username'
              onChange={handleChange}
              name='username'
              value={formData.username}
              className={error.username ? 'input-error' : ''}
            />
            {error.username && <span className='err-text'>{error.username}</span>}
          </div>

          <div className='input-group'>
            <label>Password</label>
            <input
              type="password"
              placeholder='Enter your password'
              onChange={handleChange}
              name='password'
              value={formData.password}
              className={error.password ? 'input-error' : ''}
            />
            {error.password && <span className='err-text'>{error.password}</span>}
          </div>

          <button type='submit' className='login-submit-btn'>Sign In</button>
        </form>

        <div className='login-footer'>
          <div className='footer-section'>
            <span>New player?</span>
            <button className='register-link' onClick={() => navigate('/register')}>Create Account</button>
          </div>
          <div className='footer-section'>
            <span>Forgot access?</span>
            <button className='register-link' onClick={()=> navigate('/forgot-password')}>Reset Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;