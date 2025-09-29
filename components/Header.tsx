import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-6 bg-white/30 backdrop-blur-sm rounded-xl shadow-lg">
      <h1 className="text-5xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
        hugime
      </h1>
      <p className="text-gray-600 mt-2 text-lg">
        Create a timeless memory. Upload a kid and an adult photo to see the magic.
      </p>
    </header>
  );
};

export default Header;
