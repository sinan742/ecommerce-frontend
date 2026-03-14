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
            setcart(res.data.results || []); 
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
            fetchCart(currentPage);
            fetchAllItemsForTotal();
            if (cart.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
        })
        .catch(err => console.error("Delete error:", err));
    };

    const shipping = grandTotal > 0 ? 50.00 : 0;

    return (
        <div className='btp-cart-master-container'>
            <div className='btp-cart-wrapper'>
                <h1 className='btp-cart-main-heading'>Your <span className='btp-neon-highlight'>Bag</span></h1>
                
                {!userlog ? (
                    <div className='btp-empty-state-card'>
                        <p>Join the pitch! Login to see your items.</p>
                        <button className='btp-neon-action-btn' onClick={() => navigate('/login')}>Login Now</button>
                    </div>
                ) : cart.length === 0 ? (
                    <div className='btp-empty-state-card'>
                        <p>Your bag is currently empty.</p>
                        <button className='btp-neon-action-btn' onClick={() => navigate('/Products')}>Start Shopping</button>
                    </div>
                ) : (
                    <div className='btp-cart-grid-system'>
                        {/* LEFT: Items List */}
                        <div className='btp-cart-items-list-area'>
                            {cart.map((item) => (
                                <div key={item.id} className='btp-cart-item-card'>
                                    <div className='btp-item-image-box'>
                                        <img src={item.product?.image ? (item.product.image.startsWith('http') ? item.product.image : `${BASE_URL}${item.product.image}`) : ''} alt={item.product?.name} />
                                    </div>
                                    <div className='btp-item-info-box'>
                                        <div className='btp-item-header-row'>
                                            <h3 className='btp-product-name-txt'>{item.product?.name}</h3>
                                            <button className='btp-item-delete-btn' onClick={() => removeCart(item.id)}>Remove</button>
                                        </div>
                                        <div className='btp-item-footer-row'>
                                            <div className='btp-qty-selector-widget'>
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                                <span className='btp-qty-count'>{item.quantity}</span>
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                            </div>
                                            <span className='btp-item-price-tag'>₹{(parseFloat(item.product?.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <div className='btp-pagination-control-bar'>
                                <button disabled={!hasPrev} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                                <span className='btp-page-number'>{currentPage}</span>
                                <button disabled={!hasNext} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                            </div>
                        </div>

                        {/* RIGHT: Desktop Summary */}
                        <aside className='btp-desktop-summary-panel'>
                            <div className='btp-summary-box-inner'>
                                <h3 className='btp-summary-title'>Order Summary</h3>
                                <div className='btp-summary-line'><span className='btp-label'>Subtotal</span><span className='btp-val'>₹{grandTotal.toFixed(2)}</span></div>
                                <div className='btp-summary-line'><span className='btp-label'>Shipping Charge</span><span className='btp-val'>₹{shipping.toFixed(2)}</span></div>
                                <div className='btp-summary-line btp-total-row'><span className='btp-label'>Grand Total</span><span className='btp-val'>₹{(grandTotal + shipping).toFixed(2)}</span></div>
                                <button className='btp-checkout-primary-btn' onClick={() => navigate('/checkout')}>Secure Checkout</button>
                            </div>
                        </aside>

                        {/* MOBILE: Sticky Footer */}
                        <div className='btp-mobile-sticky-footer'>
                            <div className='btp-mobile-price-group'>
                                <span className='btp-mobile-label'>Total Payable</span>
                                <h2 className='btp-mobile-total-price'>₹{(grandTotal + shipping).toFixed(2)}</h2>
                            </div>
                            <button className='btp-mobile-cta-btn' onClick={() => navigate('/checkout')}>Checkout</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Carts;