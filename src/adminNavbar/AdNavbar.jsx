import './AdNavbar.css'
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'


function AdNavbar() {
 const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const navigate=useNavigate()  


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const Logout =()=>{
      navigate('/login')
      
  }


  return (
    <>
      
      <nav className="navbar">
        <div className="navbar-left">
          <button onClick={toggleSidebar} className="menu-button">
            <Menu size={35} />
          </button>
          <h3>Admin Panel</h3>
        </div>
        
        
      </nav>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Admin Menu</h3>
          <button onClick={toggleSidebar} className="close-button">
            <X size={24} />
          </button>
        </div>
        <ul className="sidebar-links">
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/users">Users</a></li>
          <li><a href="/adproducts">Products</a></li>
          <li><a href="/adorders">Orders</a></li>
        </ul>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={Logout} >Logout</button>
        </div>
      </div>

      
    </>
  );
}

export default AdNavbar
