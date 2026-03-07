import React from 'react';
import { GoVerified } from "react-icons/go";
import { useNavigate } from 'react-router-dom';

function Success() {
  const navigate = useNavigate();

  return (
    <div className="success-wrapper">
      {/* Embedded CSS for the modern look */}
      <style>{`
        .success-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #0a0a0a;
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .success-card {
          color: white;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          max-width: 800px;
          padding: 60px 40px;
          border-radius: 30px;
          text-align: center;
          animation: slideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .icon-container {
          margin-bottom: 30px;
          animation: pop 0.5s 0.4s both;
        }

        @keyframes pop {
          0% { transform: scale(0); }
          80% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .success-title {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 900;
          margin-bottom: 10px;
          letter-spacing: -1px;
        }

        .success-subtitle {
          color: #888;
          font-size: 1.1rem;
          margin-bottom: 40px;
        }

        .highlight-green {
          color: #39FF14;
          text-shadow: 0 0 20px rgba(57, 255, 20, 0.4);
        }

        .home-btn {
          background: #39FF14;
          color: #000;
          border: none;
          padding: 15px 40px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1rem;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .home-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(57, 255, 20, 0.4);
          background: #32e612;
        }

        @media (max-width: 600px) {
          .success-card { padding: 40px 20px; }
        }
      `}</style>

      <div className="success-card">
        <div className="icon-container">
          <GoVerified style={{ fontSize: '100px', color: '#39FF14' }} />
        </div>
        
        <h1 className="success-title">
          ORDER <span className="highlight-green">SUCCESSFUL</span>
        </h1>
        
        <p className="success-subtitle">
          Your gear is being prepared for the pitch. Check your email for tracking details.
        </p>

        <div className="btn-container">
          <button className="home-btn" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Success;