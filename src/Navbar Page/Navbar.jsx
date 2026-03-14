import React, { useEffect, useState, useCallback } from 'react';
import './Navbar.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaHeart, FaBagShopping, FaHouse, FaFutbol, FaTruckFast, FaCircleUser } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi"; 
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [userlog, setUserlog] = useState(Cookies.get('accessToken'));
  const [username, setUsername] = useState(Cookies.get('userName'));
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const BASE_URL = "https://ecommerce-project-backend-wm1z.onrender.com";

  const fetchCounts = useCallback(async () => {
    const token = Cookies.get('accessToken');
    if (!token) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }
    try {
      const cartRes = await axios.get(`${BASE_URL}/api/cart/`, { withCredentials: true });
      setCartCount(cartRes.data.count || cartRes.data.length || 0);
      const wishRes = await axios.get(`${BASE_URL}/api/wishlist/`, { withCredentials: true });
      setWishlistCount(wishRes.data.count || wishRes.data.length || 0);
    } catch (err) {
      if (err.response && err.response.status === 401) handleLogout();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/logout/`, {}, { withCredentials: true });
    } catch (err) {
      console.log("Logout error");
    } finally {
      Cookies.remove('userName');
      Cookies.remove('accessToken'); 
      Cookies.remove('refreshToken');
      localStorage.clear(); 
      setUserlog(null);
      setUsername(null);
      setCartCount(0);
      setWishlistCount(0);
      toast.success("Logged out");
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchCounts();
    window.addEventListener("cartUpdated", fetchCounts);
    window.addEventListener("wishlistUpdated", fetchCounts);
    window.addEventListener("storage_updated", fetchCounts);
    return () => {
      window.removeEventListener("cartUpdated", fetchCounts);
      window.removeEventListener("wishlistUpdated", fetchCounts);
      window.removeEventListener("storage_updated", fetchCounts);
    };
  }, [fetchCounts, location.pathname]); 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* --- TOP NAVBAR (Desktop) --- */}
      <nav className={`nav-container ${scrolled ? 'nav-active' : ''}`}>
        <div className='nav-brand' onClick={() => navigate('/')}>
          BEYOND <span className='brand-accent'>THE PITCH</span>
        </div>

        <ul className='nav-links desktop-only'>
          <li><NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>Home</NavLink></li>
          <li><NavLink to="/Products" className={({ isActive }) => isActive ? 'active-link' : ''}>Store</NavLink></li>
          <li><NavLink to="/orders" className={({ isActive }) => isActive ? 'active-link' : ''}>Orders</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active-link' : ''}>About</NavLink></li>
        </ul>

        <div className='nav-actions'>
          <div className={`icon-wrapper ${location.pathname === '/wlist' ? 'active-action' : ''}`} onClick={() => navigate('/wlist')}>
            <FaHeart className='nav-icon' />
            {wishlistCount > 0 && <span className='badge'>{wishlistCount}</span>}
          </div>

          <div className={`icon-wrapper ${location.pathname === '/carts' ? 'active-action' : ''}`} onClick={() => navigate('/carts')}>
            <FaBagShopping className='nav-icon' />
            {cartCount > 0 && <span className='badge'>{cartCount}</span>}
          </div>

          <div className='user-section desktop-only'>
            {userlog ? (
              <div className='user-logged-in'>
                <div className='profile-trigger' onClick={() => navigate('/profile')}>
                  <span className='welcome-text'>Hi, {username}</span>
                </div>
                <BiLogOut className='nav-icon logout-icon' onClick={handleLogout} />
              </div>
            ) : (
              <button className='login-bt' onClick={() => navigate('/login')}>Login</button>
            )}
          </div>
        </div>
      </nav>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="mobile-bottom-nav">
        <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <FaHouse />
          <span>Home</span>
        </NavLink>
        <NavLink to="/Products" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <FaFutbol />
          <span>Store</span>
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <FaTruckFast />
          <span>Orders</span>
        </NavLink>
        <NavLink to={userlog ? "/profile" : "/login"} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <FaCircleUser />
          <span>Account</span>
        </NavLink>
      </div>
    </>
  );
}

export default Navbar;