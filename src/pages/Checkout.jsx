import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import './Checkout.css';
import Navbar from '../Navbar Page/Navbar';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

function Checkout() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totals, setTotals] = useState({ subtotal: 0, shipping: 50, total: 0 });
    const [isLoading, setIsLoading] = useState(false); 

    const [address, setAddress] = useState('');

    const BASE_URL = "https://ecommerce-project-backend-wm1z.onrender.com";
    const token = Cookies.get('accessToken'); 
    const username = Cookies.get('userName');

    useEffect(() => {
        if (!token) {
            toast.error("Session expired. Please login again.");
            navigate('/login', { replace: true });
            return;
        }

        // Fetching cart items
        axios.get(`${BASE_URL}/api/cart/?all=true`, {
            headers: { 'Authorization': `Bearer ${token}` },
            withCredentials: true
        })
        .then((res) => {
            const items = Array.isArray(res.data) ? res.data : (res.data.results || []);
            setCartItems(items);
            
            const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
            const shipping = 50.00; 
            setTotals({
                subtotal: subtotal,
                shipping: shipping,
                total: subtotal + shipping
            });
        })
        .catch((err) => {
            console.error("Error fetching cart:", err);
            toast.error("Failed to load cart items.");
        });
    }, [token, navigate]);

    const handlePlaceOrder = async (e) => {
        if (e) e.preventDefault();

        if (cartItems.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        if (!address.trim()) {
            toast.error("Please enter your delivery address!");
            return;
        }

        setIsLoading(true);

        try {
            const config = { 
                headers: { 'Authorization': `Bearer ${token}` },
                withCredentials: true 
            };

            const orderData = { 
                total_amount: totals.total,
                address: address 
            };

            const response = await axios.post(`${BASE_URL}/api/place-order-cod/`, orderData, config);

            if (response.status === 201) {
                toast.success("Goal! Order Placed Successfully.");
                navigate('/success', { replace: true });
            }
        } catch (error) {
            console.error("Order error:", error.response?.data);
            toast.error(error.response?.data?.error || "Could not place order.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='checkout-wrapper'>
            <Navbar/>
            <div className='checkout-container'>
                <div className='checkout-glass-card'>
                    <h2 className='checkout-heading'>Confirm <span className='highlight'>Order</span></h2>
                    
                    <div className="address-section">
                        <label className="label-text">Delivery Address</label>
                        <textarea 
                            className="address-textarea"
                            placeholder="Type your address here (e.g., Home No, Street, City, PIN)..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)} 
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="order-items-summary">
                        <h3 className="summary-title">Summary</h3>
                        {cartItems.length > 0 ? (
                            cartItems.map(item => (
                                <div className="summary-row-item" key={item.id}>
                                    <div className='item-desc-col'>
                                        <p className='item-name-text'>{item.product.name} (x{item.quantity})</p>
                                    </div>
                                    <span className='item-price-text'>₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                                </div>
                            ))
                        ) : (
                            <p className="empty-msg">No items in cart.</p>
                        )}
                    </div>

                    <div className='bill-divider'></div>

                    <div className="bill-breakdown">
                        <div className="bill-row">
                            <span>Subtotal</span>
                            <span>₹{totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="bill-row">
                            <span>Delivery Fee</span>
                            <span>₹{totals.shipping.toFixed(2)}</span>
                        </div>
                        <div className="bill-row grand-total">
                            <strong>Total Amount</strong>
                            <strong className='neon-price'>₹{totals.total.toFixed(2)}</strong>
                        </div>
                    </div>

                    {/* 4. Confirm Button */}
                    <button 
                        className="confirm-order-btn" 
                        onClick={handlePlaceOrder} 
                        disabled={isLoading || cartItems.length === 0}
                    >
                        {isLoading ? 'Processing...' : 'Place Order (COD)'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Checkout;