import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Products.css';
import { FaHeart, FaRegHeart, FaCartPlus } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

function Products() {
  const userlog = Cookies.get('userName');
  const [products, setproducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [wadd, setwadd] = useState([]); 
  const [brands, setBrands] = useState([]);

  const BASE_URL = "https://ecommerce-project-backend-wm1z.onrender.com";

  // 1. Fetch Products & Wishlist
  useEffect(() => {
    axios.get(`${BASE_URL}/api/products/`)
      .then((res) => {
        setproducts(res.data);
        const uniqueBrands = [...new Set(res.data.map(item => item.brand))];
        setBrands(uniqueBrands);
      })
      .catch(err => console.error("Error fetching products:", err));

    if (userlog) {
      fetchWishlist();
    }
  }, [userlog]);

  const fetchWishlist = () => {
    axios.get(`${BASE_URL}/api/wishlist/`, { withCredentials: true })
      .then(res => setwadd(res.data))
      .catch(err => console.log("Wishlist fetch error:", err));
  };

  // 2. Filter & Sort Logic
  useEffect(() => {
    let processedProducts = [...products];
    if (selectedBrand !== 'all') processedProducts = processedProducts.filter(p => p.brand === selectedBrand);
    if (searchTerm) processedProducts = processedProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (sortOption === 'price-asc') processedProducts.sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-desc') processedProducts.sort((a, b) => b.price - a.price);
    else if (sortOption === 'name-asc') processedProducts.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredProducts(processedProducts);
  }, [products, searchTerm, sortOption, selectedBrand]);

  // 3. Add to Cart with Navbar Update
  const addtoCart = (product) => {
    if (!userlog) return toast.warning('Please login to add items to cart');
    
    axios.post(`${BASE_URL}/api/cart/`, 
      { product_id: product.id }, 
      { withCredentials: true }
    )
    .then(() => {
      toast.success(`${product.name} added to cart`);
      // Navbar update item count
      window.dispatchEvent(new Event("cartUpdated"));
    })
    .catch(err => {
      toast.error("Failed to add to cart");
    });
  };

  // 4. Toggle Wishlist Logic
  const toggleWishlist = (product) => {
    if (!userlog) return toast.warning('Please login to use wishlist');
    
    // Check if already in wishlist
    const isInWishlist = wadd.some(item => item.product.id === product.id);

    axios.post(`${BASE_URL}/api/wishlist/`, 
      { product_id: product.id }, 
      { withCredentials: true }
    )
    .then(() => {
      if (isInWishlist) {
      } else {
        toast.success("Added to Wishlist");
      }
      fetchWishlist();
      // Navbar update item count
      window.dispatchEvent(new Event("wishlistUpdated"));
    })
    .catch(err => {
      toast.error("Wishlist update failed");
    });
  };

  return (
    <div className='products-page'>
      <div className='shop-header'>
        <h1 className='phead'>Beyond The <span className='highlight'>Pitch</span></h1>
        
        <div className='controls-bar'>
          <input 
            type="text" 
            placeholder="Search premium gear..." 
            className="search-bar" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <div className='filter-group'>
            <select className="modern-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="default">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
            </select>
            <select className="modern-select" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
              <option value="all">All Brands</option>
              {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className='product-grid'>
        {filteredProducts.map((product) => {
          const isFavourite = wadd.some(item => item.product.id === product.id);
          return (
            <div className='product-card' key={product.id}>
              <div className='card-top'>
                <img 
  src={product.image} 
  alt={product.name} 
  className='product-img' 
  onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} // ഇമേജ് ലോഡ് ആയില്ലെങ്കിൽ ഒരു പകരക്കാരൻ ചിത്രം കാണിക്കാൻ
/>
                <button 
                  className={`wish-btn ${isFavourite ? 'active' : ''}`} 
                  onClick={() => toggleWishlist(product)}
                >
                  {isFavourite ? <FaHeart color="#ff0000" /> : <FaRegHeart />}
                </button>
              </div>
              
              <div className='card-body'>
                <span className='brand-tag'>{product.brand}</span>
                <h3 className='pr-name'>{product.name}</h3>
                <p className='pr-price'>₹{product.price}</p>
                
                <div className='button-group'>
                  <button className='add-cart-btn' onClick={() => addtoCart(product)}>
                    <FaCartPlus /> Add to Cart
                  </button>
                  <Link to={`/product/${product.id}`} className='details-link'>Details</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;