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
        <div className='bn-cart-page'>
            <div className='bn-cart-container'>
                <h1 className='bn-cart-title'>Your <span className='bn-text-neon'>Bag</span></h1>
                
                {!userlog ? (
                    <div className='bn-auth-notice'>
                        <h2>Your bag is waiting</h2>
                        <button className='bn-login-btn' onClick={() => navigate('/login')}>Login Now</button>
                    </div>
                ) : cart.length === 0 ? (
                    <div className='bn-empty-state'>
                        <p>Your cart is empty.</p>
                        <button className='bn-shop-btn' onClick={() => navigate('/Products')}>Continue Shopping</button>
                    </div>
                ) : (
                    <div className='bn-cart-grid'>
                        {/* Left Side: Items List */}
                        <div className='bn-cart-items-wrapper'>
                            {cart.map((item) => (
                                <div key={item.id} className='bn-cart-card'>
                                    <div className='bn-cart-card-img'>
                                        <img 
                                            src={item.product?.image ? (item.product.image.startsWith('http') ? item.product.image : `${BASE_URL}${item.product.image}`) : 'https://via.placeholder.com/150'} 
                                            alt={item.product?.name} 
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                        />
                                    </div>
                                    <div className='bn-cart-card-info'>
                                        <div className='bn-info-header'>
                                            <h3>{item.product?.name}</h3>
                                            <button className='bn-remove-btn' onClick={() => removeCart(item.id)}>Remove</button>
                                        </div>
                                        <p className='bn-brand-text'>{item.product?.brand || 'Premium'}</p>
                                        <div className='bn-info-footer'>
                                            <div className='bn-qty-selector'>
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                            </div>
                                            <div className='bn-item-price'>₹{(parseFloat(item.product?.price) * item.quantity).toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination Buttons */}
                            <div className='bn-pagination'>
                                <button className='bn-page-nav' disabled={!hasPrev} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
                                <span className='bn-page-indicator'>Page {currentPage}</span>
                                <button className='bn-page-nav' disabled={!hasNext} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                            </div>
                        </div>

                        {/* Right Side Summary (Desktop Only) */}
                        <aside className='bn-desktop-sidebar'>
                            <div className='bn-summary-card'>
                                <h3>Order Summary</h3>
                                <div className='bn-summary-row'>
                                    <span>Subtotal</span>
                                    <span>₹{grandTotal.toFixed(2)}</span>
                                </div>
                                <div className='bn-summary-row'>
                                    <span>Shipping</span>
                                    <span>₹{shipping.toFixed(2)}</span>
                                </div>
                                <div className='bn-summary-divider'></div>
                                <div className='bn-summary-row bn-total-line'>
                                    <span>Total</span>
                                    <span className='bn-text-neon'>₹{(grandTotal + shipping).toFixed(2)}</span>
                                </div>
                                <button className='bn-checkout-main-btn' onClick={() => navigate('/checkout')}>
                                    Proceed to Checkout
                                </button>
                            </div>
                        </aside>

                        {/* Mobile Sticky Footer Bar */}
                        <div className='bn-mobile-sticky-footer'>
                            <div className='bn-mobile-price-group'>
                                <span className='bn-m-label'>Total Amount</span>
                                <span className='bn-m-price'>₹{(grandTotal + shipping).toFixed(2)}</span>
                            </div>
                            <button className='bn-mobile-continue-btn' onClick={() => navigate('/checkout')}>
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