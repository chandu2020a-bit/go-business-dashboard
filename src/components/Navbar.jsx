import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600" aria-label="Go to dashboard home">Go Business</Link>
        <nav className="flex items-center space-x-6" aria-label="Primary">
          <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">Home</Link>
          <button onClick={() => { Cookies.remove('jwt_token'); navigate('/login'); }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">Log out</button>
        </nav>
      </div>
    </header>
  );
}