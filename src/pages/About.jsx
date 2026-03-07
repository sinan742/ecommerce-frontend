import React from 'react';
import Navbar from '../Navbar Page/Navbar';
import Footer from './Footer';
import './About.css';
import { FaFutbol, FaTrophy, FaHandshake } from "react-icons/fa6";

export default function About() {
  return (
    <div className='about-wrapper'>
      
      <section className='about-hero'>
        <div className='hero-overlay'>
          <h1 className='about-title'>BEYOND <span className='highlight'>THE PITCH</span></h1>
          <p className='tagline'>Driven by passion. Defined by performance.</p>
        </div>
      </section>

      <div className='about-content'>
        <section className='mission-section'>
          <div className='mission-text'>
            <h2>Our Mission</h2>
            <p>
              Welcome to <strong>Beyond The Pitch</strong>, the ultimate hub for football fanatics! 
              We live and breathe the beautiful game, and we believe that the perfect match starts 
              with the perfect ball. We’ve dedicated our store to one thing and one thing only: 
              providing the best footballs on the market.
            </p>
          </div>
          <div className='mission-image'>
            <img 
    src="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=800" 
    alt="Football on pitch" 
  />
          </div>
        </section>

        <section className='values-grid'>
          <div className='value-card'>
            <FaFutbol className='value-icon' />
            <h3>Quality Gear</h3>
            <p>We handpick premier selections from legends like Nike and Adidas.</p>
          </div>
          <div className='value-card'>
            <FaTrophy className='value-icon' />
            <h3>Performance</h3>
            <p>Gear designed to elevate your game from the street to the stadium.</p>
          </div>
          <div className='value-card'>
            <FaHandshake className='value-icon' />
            <h3>Trusted Brands</h3>
            <p>Authentic products from Nivia, Cosco, and world-class manufacturers.</p>
          </div>
        </section>

        <section className='brand-philosophy'>
          <h2>The Brands We Carry</h2>
          <div className='brand-logo-strip'>
             <span>NIVIA</span>
             <span>COSCO</span>
             <span>ADIDAS</span>
             <span>NIKE</span>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}