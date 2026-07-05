import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center px-4">
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold text-blue-600">404</h1>
        <h2 className="text-xl font-bold text-gray-900">Page not found</h2>
        <p className="text-gray-500 max-w-sm">The page you are looking for might have been removed or changed.</p>
        <Link to="/" className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700">Back to dashboard</Link>
      </div>
    </div>
  );
}
