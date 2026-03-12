import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

function Carts() {
    const navigate = useNavigate();
    const [cart, setcart] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const [grandTotal, setGrandTotal] = useState(0);

    const userlog = Cookies.get('userName'); 
    const token = Cookies.get('accessToken');
    const BASE_URL = "https://ecommerce-project-backend-wm1z.onrender.com";

    useEffect(() => {
        if (userlog) {
            fetchCart(currentPage);
            fetchAllItemsForTotal();
        }
    }, [userlog, currentPage]);

    const fetchCart = (page) => {
        axios.get(`${BASE_URL}/api/cart/?page=${page}`, { 
            headers: { 'Authorization': `Bearer ${token}` },
            withCredentials: true 
        })
        .then((res) => {
            setcart(res.data.results); 
            setHasNext(!!res.data.next);
            setHasPrev(!!res.data.previous);
        })
        .catch((err) => console.error("Fetch error:", err));
    };

    const fetchAllItemsForTotal = () => {
        axios.get(`${BASE_URL}/api/cart/?all=true`, { 
            headers: { 'Authorization': `Bearer ${token}` },
            withCredentials: true 
        })
        .then((res) => {
            const allItems = res.data; 
            const totalSum = allItems.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
            setGrandTotal(totalSum);
        })
        .catch((err) => console.error("Total calculation error:", err));
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        axios.put(`${BASE_URL}/api/cart/${itemId}/`, 
            { quantity: newQuantity }, 
            { headers: { 'Authorization': `Bearer ${token}` }, withCredentials: true }
        )
        .then(() => {
            fetchCart(currentPage);
            fetchAllItemsForTotal();
            window.dispatchEvent(new Event("cartUpdated"));
        })
        .catch(err => console.error("Update error:", err));
    };

    const removeCart = (itemId) => {
        axios.delete(`${BASE_URL}/api/cart/${itemId}/`, { 
            headers: { 'Authorization': `Bearer ${token}` },
            withCredentials: true 
        })
        .then(() => {
            toast.success("Item removed");
            window.dispatchEvent(new Event("cartUpdated"));
            window.dispatchEvent(new Event("storage_updated"));
            fetchCart(currentPage);
            fetchAllItemsForTotal();
            if (cart.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
        })
        .catch(err => console.error("Delete error:", err));
    };

    const shipping = grandTotal > 0 ? 50.00 : 0;

    return (
        <div className='cart-page'>
            <div className='cart-container'>
                <h1 className='cart-title'>Your <span className='highlight'>Bag</span></h1>
                
                {!userlog ? (
                    <div className='auth-notice'>
                        <h2>Your bag is waiting</h2>
                        <button className='login-link-btn' onClick={() => navigate('/login')}>Login Now</button>
                    </div>
                ) : cart.length === 0 ? (
                    <div className='empty-state'>
                        <p>Your cart is empty.</p>
                        <button className='shop-btn' onClick={() => navigate('/Products')}>Continue Shopping</button>
                    </div>
                ) : (
                    <div className='cart-content-wrapper'>
                        {/* Left Side: Items List */}
                        <div className='cart-items-section'>
                            {cart.map((item) => (
                                <div key={item.id} className='cart-card'>
                                    <div className='cart-card-img'>
                                        <img 
                                            src={item.product?.image ? (item.product.image.startsWith('http') ? item.product.image : `${BASE_URL}${item.product.image}`) : 'https://via.placeholder.com/150'} 
                                            alt={item.product?.name} 
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                        />
                                    </div>
                                    <div className='cart-card-info'>
                                        <div className='info-top'>
                                            <h3>{item.product?.name}</h3>
                                            <button className='delete-icon-btn' onClick={() => removeCart(item.id)}>Remove</button>
                                        </div>
                                        <p className='brand-name'>{item.product?.brand}</p>
                                        <div className='info-bottom'>
                                            <div className='qty-box'>
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                            </div>
                                            <div className='price-tag'>₹{(parseFloat(item.product?.price) * item.quantity).toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className='pagination'>
                                <button disabled={!hasPrev} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
                                <span>Page {currentPage}</span>
                                <button disabled={!hasNext} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                            </div>
                        </div>

                        {/* Right Side: Order Summary (Desktop Only) */}
                        <aside className='summary-sidebar'>
                            <div className='summary-card'>
                                <h3>Order Summary</h3>
                                <div className='summary-row'>
                                    <span>Subtotal</span>
                                    <span>₹{grandTotal.toFixed(2)}</span>
                                </div>
                                <div className='summary-row'>
                                    <span>Shipping</span>
                                    <span>₹{shipping.toFixed(2)}</span>
                                </div>
                                <div className='summary-divider'></div>
                                <div className='summary-row total'>
                                    <span>Total</span>
                                    <span className='neon-text'>₹{(grandTotal + shipping).toFixed(2)}</span>
                                </div>
                                <button className='main-checkout-btn' onClick={() => navigate('/checkout')}>
                                    Proceed to Checkout
                                </button>
                            </div>
                        </aside>

                        {/* Mobile Sticky Bar (Visible only on Mobile) */}
                        <div className='mobile-sticky-checkout'>
                            <div className='m-price-details'>
                                <span className='m-label'>Total Amount</span>
                                <span className='m-amount'>₹{(grandTotal + shipping).toFixed(2)}</span>
                            </div>
                            <button className='m-checkout-btn' onClick={() => navigate('/checkout')}>
                                Continue
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Carts;