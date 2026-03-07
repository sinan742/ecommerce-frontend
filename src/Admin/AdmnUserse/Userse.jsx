import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Search } from 'lucide-react';
import './Userse.css'
import AdNavbar from '../../adminNavbar/AdNavbar';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

function Userse() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = 'https://ecommerce-project-backend-wm1z.onrender.com/api/users/';

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = Cookies.get('accessToken');
                const response = await axios.get(API_URL, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Could not fetch user data. Check backend connection.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []); 

    const handleStatusChange = async (userId, newStatus) => {
        try {
            const token = Cookies.get('accessToken');
            const response = await axios.patch(`${API_URL}${userId}/`, 
                { status: newStatus },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            setUsers(users.map(user => user.id === userId ? response.data : user));
            toast.success(`User ${response.data.username} status updated to ${newStatus}.`);
        } catch (err) {
            console.error("Error updating status:", err);
            toast.error("Failed to update status.");
        }
    };

    const filteredUsers = users.filter(user =>
        (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="usm-loading-state"><h2>Loading Users...</h2></div>;
    if (error) return <div className="usm-error-state"><h2>{error}</h2></div>;

    return (
        <div className="usm-admin-page-root">
            <AdNavbar/>
            <div className="usm-page-container">
                <div className="usm-header-box">
                    <h1 className="usm-main-title">User Management</h1>
                    <p className="usm-sub-text">Monitor and control player account access</p>
                </div>

                <div className="usm-search-box-wrapper">
                    <div className="usm-search-field">
                        <Search className="usm-search-icon-svg" size={20} />
                        <input
                            type="text"
                            placeholder="Search by username or email..."
                            className="usm-search-input-tag"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filteredUsers.length > 0 ? (
                    <div className="usm-users-grid-layout">
                        {filteredUsers.map((user) => (
                            <div key={user.id} className="usm-user-profile-card">
                                <div className="usm-card-top">
                                    <div className="usm-user-initial-circle" style={{background: user.status === 'Blocked' ? '#ff4d4d' : '#007bff'}}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="usm-user-text-info">
                                        <h3 className="usm-user-name-label">{user.username}</h3>
                                        <p className="usm-user-email-label">{user.email}</p>
                                    </div>
                                </div>
                                <div className="usm-card-bottom-actions">
                                    <span className="usm-action-label">Account Status</span>
                                    <select 
                                        value={user.status} 
                                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                        className={`usm-status-dropdown usm-dropdown-${user.status}`}
                                    >
                                        <option value="Active">Active ✅</option>
                                        <option value="Blocked">Blocked 🚫</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="usm-empty-results">No users found matching your search.</div>
                )}
            </div>
        </div>
    );
}

export default Userse;