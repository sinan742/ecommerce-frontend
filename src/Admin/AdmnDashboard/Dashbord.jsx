import React, { useState, useEffect } from 'react';
import { FaUsers, FaShoppingCart, FaDollarSign, FaBoxOpen } from "react-icons/fa";
import AdNavbar from '../../adminNavbar/AdNavbar';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StatCard({ title, value, icon, color }) {
    return (
        <div className="stat-card" style={{
            background: "rgba(255, 255, 255, 0.95)",
            padding: "25px",
            borderRadius: "15px",
            minWidth: "240px",
            flex: "1",
            margin: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            borderLeft: `8px solid ${color}`,
            transition: "transform 0.3s ease",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h3 style={{ color: "#7f8c8d", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px" }}>{title}</h3>
                    <p style={{ fontSize: "28px", fontWeight: "800", margin: 0, color: "#2c3e50" }}>{value}</p>
                </div>
                <div style={{
                    backgroundColor: `${color}15`,
                    padding: "12px",
                    borderRadius: "50%",
                    color: color
                }}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState({
        total_users: 0,
        total_products: 0,
        total_orders: 0,
        total_revenue: 0,
        graph_data: [] // 🛑 2. Graph data save 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = "https://ecommerce-project-backend-wm1z.onrender.com";

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/admin-dashboard/`);
                setStats(response.data);
            } catch (err) {
                console.error("Dashboard fetching error:", err);
                setError("Failed to fetch data from server.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#1a1a2e', color: 'white' }}>
            <h2>Loading Analytics...</h2>
        </div>
    );

    if (error) return <div style={{ color: '#ff4b2b', padding: '20px', textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#1a1a2e', paddingBottom: '40px' }}>
            <AdNavbar />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px', marginTop: '55px' }}>
                <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ color: 'white', fontSize: '2rem', margin: 0 }}>Beyond The Pitch <span style={{ color: '#2ecc71' }}>Analytics</span></h1>
                        <p style={{ color: '#aaa', marginTop: '5px' }}>Performance overview of your football store.</p>
                    </div>
                </div>

                {/* --- STAT CARDS SECTION --- */}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginBottom: '30px' }}>
                    <StatCard title="Players" value={stats.total_users} icon={<FaUsers size={24} />} color="#3498db" />
                    <StatCard title="Products" value={stats.total_products} icon={<FaBoxOpen size={24} />} color="#e67e22" />
                    <StatCard title="Orders" value={stats.total_orders} icon={<FaShoppingCart size={24} />} color="#2ecc71" />
                    <StatCard title="Revenue" value={`₹${Number(stats.total_revenue).toLocaleString('en-IN')}`} icon={<FaDollarSign size={24} />} color="#f1c40f" />
                </div>

                {/* --- 🛑 3. GRAPH SECTION (Sales Trend) --- */}
                <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    padding: '25px', 
                    borderRadius: '20px', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}>
                    <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.2rem' }}>Sales Growth (Last 7 Days)</h3>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <AreaChart data={stats.graph_data}>
                                <defs>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2c3e50" vertical={false} />
                                <XAxis dataKey="date" stroke="#7f8c8d" tick={{fontSize: 12}} />
                                <YAxis stroke="#7f8c8d" tick={{fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2ecc71', borderRadius: '10px' }}
                                    itemStyle={{ color: '#2ecc71' }}
                                    labelStyle={{color:'white'}}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="orders" 
                                    stroke="#2ecc71" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorOrders)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}