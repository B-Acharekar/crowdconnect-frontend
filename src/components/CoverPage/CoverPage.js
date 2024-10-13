import React from 'react';
import { Link } from 'react-router-dom';
import CC_logo from '../../assets/img/CrowdConnect1.png';
import vote_logo from '../../assets/img/vote.png';
import group_logo from '../../assets/img/group.png';
import collab_logo from '../../assets/img/group-idea.png';
import group_discc from '../../assets/img/67Z_2112.w009.n001.86Z.p3.86.jpg';
import userFriendly_logo from '../../assets/img/UserFriendly.png';
import './CoverPage.css';

const CoverPage = () => {
  return (
    <div className="relative bg-gray-100 min-h-screen scroll-smooth">
      {/* Sticky Header Section */}
      <header className="navbar fixed top-0 left-0 right-0 flex justify-between items-center w-full px-5 py-2 bg-white shadow-md z-50">
        {/* Logo */}
        <img src={CC_logo} alt="CrowdConnect Logo" className="logo w-32" loading="lazy" />
        
        {/* Navigation */}
        <nav className="flex space-x-4">
          {/* Login Link */}
          <Link to="/login" className="button bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-all duration-200">
            Login
          </Link>
        </nav>
      </header>

      {/* Main Content Section */}
      <main className="flex flex-col items-center justify-center pt-16 pb-16">
        
        {/* Hero Section */}
        <section className='w-full h-screen bg-green-50 py-20 flex flex-col md:flex-row items-center justify-between'>
          <div className="flex-shrink-0 p-8 md:p-16">
            {/* Image with resized width */}
            <img 
              src={group_discc} 
              alt="Dream website builder"
              className="w-72 md:w-96" 
            />
          </div>
          <div className="w-full md:w-8/12 px-6 lg:px-20 text-center md:text-left mt-8 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-bold text-green-500">Join the Problem-Solving Community</h1>
            <h4 className="mt-4 text-lg text-green-500">Collaborate, Create, and Innovate Together</h4>
            <div className="mt-6">
              {/* Primary Call-to-Action */}
              <Link to="/login" className="button btn-lg bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 duration-300">
                Start Solving
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features py-3 w-full h-full ">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-green-600">Our Features</h2>

            {/* Feature Cards */}
            <div className="flex flex-wrap justify-center gap-8 mt-16">
              
              {/* Feature 1: Real-Time Collaboration */}
              <div className="w-full md:w-1/3 p-4">
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                  {/* Feature Icon */}
                  <img src={collab_logo} alt="Real-Time Collaboration" className="w-16 mx-auto"/>
                  <h3 className="text-xl font-semibold mt-4">Real-Time Collaboration</h3>
                  <p className="mt-2 text-gray-600">Work with the community in real-time to solve pressing challenges together.</p>
                </div>
              </div>

              {/* Feature 2: Crowdsourced Solutions */}
              <div className="w-full md:w-1/3 p-4">
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                  <img src={group_logo} alt="Crowdsourced Solutions" className="w-16 mx-auto"/>
                  <h3 className="text-xl font-semibold mt-4">Crowdsourced Solutions</h3>
                  <p className="mt-2 text-gray-600">Get multiple perspectives and solutions from experts worldwide.</p>
                </div>
              </div>

              {/* Feature 3: Vote for the Best Ideas */}
              <div className="w-full md:w-1/3 p-4">
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                  <img src={vote_logo} alt="Vote for the Best Ideas" className="w-16 mx-auto"/>
                  <h3 className="text-xl font-semibold mt-4">Vote for the Best Ideas</h3>
                  <p className="mt-2 text-gray-600">Upvote solutions that work best, ensuring the best ideas rise to the top.</p>
                </div>
              </div>

              {/* Feature 4: User-Friendly Interface */}
              <div className="w-full md:w-1/3 p-4">
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                  <img src={userFriendly_logo} alt="Vote for the Best Ideas" className="w-16 mx-auto"/>
                  <h3 className="text-xl font-semibold mt-4">User-Friendly Interface</h3>
                  <p className="mt-2 text-gray-600">Navigate easily through the platform, making problem posting and solution submission intuitive for everyone.</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-50	 w-full py-6 border-t mt-12 shadow-md z-50">
    <div className="container mx-auto flex flex-wrap justify-between items-center">
    {/* Company Information */}
    <div className="flex items-center space-x-4 px-3">
      <span className="text-gray-600 text-sm">&copy; 2024 CrowdConnect, Inc</span>
      </div>

    <div className="flex items-center space-x-4 px-5">
    <a href="/privacy" className="text-gray-500 hover:text-green-600 text-sm transition-colors duration-200">Privacy Policy</a>
      <span className="text-gray-500">|</span>
      <a href="/terms" className="text-gray-500 hover:text-green-600 text-sm transition-colors duration-200">Terms of Service</a>
    
          {/* Social Media Links */}
    </div>
  </div>
</footer>


    </div>
  );
};

export default CoverPage;
