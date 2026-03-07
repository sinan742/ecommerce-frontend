import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

function Carts() {
    const navigate = useNavigate();
    const [cart, setcart] = useState([]);
    
    // Pagination States
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
            
            // Navbar update item count
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
            
            // Navbar item remove count
            window.dispatchEvent(new Event("cartUpdated"));
            window.dispatchEvent(new Event("storage_updated"));

            fetchCart(currentPage);
            fetchAllItemsForTotal();

            if (cart.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        })
        .catch(err => console.error("Delete error:", err));
    };

    const shipping = grandTotal > 0 ? 50.00 : 0;

    return (
        <div className='cart-page'>
            <div className='cart-container'>
                <div className='cart-main-content'>
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
                        <>
                            <div className='cart-items-list'>
                                {cart.map((item) => (
                                    <div key={item.id} className='cart-item-card'>
                                        <div className='cart-item-img'>
                                            <img 
                                                src={item.product.image.startsWith('http') ? item.product.image : `${BASE_URL}${item.product.image}`} 
                                                alt={item.product.name} 
                                            />
                                        </div>
                                        <div className='cart-item-details'>
                                            <div className='item-header'>
                                                <h3>{item.product.name}</h3>
                                                <button className='remove-btn' onClick={() => removeCart(item.id)}>Remove</button>
                                            </div>
                                            <div className='item-controls'>
                                                <div className='qty-selector'>
                                                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                                </div>
                                                <div className='item-total-price'>
                                                    ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='pagination-container' style={{display: 'flex', gap: '20px', marginTop: '30px', justifyContent: 'center'}}>
                                <button className='page-btn' disabled={!hasPrev} onClick={() => setCurrentPage(prev => prev - 1)} style={{opacity: hasPrev ? 1 : 0.5}}>Previous</button>
                                <span style={{color: '#39FF14', fontWeight: 'bold'}}>Page {currentPage}</span>
                                <button className='page-btn' disabled={!hasNext} onClick={() => setCurrentPage(prev => prev + 1)} style={{opacity: hasNext ? 1 : 0.5}}>Next</button>
                            </div>
                        </>
                    )}
                </div>

                {userlog && grandTotal > 0 && (
                    <aside className='cart-sidebar'>
                        <div className='order-summary-card'>
                            <h2>Order Summary</h2>
                            <div className='summary-line'>
                                <span>Subtotal (All Pages)</span>
                                <span>₹{grandTotal.toFixed(2)}</span>
                            </div>
                            <div className='summary-line'>
                                <span>Shipping</span>
                                <span>₹{shipping.toFixed(2)}</span>
                            </div>
                            <div className='summary-divider'></div>
                            <div className='summary-line total'>
                                <span>Total</span>
                                <span className='total-price-tag'>₹{(grandTotal + shipping).toFixed(2)}</span>
                            </div>
                            <button className='checkout-btn' onClick={() => navigate('/checkout')}>
                                Checkout Now
                            </button>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}

export default Carts;