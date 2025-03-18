"use client";
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu as MenuIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserProfile from './UserProfile';
import LoginDialog from './auth/LoginDialog';
import SignupDialog from './auth/SignupDialog';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Prediction', path: '/prediction' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLoginClick = () => {
    setShowLoginDialog(true);
    setIsOpen(false);
  };

  const handleSignupClick = () => {
    setShowSignupDialog(true);
    setIsOpen(false);
  };

  const switchToSignup = () => {
    setShowLoginDialog(false);
    setShowSignupDialog(true);
  };

  const switchToLogin = () => {
    setShowSignupDialog(false);
    setShowLoginDialog(true);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
          <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
    >
      <img
        src="https://static.vecteezy.com/system/resources/previews/012/895/926/original/detailed-and-colored-illustrations-of-the-human-heart-for-medicine-and-biology-learning-png.png"
        alt="Heart Illustration"
        className="h-12 w-12" // Adjusted size here
      />
    </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
              HeartGuard
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative group"
              >
                <span
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400'
                  }`}
                >
                  {link.name}
                </span>
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <UserProfile />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLoginClick}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleSignupClick}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-base font-medium px-4 py-2 rounded-md transition-colors ${
                    location.pathname === link.path
                      ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                {isAuthenticated ? (
                  <div className="px-3 py-2">
                    <UserProfile />
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleLoginClick}
                      className="text-base font-medium px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={handleSignupClick}
                      className="text-base font-medium px-4 py-2 rounded-md text-white bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 hover:shadow-lg transition-all duration-300"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Dialogs */}
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onSwitchToSignup={switchToSignup}
      />
      <SignupDialog
        isOpen={showSignupDialog}
        onClose={() => setShowSignupDialog(false)}
        onSwitchToLogin={switchToLogin}
      />
    </nav>
  );
};

export default Navbar;