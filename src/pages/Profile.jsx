import React from 'react';
import './Profile.css';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaHeart, FaRightFromBracket, FaUserGear } from "react-icons/fa6";
import Cookies from 'js-cookie'; // js-cookie import cheythu
import { toast } from 'react-toastify';

function Profile() {
  const navigate = useNavigate();

  const userName = Cookies.get('userName'); 

  const handleLogout = () => {
    // 1. Frontend cookies clear
    Cookies.remove('userName');
    Cookies.remove('accessToken'); 
    Cookies.remove('refreshToken')
    toast.success('Logout successfully ')
    
    localStorage.clear(); 

    // 3. Redirect and Refresh
    navigate('/');
    window.location.reload(); 
  };

  return (
    <div className='profile-wrapper'>
      
      <div className='profile-container'>
        {userName ? (
          <div className='profile-content'>
            {/* Header Section */}
            <header className='profile-header'>
              <div className='profile-avatar'>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className='profile-welcome'>
                <h1>Welcome, <span className='highlight'>{userName}</span></h1>
                <p>Manage your account and track your elite gear.</p>
              </div>
            </header>

            {/* Dashboard Grid */}
            <div className='profile-grid'>
              <div className='dash-card' onClick={() => navigate('/orders')}>
                <FaBoxOpen className='dash-icon' />
                <h3>My Orders</h3>
                <p>Track your recent purchases</p>
              </div>

              <div className='dash-card' onClick={() => navigate('/wlist')}>
                <FaHeart className='dash-icon' />
                <h3>Wishlist</h3>
                <p>Items you've saved for later</p>
              </div>

              <div className='dash-card settings-card' onClick={()=>navigate('/profile-update')}>
                <FaUserGear className='dash-icon' />
                <h3>Settings</h3>
                <p>Update your profile details</p>
              </div>

              <div className='dash-card logout-card' onClick={handleLogout}>
                <FaRightFromBracket className='dash-icon' />
                <h3>Sign Out</h3>
                <p>Securely logout of your session</p>
              </div>
            </div>
          </div>
        ) : (
          <div className='not-logged-in'>
            <h1>Account Required</h1>
            <p>Please login to access your profile dashboard.</p>
            <button className='login-redirect-btn' onClick={() => navigate('/login')}>
              Login / Sign Up
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Profile;