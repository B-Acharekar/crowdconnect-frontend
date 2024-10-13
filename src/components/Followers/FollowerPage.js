import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FollowerPage.css'

const FollowerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center">
      <div className="animate-slide-in">
        <h1 className="text-5xl text-white font-bold mb-8 animate-pulse">Followers Feature Coming Soon!</h1>
        <p className="text-white text-lg mb-4">
          Track your followers and see who’s supporting your journey. Stay tuned for social features that make collaboration easier.
        </p>
      </div>
        <button
          onClick={() => navigate('/home')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-300 animate-fade-in"
        >
          Back to Home
        </button>
    </div>
  );
};

export default FollowerPage;
