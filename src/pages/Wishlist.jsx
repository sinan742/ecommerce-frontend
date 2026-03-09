import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'; 
import './Wishlist.css';

function Wishlist() {
    const userlog = Cookies.get('userName');
    const [wlist, setwlist] = useState([]);
    
    const BASE_URL = "https://ecommerce-project-backend-wm1z.onrender.com";

    useEffect(() => {
        if (userlog) {
            fetchWishlist();
        }
    }, [userlog]);

    // 1. Fetch Wishlist
    const fetchWishlist = () => {
        axios.get(`${BASE_URL}/api/wishlist/`, { withCredentials: true })
            .then((res) => setwlist(res.data))
            .catch(err => console.error("Wishlist Fetch Error:", err));
    };

    // 2. Add to Cart from Wishlist (Updates both counts)
    const addtoCart = (productData) => {
        const productId = productData.product.id;
        
        axios.post(`${BASE_URL}/api/cart/`, 
            { product_id: productId }, 
            { withCredentials: true }
        )
        .then(() => {
            toast.success(`${productData.product.name} moved to cart`);
            
            window.dispatchEvent(new Event("cartUpdated"));
        })
        .catch(err => {
            toast.error("Error moving item to cart");
            console.error(err);
        });
    };

    // 3. Remove from Wishlist (Updates wishlist count)
    const removeWish = (item) => {
        axios.delete(`${BASE_URL}/api/wishlist/${item.id}/`, { withCredentials: true })
            .then(() => {
                setwlist(prev => prev.filter(p => item.id !== p.id));
                toast.error("Removed from favorites");

                // Navbar wishlist update
                window.dispatchEvent(new Event("wishlistUpdated"));
            })
            .catch(err => console.error("Delete error:", err));
    };

    return (
        <div className='wishlist-page'>
            <div className='wishlist-container'>
                <header className='wishlist-header'>
                    <h1>YOUR <span className='highlight'>WISHLIST</span></h1>
                    <p>Keep track of the gear you want to dominate the field.</p>
                </header>

                {!userlog ? (
                    <div className='login-msg'>
                        <h2>Access Denied</h2>
                        <p>Please login to view your saved items.</p>
                    </div>
                ) : wlist.length > 0 ? (
                    <div className='wishlist-grid'>
                        {wlist.map((item) => (
                            <div className='wish-card' key={item.id}>
                                <div className='wish-img-container'>
                                    <img 
  src={
    item.product?.image 
      ? (item.product.image.startsWith('http') 
          ? item.product.image 
          : `${BASE_URL}${item.product.image}`)
      : 'https://via.placeholder.com/150' 
  } 
  alt={item.product?.name || 'Product Image'} 
  onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
/>
                                    <button className='remove-icon' onClick={() => removeWish(item)}>×</button>
                                </div>
                                <div className='wish-details'>
                                    <span className='wish-brand'>{item.product.brand}</span>
                                    <h3>{item.product.name}</h3>
                                    <p className='wish-price'>₹{item.product.price}</p>
                                    <button className='move-to-cart' onClick={() => addtoCart(item)}>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='empty-wishlist'>
                        <h3>Your wishlist is empty</h3>
                        <p>Browse our products and save your favorites!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Wishlist;