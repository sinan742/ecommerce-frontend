import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, Trash2, MapPin, Package } from 'lucide-react';
import './Adminorders.css';
import AdNavbar from '../../adminNavbar/AdNavbar';
import { toast } from 'react-toastify';

// Modal component remains the same... (no changes needed there)

function Adminorders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const API_URL = 'https://ecommerce-project-backend-wm1z.onrender.com/api/admin-orders/';

    // ⭐ പ്രധാനപ്പെട്ട മാറ്റം: ടോക്കൺ ഹെഡർ ജനറേറ്റ് ചെയ്യുന്നു
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token'); // നിങ്ങളുടെ ലോഗിൻ ടോക്കൺ കീ 'token' ആണെന്ന് ഉറപ്പാക്കുക
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL, getAuthHeaders());
            setOrders(response.data);
        } catch (err) {
            console.error("Fetch error:", err.response);
            toast.error("പെർമിഷൻ ഇല്ല അല്ലെങ്കിൽ സർവർ ഡൗൺ ആണ്.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.patch(`${API_URL}${orderId}/`, { status: newStatus }, getAuthHeaders());
            setOrders(orders.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
            toast.success(`Status updated to ${newStatus}`);
        } catch (err) {
            toast.error("സ്റ്റാറ്റസ് മാറ്റാൻ സാധിച്ചില്ല.");
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm(`Delete order #${orderId}?`)) {
            try {
                await axios.delete(`${API_URL}${orderId}/`, getAuthHeaders());
                setOrders(orders.filter(o => o.id !== orderId));
                toast.info("Order deleted.");
            } catch (err) {
                toast.error("ഡിലീറ്റ് പരാജയപ്പെട്ടു.");
            }
        }
    };

    // Filter logic and JSX remain the same...
    const filteredOrders = orders.filter(order =>
        (order.id?.toString() || '').includes(searchTerm) ||
        (order.user_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="ao-loading"><h2>Loading Orders...</h2></div>;

    return (
        <div className="ao-page-wrapper">
            <AdNavbar />
            {/* ... Modal and table JSX same as your provided code ... */}
        </div>
    );
}

export default Adminorders;