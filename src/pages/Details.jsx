import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
import Navbar from '../Navbar Page/Navbar';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaShieldHalved, FaTruckFast } from "react-icons/fa6";
import Cookies from 'js-cookie';
import './Details.css';

function Details() {
    const [product, setProduct] = useState(null); 
    const { id } = useParams(); 
    const navigate = useNavigate();

    const API_BASE_URL = "https://ecommerce-project-backend-wm1z.onrender.com/api"; 
    
    const token = Cookies.get('accessToken'); 

    useEffect(() => {
        axios.get(`${API_BASE_URL}/products/${id}/`)
            .then(res => setProduct(res.data))
            .catch(err => {
                console.error("Fetch error:", err);
                toast.error("Product not found!");
            });
    }, [id]); 

    const handleAddToCart = async () => {
        if (!token) {
            toast.warning('Please login to continue.');
            navigate('/login');
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            },
            withCredentials: true 
        };

        const cartData = {
            product_id: product.id, 
            quantity: 1
        };

        try {
            await axios.post(`${API_BASE_URL}/cart/`, cartData, config);
            toast.success('Added to your Bag! ');

            window.dispatchEvent(new Event("cartUpdated"));
            window.dispatchEvent(new Event("storage_updated"));

        } catch (err) {
            console.error("Cart error:", err.response?.data);
            if (err.response && err.response.status === 401) {
                toast.error("Session expired. Please login again.");
                navigate('/login');
            } else {
                toast.error(err.response?.data?.error || "Failed to add to cart.");
            }
        }
    };

    if (!product) return <div className="loading-screen">Loading Excellence...</div>;

    return (
        <div className='details-wrapper'>
            <Navbar />
            <div className='details-container'>
                <button className='back-btn' onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back to Shop
                </button>

                <div className='details-grid'>
                    <div className='details-image-section'>
                        <div className='image-bg-glow'></div>
                        <img 
                            className='main-detail-img' 
                            src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`} 
                            alt={product.name} 
                        />
                    </div>

                    <div className='details-info-section'>
                        <span className='brand-badge'>{product.brand_name || product.brand || 'Original'}</span>
                        <h1 className='detail-title'>{product.name}</h1>
                        <div className='price-tag'>₹{product.price}</div>
                        <p className='detail-desc'>{product.description}</p>

                        <div className='trust-badges'>
                            <div className='t-item'><FaTruckFast /> Fast Shipping</div>
                            <div className='t-item'><FaShieldHalved /> 100% Original</div>
                        </div>

                        <button onClick={handleAddToCart} className='cart-main-btn'>
                            Add To Bag
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Details;