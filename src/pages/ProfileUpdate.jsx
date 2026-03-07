import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import './ProfileUpdate.css'
import { useNavigate } from 'react-router-dom';

function ProfileUpdate() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });

    const token = Cookies.get('accessToken');
    const BASE_URL = "https://ecommerce-project-backend-wm1z.onrender.com";

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        axios.get(`${BASE_URL}/api/profile/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => setUserData(res.data))
        .catch(err => console.error(err));
    }, [token, navigate]);

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`${BASE_URL}/api/profile/`, userData, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(() => {
            toast.success("Profile updated!");
            // English: Navigate only after success
            navigate('/profile'); 
        })
        .catch((err) => {
            toast.error("Update failed.");
            console.error(err);
        });
    };

    return (
        <div className="pu-container">
            <div className="pu-card">
                <div className="pu-avatar">👤</div>
                <h2 className="pu-title">Edit <span className="pu-highlight">Profile</span></h2>
                
                <form className="pu-form" onSubmit={handleUpdate}>
                    <div className="pu-input-group">
                        <label>First Name</label>
                        <input 
                            type="text" 
                            value={userData.first_name} 
                            onChange={(e) => setUserData({...userData, first_name: e.target.value})} 
                            placeholder="Enter first name"
                            required
                        />
                    </div>

                    <div className="pu-input-group">
                        <label>Last Name</label>
                        <input 
                            type="text" 
                            value={userData.last_name} 
                            onChange={(e) => setUserData({...userData, last_name: e.target.value})} 
                            placeholder="Enter last name"
                            required
                        />
                    </div>

                    <div className="pu-input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            value={userData.email} 
                            onChange={(e) => setUserData({...userData, email: e.target.value})} 
                            placeholder="example@gmail.com"
                            required
                        />
                    </div>

                    <button type="submit" className="pu-save-btn">Save Changes</button>
                    <button type="button" className="pu-cancel-btn" onClick={() => navigate('/profile')}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default ProfileUpdate;