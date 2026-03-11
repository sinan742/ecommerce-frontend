import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import AdNavbar from '../../adminNavbar/AdNavbar';
import './AdminProducts.css';
import { toast } from 'react-toastify';

const ProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState(
        product || { name: '', brand: '', price: '', stock: '', description: '', image: null }
    );

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.brand || !formData.price || !formData.stock) {
            toast.warning("Fill all required fields.");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="ap-modal-overlay">
            <div className="ap-modal-content">
                <div className="ap-modal-header">
                    <h2 className="ap-modal-title">{product ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
                    <button className="ap-close-x" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="ap-modal-form">
                    <div className="ap-form-group">
                        <label className="ap-label">Product Name</label>
                        <input className="ap-input" type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="ap-form-group">
                        <label className="ap-label">Brand</label>
                        <input className="ap-input" type="text" name="brand" value={formData.brand} onChange={handleChange} required />
                    </div>
                    <div className="ap-form-row">
                        <div className="ap-form-group">
                            <label className="ap-label">Price (₹)</label>
                            <input className="ap-input" type="number" name="price" value={formData.price} onChange={handleChange} required />
                        </div>
                        <div className="ap-form-group">
                            <label className="ap-label">Stock</label>
                            <input className="ap-input" type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="ap-form-group">
                        <label className="ap-label">Description</label>
                        <textarea className="ap-textarea" name="description" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    <div className="ap-form-group">
                        <label className="ap-label">Upload Image</label>
                        <input className="ap-file-input" type="file" name="image" onChange={handleChange} accept="image/*" />
                    </div>
                    <div className="ap-modal-actions">
                        <button type="button" onClick={onClose} className="ap-btn-cancel">Cancel</button>
                        <button type="submit" className="ap-btn-save">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const API_URL = 'https://ecommerce-project-backend-wm1z.onrender.com/api/admin-products/';

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}?search=${searchTerm}`);
            setProducts(response.data);
        } catch (err) { toast.error("Fetch failed."); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleSaveProduct = async (productData) => {
        const data = new FormData();
        data.append('name', productData.name);
        data.append('brand', productData.brand);
        data.append('price', productData.price);
        data.append('stock', productData.stock);
        data.append('description', productData.description || "");

        if (productData.image instanceof File) {
            data.append('image', productData.image);
        }

        try {
            if (productData.id) {
                await axios.put(`${API_URL}${productData.id}/`, data);
                toast.success("Updated!");
            } else {
                await axios.post(API_URL, data);
                toast.success("Added!");
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (err) { toast.error("Error saving data."); }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Delete?')) {
            try {
                await axios.delete(`${API_URL}${id}/`);
                fetchProducts();
                toast.success("Deleted!");
            } catch (err) { toast.error("Delete failed."); }
        }
    };

    const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="ap-loading-wrapper"><h2>Loading Inventory...</h2></div>;

    return (
        <div className="ap-page-container">
            <AdNavbar />
            {isModalOpen && <ProductModal product={editingProduct} onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} />}
            
            <div className="ap-main-content">
                <header className="ap-header">
                    <h1 className="ap-title">Inventory Management</h1>
                    <div className="ap-controls">
                        <div className="ap-search-box">
                            <Search size={18} className="ap-search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                className="ap-search-input" 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>
                        <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="ap-btn-add">
                            <Plus size={18} /> Add Product
                        </button>
                    </div>
                </header>

                <div className="ap-table-wrapper">
                    <table className="ap-table">
                        <thead>
                            <tr>
                                <th>Product Details</th>
                                <th>Brand</th>
                                <th>Price</th>
                                <th>Stock Status</th>
                                <th className="ap-text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <div className="ap-product-cell">
                                            <img src={p.image || 'https://placehold.co/50'} className="ap-product-img" alt="" />
                                            <span className="ap-product-name">{p.name}</span>
                                        </div>
                                    </td>
                                    <td><span className="ap-brand-tag">{p.brand}</span></td>
                                    <td className="ap-price-text">₹{p.price}</td>
                                    <td>
                                        <span className={`ap-stock-badge ${p.stock < 10 ? 'ap-low' : 'ap-ok'}`}>
                                            {p.stock} in stock
                                        </span>
                                    </td>
                                    <td>
                                        <div className="ap-action-btns">
                                            <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="ap-edit-icon" title="Edit"><Edit size={18} /></button>
                                            <button onClick={() => handleDeleteProduct(p.id)} className="ap-delete-icon" title="Delete"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}