// Home.jsx
import React from 'react';
import cgLogo from '/src/assets/cg.png'; // Replace with your CG logo path
import supermindLogo from '/src/assets/level.jpg'; // Replace with your Supermind logo path
import logoPlaceholder from '/src/assets/findcoder.png'; // Replace with placeholder logo path
import '../App.css'; // Ensure this CSS file is imported
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">  {/* Wrap content in a div with class home-container */}
            <div className="cosmic-bg flex flex-col items-center text-white p-6">
                {/* Marketing Logos */}
                <div className="flex justify-center items-center mb-8 space-x-4 bg-white bg-opacity-10 p-6 rounded-lg">
                    <img src={cgLogo} alt="CG Logo" className="w-48 h-auto" />
                    <img src={supermindLogo} alt="Supermind Logo" className="w-48 h-auto" />
                </div>


                {/* Options Section */}
                <div className="flex flex-col space-y-6 w-full max-w-md">
                    <Link to="/option1">
                        <div className="bg-gray-800 bg-opacity-80 shadow-lg rounded-lg p-6 text-center transform transition-transform duration-300 hover:scale-105">
                            <h2 className="text-lg font-semibold">Option 1</h2>
                            <p className="text-gray-300">Description for Option 1.</p>
                        </div>
                    </Link>
                    <Link to="/translation">
                        <div className="bg-gray-800 bg-opacity-80 shadow-lg rounded-lg p-6 text-center transform transition-transform duration-300 hover:scale-105">
                            <h2 className="text-lg font-semibold">Option 2</h2>
                            <p className="text-gray-300">Description for Option 2.</p>
                        </div>
                    </Link>
                    <Link to="/soulbudy/input">
                        <div className="bg-gray-800 bg-opacity-80 shadow-lg rounded-lg p-6 text-center transform transition-transform duration-300 hover:scale-105">
                            <h2 className="text-lg font-semibold">Option 3</h2>
                            <p className="text-gray-300">Description for Option 3.</p>
                        </div>
                    </Link>
                </div>
                {/* Special Thanks Section */}
                <div className="mt-12 w-full max-w-3xl">
                    <h2 className="text-center text-xl font-semibold mb-6">Special Thanks</h2>
                    <div className="flex justify-center space-x-6">
                        <img src={logoPlaceholder} alt="Logo 1" className="w-24 h-24 object-contain" />
                        <img src={logoPlaceholder} alt="Logo 2" className="w-24 h-24 object-contain" />
                        <img src={logoPlaceholder} alt="Logo 3" className="w-24 h-24 object-contain" />
                        <img src={logoPlaceholder} alt="Logo 4" className="w-24 h-24 object-contain" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
