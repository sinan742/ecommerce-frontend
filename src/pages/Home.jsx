import React, { useState, useEffect } from 'react';
import './Home.css';
import Navbar from '../Navbar Page/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = "https://ecommerce-project-backend-wm1z.onrender.com";

  useEffect(() => {

    axios.get(`${BASE_URL}/api/products/`)
      .then((res) => {
        setProducts(res.data.slice(0, 3));
      })
      .catch(err => {
        console.error("API Fetch Error:", err);
      });
  }, []);

  return (
    
    <div className='home-wrapper'>

      {/* Modern Hero Section */}
      <header className='hero-container'>
        <div className='hero-content'>
          <h1 className='hero-title'>SCORE YOUR <span className='highlight'>DREAMS</span></h1>
          <p className='hero-subtitle'>Experience the next level of precision with our premium football collection.</p>
          <button className='main-cta' onClick={() => navigate('/products')}>Explore Shop</button>
        </div>
      </header>

      {/* Product Showcase */}
      <section className='featured-section'>
        <h2 className='section-title'>Featured Gear</h2>
        <div className='card-grid'>
          {products.length > 0 ? (
            products.map((item) => (
              <div key={item.id} className='modern-card'>
                <div className='card-image-wrapper'>
                  {/* Image path handle*/}
                  <img 
  src={products.image ? product.image : 'https://via.placeholder.com/150'} 
  alt={products.name} 
  className='product-img' 
  onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} 
/>
                </div>
                <div className='card-details'>
                  <h3>{item.name}</h3>
                  <p className='price-tag'>₹{item.price}</p>
                  <button className='secondary-btn' onClick={() => navigate('/Products')}>
                    View Gear
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="loading-text">Loading footballs...</p>
          )}
        </div>
      </section>

      {/* Visual Gallery */}
      <section className='image-mosaic'>
        <div className='mosaic-item large'>
          <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000" alt="Stadium" />
          <div className="mosaic-overlay"><span>The Arena</span></div>
        </div>
        <div className='mosaic-item'>
          <img src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800" alt="Training" />
          <div className="mosaic-overlay"><span>Training</span></div>
        </div>
        <div className='mosaic-item'>
          <img src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800" alt="Match Ball" />
          <div className="mosaic-overlay"><span>Precision</span></div>
        </div>
        <div className='mosaic-item wide'>
          <img src="https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=1000" alt="Team" />
          <div className="mosaic-overlay"><span>The Goal</span></div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;