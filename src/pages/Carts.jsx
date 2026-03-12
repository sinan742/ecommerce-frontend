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
        <div className='cart-view-container'>
            <div className='cart-main-content'>
                <h1 className='cart-header-title'>Shopping <span className='neon-txt'>Cart</span></h1>
                
                {!userlog ? (
                    <div className='no-auth-box'>
                        <p>Please login to see your cart.</p>
                        <button onClick={() => navigate('/login')}>Login Now</button>
                    </div>
                ) : cart.length === 0 ? (
                    <div className='empty-cart-box'>
                        <p>Your bag is empty!</p>
                        <button onClick={() => navigate('/Products')}>Shop Products</button>
                    </div>
                ) : (
                    <div className='cart-layout-grid'>
                        {/* List Area */}
                        <div className='cart-items-column'>
                            {cart.map((item) => (
                                <div key={item.id} className='cart-product-strip'>
                                    <div className='product-thumb'>
                                        <img src={item.product?.image ? (item.product.image.startsWith('http') ? item.product.image : `${BASE_URL}${item.product.image}`) : ''} alt="" />
                                    </div>
                                    <div className='product-details'>
                                        <div className='row-between'>
                                            <h3>{item.product?.name}</h3>
                                            <button className='rm-btn' onClick={() => removeCart(item.id)}>Remove</button>
                                        </div>
                                        <div className='row-between mt-10'>
                                            <div className='qty-tool'>
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                            </div>
                                            <span className='price-bold'>₹{(parseFloat(item.product?.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Pagination Controls */}
                            <div className='pagination-bar'>
                                <button disabled={!hasPrev} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
                                <span>{currentPage}</span>
                                <button disabled={!hasNext} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                            </div>
                        </div>

                        {/* Desktop Sidebar */}
                        <aside className='cart-sidebar-desktop'>
                            <div className='summary-inner-box'>
                                <h3>Price Details</h3>
                                <div className='sum-row'><span>Items Subtotal</span><span>₹{grandTotal.toFixed(2)}</span></div>
                                <div className='sum-row'><span>Delivery Fee</span><span>₹{shipping.toFixed(2)}</span></div>
                                <hr />
                                <div className='sum-row grand-total'><span>Total Pay</span><span>₹{(grandTotal + shipping).toFixed(2)}</span></div>
                                <button className='checkout-cta' onClick={() => navigate('/checkout')}>Checkout Now</button>
                            </div>
                        </aside>

                        {/* MOBILE STICKY FOOTER */}
                        <div className='mobile-checkout-sticky-bar'>
                            <div className='sticky-price-info'>
                                <p>Payable Amount</p>
                                <h2>₹{(grandTotal + shipping).toFixed(2)}</h2>
                            </div>
                            <button className='sticky-continue-btn' onClick={() => navigate('/checkout')}>Continue</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Carts;