import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Calendar, Settings, LogOut, Heart, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Prediction {
  id: string;
  input_data: {
    age: number;
    gender: string;
    chestPain: string;
    restingBP: number;
    cholesterol: number;
    fastingBS: string;
    restingECG: string;
    maxHR: number;
    smoking: string;
    obesity: string;
  };
  prediction: number;
  probability: number;
  risk_level: string;
  user_name: string;
  user_email: string;
  timestamp: string;
}

const UserProfilePage = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchPredictions = async () => {
      try {
        console.log('Fetching predictions after refresh/mount');
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:5000/user/predictions', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching predictions:', errorData);
          throw new Error(errorData.error || 'Failed to fetch predictions');
        }

        const data = await response.json();
        console.log('Received predictions after refresh:', data);
        
        if (data.success) {
          // Clear existing predictions before setting new ones
          setPredictions([]);
          setPredictions(data.predictions || []);
          console.log('Updated predictions state:', data.predictions?.length || 0, 'predictions');
        } else {
          throw new Error(data.error || 'Failed to fetch predictions');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setPredictions([]); // Clear predictions on error
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [user, token, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Add a useEffect to handle empty predictions state
  useEffect(() => {
    if (predictions.length === 0 && !loading && !error) {
      console.log('No predictions available, showing Make Prediction button');
    }
  }, [predictions, loading, error]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-20 pb-10 px-4 bg-gradient-to-b from-zinc-900 to-black"
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-zinc-900/50 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile Picture Section */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 flex items-center justify-center mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{user.name}</h1>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* User Information Section */}
            <div className="w-full md:w-2/3 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Member Since</p>
                      <p className="text-white">January 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prediction History Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Prediction History
                </h2>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400">{error}</p>
                  </div>
                ) : predictions.length === 0 ? (
                  <div className="bg-white/5 rounded-lg p-6 text-center">
                    <Heart className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-400">No predictions yet. Make your first prediction!</p>
                    <button
                      onClick={() => navigate('/prediction')}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      Make a Prediction
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {predictions.map((prediction) => (
                      <motion.div
                        key={prediction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-full ${
                              prediction.risk_level === 'High' 
                                ? 'bg-red-500/20 text-red-500' 
                                : 'bg-green-500/20 text-green-500'
                            }`}>
                              {prediction.risk_level === 'High' 
                                ? <AlertCircle className="w-6 h-6" />
                                : <CheckCircle className="w-6 h-6" />
                              }
                            </div>
                            <div>
                              <h3 className="text-white font-medium">
                                {prediction.risk_level} Risk
                              </h3>
                              <p className="text-purple-400">
                                {(prediction.probability * 100).toFixed(1)}% Probability
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="w-4 h-4 mr-2" />
                            {formatDate(prediction.timestamp)}
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(prediction.input_data).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="text-gray-400">{key.charAt(0).toUpperCase() + key.slice(1)}: </span>
                              <span className="text-white">{value}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfilePage; 