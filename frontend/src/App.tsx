import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import About from './pages/About';
import Contact from './pages/Contact';
import UserProfilePage from './pages/UserProfilePage';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/prediction" element={<Prediction />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;