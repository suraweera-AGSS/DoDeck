import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import logo from '../assets/Pic5.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId, e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // If we're on the home page, scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on a different page, navigate to home first, then scroll
      navigate('/');
      // Small delay to ensure the home page has loaded
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };
  return (
    <nav className="bg-black text-white px-6 py-3 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <a 
            href="#" 
            className="flex items-center"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }}
          >
            <img 
              src={logo} 
              alt="DoDeck Logo" 
              className="h-5 w-auto object-contain"
            />
          </a>
          <div className="hidden md:flex space-x-6">
            {/* <Link to="/" className="hover:text-yellow-500 transition-colors">Home</Link> */}
            <a 
              href="#features" 
              className="hover:text-yellow-500 transition-colors cursor-pointer"
              onClick={(e) => scrollToSection('features', e)}
            >
              Features
            </a>
            <a 
              href="#about" 
              className="hover:text-yellow-500 transition-colors cursor-pointer"
              onClick={(e) => scrollToSection('about', e)}
            >
              About
            </a>
            <a 
              href="#contact" 
              className="hover:text-yellow-500 transition-colors cursor-pointer"
              onClick={(e) => scrollToSection('contact', e)}
            >
              Contact
            </a>
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
