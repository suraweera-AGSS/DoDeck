import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import logo from '../assets/Pic6.png';

const socialLinks = [
  { url: 'https://github.com/suraweera-AGSS', icon: <FaGithub size={20} /> },
  { url: 'https://twitter.com', icon: <FaTwitter size={20} /> },
  { url: 'https://linkedin.com', icon: <FaLinkedin size={20} /> },
  { url: 'https://instagram.com', icon: <FaInstagram size={20} /> },
];

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12">
        {/* Logo and Description */}
        <div className="space-y-4 md:pr-10">
          <div className="mb-4">
            <img
              src={logo}
              alt="DoDeck Logo"
              className="h-24 w-auto object-contain"
            />
          </div>
          <p className="text-gray-400">Stay focused, manage your tasks with ease, and enjoy a seamless, stress-free workflow built for your everyday success.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-yellow-500">Quick Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <ul className="space-y-3">
              <li><Link to="/register" className="text-gray-400 hover:text-yellow-500 transition-colors">Register</Link></li>
              <li><Link to="#features" className="text-gray-400 hover:text-yellow-500 transition-colors">Features</Link></li>
              <li><Link to="#about" className="text-gray-400 hover:text-yellow-500 transition-colors">About</Link></li>
              <li><Link to="#contact" className="text-gray-400 hover:text-yellow-500 transition-colors">Contact</Link></li>
            </ul>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-gray-400 hover:text-yellow-500 transition-colors">Support</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-yellow-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-yellow-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-yellow-500">Connect With Us</h3>
          <p className="text-gray-400 mb-4">Follow us on social media for updates and tips.</p>
          <div className="flex space-x-4 pt-2">
            {socialLinks.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-500 transition-colors"
                aria-label={item.url.split('//')[1]?.split('/')[0] || 'Social link'}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-yellow-500">Newsletter</h3>
          <p className="text-gray-400">Subscribe to get updates on new features and releases.</p>
          <form className="mt-4 space-y-3" action="https://formspree.io/f/xanbdwkj" method="POST">
            <div>
              <input type="hidden" name="_subject" value="New Newsletter Subscription" />
              <input type="hidden" name="form_type" value="Newsletter Subscription" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black font-medium py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">We care about your data. Read our <Link to="/privacy" className="text-yellow-500 hover:underline">Privacy Policy</Link>.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-700 text-gray-400 text-sm flex justify-between items-center">
        <p>© {new Date().getFullYear()} DoDeck. All Rights Reserved.</p>
        <p>Developed By Sithum Suraweera</p>
      </div>
    </footer>
  );
};

export default Footer;
