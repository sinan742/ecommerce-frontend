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
            <div className='bn-cart-wrapper'>
                <h1 className='bn-cart-main-title'>Your <span className='bn-text-neon'>Bag</span></h1>
                
                {!userlog ? (
                    <div className='bn-auth-prompt'>
                        <h2>Your bag is waiting</h2>
                        <button className='bn-login-cta' onClick={() => navigate('/login')}>Login Now</button>
                    </div>
                ) : cart.length === 0 ? (
                    <div className='bn-empty-cart-state'>
                        <p>Your cart is empty.</p>
                        <button className='bn-shop-now-btn' onClick={() => navigate('/Products')}>Continue Shopping</button>
                    </div>
                ) : (
                    <div className='bn-cart-grid-layout'>
                        {/* Left Section: Items */}
                        <div className='bn-cart-list-container'>
                            {cart.map((item) => (
                                <div key={item.id} className='bn-cart-item-card'>
                                    <div className='bn-item-image-box'>
                                        <img 
                                            src={item.product?.image ? (item.product.image.startsWith('http') ? item.product.image : `${BASE_URL}${item.product.image}`) : 'https://via.placeholder.com/150'} 
                                            alt={item.product?.name} 
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                        />
                                    </div>
                                    <div className='bn-item-details-box'>
                                        <div className='bn-item-top-row'>
                                            <h3>{item.product?.name}</h3>
                                            <button className='bn-remove-item-link' onClick={() => removeCart(item.id)}>Remove</button>
                                        </div>
                                        <p className='bn-item-brand'>{item.product?.brand || 'Premium Quality'}</p>
                                        <div className='bn-item-bottom-row'>
                                            <div className='bn-qty-control'>
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                            </div>
                                            <div className='bn-item-subtotal'>₹{(parseFloat(item.product?.price) * item.quantity).toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className='bn-pagination-nav'>
                                <button disabled={!hasPrev} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
                                <span className='bn-page-info'>Page {currentPage}</span>
                                <button disabled={!hasNext} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                            </div>
                        </div>

                        {/* Right Section: Summary (Desktop) */}
                        <aside className='bn-summary-sidebar'>
                            <div className='bn-summary-sticky-card'>
                                <h3 className='bn-summary-title'>Order Summary</h3>
                                <div className='bn-summary-data-row'>
                                    <span>Subtotal</span>
                                    <span>₹{grandTotal.toFixed(2)}</span>
                                </div>
                                <div className='bn-summary-data-row'>
                                    <span>Shipping</span>
                                    <span>₹{shipping.toFixed(2)}</span>
                                </div>
                                <div className='bn-summary-divider'></div>
                                <div className='bn-summary-data-row bn-total-row'>
                                    <span>Total</span>
                                    <span className='bn-text-neon'>₹{(grandTotal + shipping).toFixed(2)}</span>
                                </div>
                                <button className='bn-desktop-checkout-btn' onClick={() => navigate('/checkout')}>
                                    Proceed to Checkout
                                </button>
                            </div>
                        </aside>

                        {/* Mobile Sticky Bar (Meesho Style) */}
                        <div className='bn-mobile-bottom-bar'>
                            <div className='bn-mobile-total-box'>
                                <span className='bn-m-label'>Total Amount</span>
                                <span className='bn-m-price'>₹{(grandTotal + shipping).toFixed(2)}</span>
                            </div>
                            <button className='bn-mobile-checkout-btn' onClick={() => navigate('/checkout')}>
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