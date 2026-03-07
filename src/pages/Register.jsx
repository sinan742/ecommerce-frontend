import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Register.css';

export default function Register() {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state add cheythu

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'User Name is required.';
    if (!formData.email) {
      tempErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Enter a valid email.';
    }
    if (!formData.password) {
      tempErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Must be at least 6 characters.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true); 

      const djangoData = {
        username: formData.name, 
        email: formData.email,
        password: formData.password
      };

      axios.post('https://ecommerce-project-backend-wm1z.onrender.com/api/register/', djangoData)
        .then(res => {
          setLoading(false);
          toast.success("OTP sent to your email!");
          navigate('/verify-otp', { state: { email: formData.email } });
        })
        .catch(err => {
          setLoading(false);
          console.error(err.response?.data);
          const backendError = err.response?.data?.username || err.response?.data?.email || "Registration failed!";
          toast.error(backendError);
        });
    }
  };

  return (
    <div className='register-page-wrapper'>
      <div className='register-glass-card'>
        <div className='register-header'>
          <h2>JOIN THE <span className='highlight'>TEAM</span></h2>
          <p>Create an account to start your journey.</p>
        </div>

        <form className='register-form' onSubmit={handleSubmit}>
          <div className='input-group'>
            <label>User Name</label>
            <input
              type="text"
              placeholder='Enter your name'
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className='err-text'>{errors.name}</span>}
          </div>

          <div className='input-group'>
            <label>Email Address</label>
            <input
              type="email"
              placeholder='example@pitch.com'
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className='err-text'>{errors.email}</span>}
          </div>

          <div className='input-group'>
            <label>Password</label>
            <input
              type="password"
              placeholder='Min. 6 characters'
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className='err-text'>{errors.password}</span>}
          </div>

          <button type="submit" disabled={loading} className='register-submit-btn'>
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>

        <div className='register-footer'>
          <span>Already a member?</span>
          <button className='login-link' onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}