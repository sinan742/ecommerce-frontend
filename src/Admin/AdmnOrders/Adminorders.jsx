import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, Trash2, MapPin, Package, X } from 'lucide-react';
import './Adminorders.css';
import AdNavbar from '../../adminNavbar/AdNavbar';
import { toast } from 'react-toastify';

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className="ao-modal-overlay">
            <div className="ao-modal-content">
                <div className="ao-modal-header">
                    <h2 className="ao-modal-title">Order #{order.id}</h2>
                    <button className="ao-close-x" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="ao-modal-body">
                    <div className="ao-info-section">
                        <h3 className="ao-section-title"><MapPin size={18} /> Shipping Address</h3>
                        <div className="ao-address-card">
                            <p><strong>Customer:</strong> {order.user_name}</p>
                            <p className="ao-address-text"><strong>Address:</strong> {order.address}</p>
                            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <h3 className="ao-section-title"><Package size={18} /> Items ({order.items?.length || 0})</h3>
                    <div className="ao-items-container">
                        {order.items?.map(item => (
                            <div key={item.id} className="ao-item-card">
                                <div className="ao-item-main">
                                    <img 
                                        src={item.image || 'https://placehold.co/60?text=Product'} 
                                        alt={item.product_name} 
                                        className="ao-item-img" 
                                    />
                                    <div className="ao-item-details">
                                        <span className="ao-item-name">{item.product_name}</span>
                                        <span className="ao-item-meta">Qty: {item.quantity} | ₹{item.price}</span>
                                    </div>
                                </div>
                                <div className="ao-item-subtotal">
                                    <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="ao-summary-footer">
                        <div className="ao-total-row">
                            <span>Total Amount</span> 
                            <span className="ao-grand-total">₹{parseFloat(order.total_amount).toFixed(2)}</span>
                        </div>
                        <div className="ao-badge-row">
                             <span className={`ao-pay-badge ${order.is_paid ? "ao-paid" : "ao-unpaid"}`}>
                                {order.is_paid ? "Payment Verified" : "Pending / COD"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Adminorders() {
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
        } catch (err) {
            toast.error("Could not fetch orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.patch(`${API_URL}${orderId}/`, { status: newStatus });
            setOrders(orders.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
            toast.success(`Status updated to ${newStatus}`);
        } catch (err) {
            toast.error("Failed to update status.");
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm(`Delete order #${orderId}?`)) {
            try {
                await axios.delete(`${API_URL}${orderId}/`);
                setOrders(orders.filter(o => o.id !== orderId));
                toast.info("Order deleted.");
            } catch (err) {
                toast.error("Delete failed.");
            }
        }
    };

    const filteredOrders = orders.filter(order =>
        (order.id?.toString() || '').includes(searchTerm) ||
        (order.user_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="ao-loading"><h2>Loading Orders...</h2></div>;

    return (
        <div className="ao-page-wrapper">
            <AdNavbar />
            {isModalOpen && <OrderDetailsModal order={selectedOrder} onClose={() => setIsModalOpen(false)} />}

            <div className="ao-container">
                <header className="ao-header">
                    <div className="ao-header-left">
                        <h1 className="ao-page-title">Order Management</h1>
                        <p className="ao-subtitle">Manage customer transactions.</p>
                    </div>
                    <div className="ao-search-wrapper">
                        <Search className="ao-search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search Order ID or Customer..."
                            className="ao-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className="ao-table-card">
                    <table className="ao-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th className="ao-hide-mobile">Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th className="ao-text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td data-label="Order ID"><span className="ao-id-tag">#{order.id}</span></td>
                                    <td data-label="Customer"><span className="ao-customer-name">{order.user_name}</span></td>
                                    <td data-label="Date" className="ao-hide-mobile">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td data-label="Total" className="ao-price-cell">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</td>
                                    <td data-label="Status">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`ao-status-select ao-status-${order.status.replace(/\s+/g, '-').toLowerCase()}`}
                                        >
                                            <option value="Order Placed">Order Placed</option>
                                            <option value="Packed">Packed</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td data-label="Actions" className="ao-text-right">
                                        <div className="ao-actions">
                                            <button onClick={() => handleOpenModal(order)} className="ao-btn-view" title="View"><Eye size={18} /></button>
                                            <button onClick={() => handleDeleteOrder(order.id)} className="ao-btn-delete" title="Delete"><Trash2 size={18} /></button>
                                        </div>
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

export default Adminorders;