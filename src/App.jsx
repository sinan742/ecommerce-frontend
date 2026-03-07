import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import Carts from './pages/Carts.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Profile from './pages/Profile.jsx'
import About from './pages/About.jsx'
import Details from './pages/Details.jsx'
import Checkout from './pages/Checkout.jsx'
import Success from './pages/Success.jsx'
import Myorder from './pages/Myorder.jsx'
import Dashbord from './Admin/AdmnDashboard/Dashbord.jsx'
import Userse from './Admin/AdmnUserse/Userse.jsx'
import AdminProducts from './Admin/AdmnProducts/AdminProducts.jsx'
import Adminorders from './Admin/AdmnOrders/Adminorders.jsx'
import AdNavbar from './adminNavbar/AdNavbar.jsx'
import Navbar from './Navbar Page/Navbar.jsx'
import VerifyOTP from './pages/VerifyOTP';
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css" 
import ForgotPassword from './pages/ForgotPassword.jsx'
import axios from 'axios'
import Cookies from 'js-cookie'
import ProfileUpdate from './pages/ProfileUpdate.jsx'

// --- 401 Unauthorized avoid Interceptor ---
axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function App() {
  axios.defaults.withCredentials = true;

  const LocationNavbar=()=>{
    const location=useLocation()

    if(
      location.pathname==='/login' ||
      location.pathname ==='/register' ||
      location.pathname ==='/dashboard' ||
      location.pathname ==='/users' ||
      location.pathname === '/adproducts' ||
      location.pathname === '/adorders' ||
      location.pathname ==='/checkout'||
      location.pathname ==='/verify-otp'||
      location.pathname ==='/success' ||
      location.pathname === '/forgot-password'
    ){
      return null
    }
    else{
      return <Navbar/>;
    }
  }

  return (
    <>
      <ToastContainer position='top-right' autoClose={2000}/>
      <LocationNavbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/carts' element={<Carts/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/wlist' element={<Wishlist/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/profile-update' element={<ProfileUpdate/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/success' element={<Success/>}/>
        <Route path='/orders' element={<Myorder/>}/>
        <Route path='/Products' element={<Products/>}/>
        <Route path="/product/:id" element={<Details/>}/>
        <Route path='/dashboard' element={<Dashbord/>}/>
        <Route path='/users' element={<Userse/>}/>
        <Route path='/adproducts' element={<AdminProducts/>}/>
        <Route path='/adorders' element={<Adminorders/>}/>
        <Route path='admnav' element={<AdNavbar/>}/>

        
      </Routes>
      
    </>
  )
}

export default App