import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Navbar = () => {
  return (
    <nav className="bg-black text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-yellow-500">DoDeck</Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-yellow-500 transition-colors">Home</Link>
            <Link to="/dashboard" className="hover:text-yellow-500 transition-colors">Dashboard</Link>
            <Link to="/features" className="hover:text-yellow-500 transition-colors">Features</Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline-dark">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="accent">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
