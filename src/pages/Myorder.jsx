import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Myorder.css';
import Footer from './Footer';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount || 0);
};

function Myorder() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = Cookies.get('accessToken');
    const BASE_URL = "https://ecommerce-project-backend-wm1z.onrender.com";

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) { setLoading(false); return; }
            try {
                const response = await axios.get(`${BASE_URL}/api/place-order-cod/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setOrders(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error(err);
            } finally { setLoading(false); }
        };
        fetchOrders();
    }, [token]);

    const getTrackerIndex = (status) => {
        const statuses = ['Order Placed', 'Packed','Shipped', 'Delivered'];
        return statuses.indexOf(status);
    };

    if (loading) return <div className="fk-loading">Loading orders...</div>;

    return (
        <div className="fk-orders-bg">
            <div className="fk-container">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="fk-order-card">
                            {order.items && order.items.map((item) => (
                                <div key={item.id} className="fk-item-section">
                                    <div className="fk-img-container">
                                        <img src={item.image || 'https://placehold.co/100'} alt="" />
                                    </div>
                                    <div className="fk-details-container">
                                        <p className="fk-product-name">{item.product_name}</p>
                                        <p className="fk-sub-text">Qty: {item.quantity}</p>
                                        <p className="fk-price">Total: {formatCurrency(order.total_amount)}</p>
                                    </div>
                                    <div className="fk-status-container">
                                        <p className="fk-status-main">
                                            <span className="fk-green-dot"></span> {order.status}
                                        </p>
                                        <p className="fk-delivery-subtext">
                                            {order.status === 'Delivered' ? 'Your item has been delivered' : 'Expected delivery soon'}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Tracking Timeline */}
                            <div className="fk-timeline">
                                <div className="fk-line-bg">
                                    <div
                                        className="fk-line-active"
                                        style={{ width: `${(getTrackerIndex(order.status) / 3) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="fk-steps">
                                    <div className={`fk-step ${getTrackerIndex(order.status) >= 0 ? 'done' : ''}`}>
                                        <div className="fk-circle">
                                            {getTrackerIndex(order.status) === 0 ? '⚽' : ''}
                                        </div>
                                        <span>Ordered</span>
                                    </div>
                                    <div className={`fk-step ${getTrackerIndex(order.status) >= 1 ? 'done' : ''}`}>
                                        <div className="fk-circle">
                                            {getTrackerIndex(order.status) === 1 ? '⚽' : ''}
                                        </div>
                                        <span>Packed</span>
                                    </div>
                                    <div className={`fk-step ${getTrackerIndex(order.status) >= 2 ? 'done' : ''}`}>
                                        <div className="fk-circle">
                                            {getTrackerIndex(order.status) === 2 ? '⚽' : ''}
                                        </div>
                                        <span>Shipped</span>
                                    </div>
                                    <div className={`fk-step ${getTrackerIndex(order.status) >= 3 ? 'done' : ''}`}>
                                        <div className="fk-circle">
                                            {getTrackerIndex(order.status) === 3 ? '⚽' : ''}
                                        </div>
                                        <span>Delivered</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="fk-empty">No orders found.</div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Myorder;