import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-yellow-500">DoDeck</h3>
          <p className="text-gray-400">Your productivity companion for organized task management.</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/features" className="hover:text-yellow-500 transition-colors">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-yellow-500 transition-colors">Pricing</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/about" className="hover:text-yellow-500 transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-500 transition-colors">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/privacy" className="hover:text-yellow-500 transition-colors">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-yellow-500 transition-colors">Terms</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-700 text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} DoDeck. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
