import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, Trash2, MapPin, Package, X, Calendar, User } from 'lucide-react';
import './Adminorders.css';
import AdNavbar from '../../adminNavbar/AdNavbar';
import { toast } from 'react-toastify';

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className="ao-modal-overlay">
            <div className="ao-modal-content">
                <div className="ao-modal-header">
                    <div>
                        <h2 className="ao-modal-title">Order Details</h2>
                        <span className="ao-modal-id">#{order.id}</span>
                    </div>
                    <button className="ao-close-x" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="ao-modal-body">
                    <div className="ao-info-grid">
                        <div className="ao-info-section">
                            <h3 className="ao-section-title"><User size={16} /> Customer Info</h3>
                            <div className="ao-detail-card">
                                <p><strong>Name:</strong> {order.user_name}</p>
                                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="ao-info-section">
                            <h3 className="ao-section-title"><MapPin size={16} /> Shipping Address</h3>
                            <div className="ao-detail-card">
                                <p className="ao-address-text">{order.address}</p>
                            </div>
                        </div>
                    </div>

                    <h3 className="ao-section-title"><Package size={16} /> Order Items</h3>
                    <div className="ao-items-list">
                        {order.items?.map(item => (
                            <div key={item.id} className="ao-item-row">
                                <img 
                                    src={item.imgUrl || 'https://placehold.co/50'} 
                                    alt={item.product_name} 
                                    className="ao-item-thumb" 
                                />
                                <div className="ao-item-info">
                                    <span className="ao-item-name">{item.product_name}</span>
                                    <span className="ao-item-meta">Qty: {item.quantity} × ₹{item.price}</span>
                                </div>
                                <div className="ao-item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>

                    <div className="ao-modal-footer">
                        <div className="ao-total-container">
                            <span className="ao-total-label">Grand Total</span>
                            <span className="ao-total-value">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Adminorders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const API_URL = 'https://ecommerce-project-backend-wm1z.onrender.com/api/admin-orders/';

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setOrders(response.data);
        } catch (err) { toast.error("Failed to load orders"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.patch(`${API_URL}${orderId}/`, { status: newStatus });
            setOrders(orders.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
            toast.success("Status updated");
        } catch (err) { toast.error("Update failed"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this order record?")) {
            try {
                await axios.delete(`${API_URL}${id}/`);
                setOrders(orders.filter(o => o.id !== id));
                toast.info("Order deleted");
            } catch (err) { toast.error("Delete failed"); }
        }
    };

    const filtered = orders.filter(o => 
        o.id.toString().includes(searchTerm) || 
        o.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="ao-loader">Loading Orders...</div>;

    return (
        <div className="ao-main-wrapper">
            <AdNavbar />
            {isModalOpen && <OrderDetailsModal order={selectedOrder} onClose={() => setIsModalOpen(false)} />}

            <div className="ao-content-area">
                <header className="ao-top-bar">
                    <div className="ao-title-box">
                        <h1 className="ao-main-title">Orders Management</h1>
                        <p className="ao-main-subtitle">{orders.length} total transactions found</p>
                    </div>
                    <div className="ao-search-box">
                        <Search className="ao-search-icon" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by ID or Customer..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className="ao-table-container">
                    <table className="ao-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th className="ao-actions-head">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => (
                                <tr key={order.id}>
                                    <td data-label="Order ID"><span className="ao-id-badge">#{order.id}</span></td>
                                    <td data-label="Customer"><div className="ao-cust-name">{order.user_name}</div></td>
                                    <td data-label="Date"><div className="ao-date-cell">{new Date(order.created_at).toLocaleDateString()}</div></td>
                                    <td data-label="Amount" className="ao-amount-cell">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</td>
                                    <td data-label="Status">
                                        <select 
                                            className={`ao-status-dropdown status-${order.status.toLowerCase().replace(/\s/g, '-')}`}
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            <option value="Order Placed">Order Placed</option>
                                            <option value="Packed">Packed</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td data-label="Actions" className="ao-actions-cell">
                                        <button className="ao-view-btn" onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}><Eye size={18}/></button>
                                        <button className="ao-delete-btn" onClick={() => handleDelete(order.id)}><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}