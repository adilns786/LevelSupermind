import React, { useState } from 'react';
import cgLogo from '../../assets/cg.png'; // Correct path to CG logo
import supermindLogo from '../../assets/level.jpg'; // Correct path to Supermind logo

const HomePage = () => {
  const [companyDescription, setCompanyDescription] = useState('');
  const [productDetails, setProductDetails] = useState('');
  const [competitors, setCompetitors] = useState('');

  const handleDescriptionChange = (e) => setCompanyDescription(e.target.value);
  const handleProductDetailsChange = (e) => setProductDetails(e.target.value);
  const handleCompetitorsChange = (e) => setCompetitors(e.target.value);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-indigo-900 min-h-screen flex flex-col text-white">
      <header className="bg-gradient-to-r from-indigo-800 to-indigo-600 py-12 text-center shadow-lg relative flex justify-between items-center px-6">
        {/* Whitish Overlay */}
        <div className="absolute inset-0 bg-white opacity-10 z-0"></div>

        {/* CG Logo on Left */}
        <img
          src={cgLogo}
          alt="CG Logo"
          className="h-24 w-auto transform transition-all duration-300 hover:scale-110 z-10"
        />

        {/* Title Container */}
        <div className="flex flex-col items-center space-y-4 z-10">
          <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            Welcome to ARTFinder
          </h1>
          <p className="text-xl font-semibold text-gray-300 text-black">
            A world of art and creativity at your fingertips
          </p>
        </div>

        {/* Level Logo on Right */}
        <img
          src={supermindLogo}
          alt="Level Logo"
          className="h-16 w-auto transform transition-all duration-300 hover:scale-110 z-10"
        />
      </header>

      <main className="flex-grow container mx-auto px-6 py-12">

        {/* Input Form for Description, Product, Competitors */}
        <div className="bg-gray-800 p-8 rounded-lg mt-4 mx-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
            Tell Us About Your Business
          </h2>
          <form className="space-y-6 mt-6">
            {/* Company Description */}
            <div>
              <label htmlFor="companyDescription" className="block text-xl font-semibold text-gray-300">
                Company Description
              </label>
              <textarea
                id="companyDescription"
                value={companyDescription}
                onChange={handleDescriptionChange}
                placeholder="Describe your company..."
                rows="4"
                className="w-full p-4 mt-2 text-gray-800 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              ></textarea>
            </div>

            {/* Product Details */}
            <div>
              <label htmlFor="productDetails" className="block text-xl font-semibold text-gray-300">
                Product Details
              </label>
              <textarea
                id="productDetails"
                value={productDetails}
                onChange={handleProductDetailsChange}
                placeholder="Describe your product..."
                rows="4"
                className="w-full p-4 mt-2 text-gray-800 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              ></textarea>
            </div>

            {/* Competitors Names */}
            <div>
              <label htmlFor="competitors" className="block text-xl font-semibold text-gray-300">
                Competitors Names
              </label>
              <input
                id="competitors"
                type="text"
                value={competitors}
                onChange={handleCompetitorsChange}
                placeholder="Enter competitors' names (comma separated)"
                className="w-full p-4 mt-2 text-gray-800 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold rounded-lg hover:opacity-80 transition-all"
            >
              Submit
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-gray-800 py-6 text-center shadow-lg">
        <p className="text-gray-500 text-lg">
          © 2025 ARTFinder. All rights reserved. Designed with creativity.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
