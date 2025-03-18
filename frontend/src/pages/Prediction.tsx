import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, AlertCircle, CheckCircle, ArrowDown, User, Mail, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Prediction = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    chestPain: '',
    restingBP: '',
    cholesterol: '',
    fastingBS: '',
    restingECG: '',
    maxHR: '',
    smoking: '',
    obesity: ''
  });

  const [prediction, setPrediction] = useState<null | boolean>(null);
  const [probability, setProbability] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProbability(null);
    
    try {
      // First test if the server is running
      try {
        const testResponse = await fetch('http://localhost:5000/test');
        if (!testResponse.ok) {
          throw new Error('Server is not responding properly');
        }
      } catch (e) {
        throw new Error('Cannot connect to the server. Please make sure the backend server is running.');
      }

      if (!token) {
        throw new Error('Please log in to make predictions');
      }

      // Create prediction data object
      const predictionData = {
        age: parseInt(formData.age),
        gender: formData.gender === 'male' ? 1 : 0,
        chestPain: formData.chestPain,
        restingBP: parseInt(formData.restingBP),
        cholesterol: parseInt(formData.cholesterol),
        fastingBS: formData.fastingBS === 'yes' ? 1 : 0,
        restingECG: formData.restingECG,
        maxHR: parseInt(formData.maxHR),
        smoking: formData.smoking === 'yes' ? 1 : 0,
        obesity: formData.obesity === 'yes' ? 1 : 0,
        timestamp: new Date().toISOString(),
        userId: user?.id
      };

      console.log('Sending data to backend:', predictionData);
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(predictionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get prediction');
      }

      if (!data.success) {
        throw new Error(data.error || 'Prediction failed');
      }

      console.log('Received response:', data);
      setPrediction(data.prediction === 1);
      setProbability(data.probability * 100);

      // Store prediction in user's history
      try {
        const historyResponse = await fetch('http://localhost:5000/user/predictions', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          console.log('Updated prediction history:', historyData);
        }
      } catch (historyError) {
        console.error('Error fetching updated history:', historyError);
      }

    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while making the prediction');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      age: '',
      gender: '',
      chestPain: '',
      restingBP: '',
      cholesterol: '',
      fastingBS: '',
      restingECG: '',
      maxHR: '',
      smoking: '',
      obesity: ''
    });
    setPrediction(null);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-black via-zinc-900 to-black"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
              Heart Disease Prediction Tool
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Fill in your health information below to get a personalized heart disease risk assessment.
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <motion.div
                variants={fadeInUp}
                className="p-6 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">Advanced Analysis</h3>
                <p className="text-gray-400 text-sm">
                  Our AI model analyzes multiple health factors for accurate predictions.
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="p-6 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="h-12 w-12 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-6 w-6 text-pink-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">Instant Results</h3>
                <p className="text-gray-400 text-sm">
                  Get immediate risk assessment based on your health data.
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="p-6 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-violet-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">Personalized Insights</h3>
                <p className="text-gray-400 text-sm">
                  Receive tailored recommendations based on your results.
                </p>
              </motion.div>
            </div>

            {/* View Results Button */}
            <motion.button
              variants={fadeInUp}
              onClick={scrollToForm}
              className="group px-8 py-4 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300 flex items-center mx-auto"
            >
              View Results
              <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </motion.button>
          </motion.div>

          <div ref={formRef}>
          {prediction === null ? (
            <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="backdrop-blur-sm bg-white/10 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)] p-8 border border-white/20"
              >
                {user && (
                  <motion.div
                    variants={fadeInUp}
                    className="mb-6 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center text-gray-300">
                          <User className="h-4 w-4 mr-2" />
                          <span className="text-sm">{user.name}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Mail className="h-4 w-4 mr-2" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center justify-center w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        <History className="h-4 w-4 mr-2" />
                        View Prediction History
                      </button>
                    </div>
                  </motion.div>
                )}
              <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div 
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* Form fields - wrapping each in motion.div */}
                    <motion.div variants={fadeInUp}>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      min="1"
                      max="120"
                        className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                      placeholder="Enter your age"
                    />
                    </motion.div>

                    {/* Repeat for other form fields, wrapping each in motion.div */}
                    <motion.div variants={fadeInUp}>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                        className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                      >
                        <option value="" className="bg-zinc-900">Select gender</option>
                        <option value="male" className="bg-zinc-900">Male</option>
                        <option value="female" className="bg-zinc-900">Female</option>
                    </select>
                    </motion.div>

                  {/* Chest Pain Type */}
                    <motion.div variants={fadeInUp}>
                      <label htmlFor="chestPain" className="block text-sm font-medium text-gray-300 mb-1">
                      Chest Pain Type
                    </label>
                    <select
                      id="chestPain"
                      name="chestPain"
                      value={formData.chestPain}
                      onChange={handleChange}
                      required
                        className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                      >
                        <option value="" className="bg-zinc-900">Select type</option>
                        <option value="typical" className="bg-zinc-900">Typical Angina</option>
                        <option value="atypical" className="bg-zinc-900">Atypical Angina</option>
                        <option value="nonanginal" className="bg-zinc-900">Non-Anginal Pain</option>
                        <option value="asymptomatic" className="bg-zinc-900">Asymptomatic</option>
                    </select>
                    </motion.div>

                  {/* Resting Blood Pressure */}
                    <motion.div variants={fadeInUp}>
                      <label htmlFor="restingBP" className="block text-sm font-medium text-gray-300 mb-1">
                      Resting Blood Pressure (mm Hg)
                    </label>
                    <input
                      type="number"
                      id="restingBP"
                      name="restingBP"
                      value={formData.restingBP}
                      onChange={handleChange}
                      required
                      min="80"
                      max="200"
                        className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                      placeholder="e.g., 120"
                    />
                    </motion.div>

                  {/* Cholesterol */}
                    <motion.div variants={fadeInUp}>
                      <label htmlFor="cholesterol" className="block text-sm font-medium text-gray-300 mb-1">
                      Serum Cholesterol (mg/dl)
                    </label>
                    <input
                      type="number"
                      id="cholesterol"
                      name="cholesterol"
                      value={formData.cholesterol}
                      onChange={handleChange}
                      required
                      min="100"
                      max="600"
                        className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                      placeholder="e.g., 200"
                    />
                    </motion.div>

                  {/* Fasting Blood Sugar */}
                    <motion.div variants={fadeInUp}>
                      <label htmlFor="fastingBS" className="block text-sm font-medium text-gray-300 mb-1">
                      Fasting Blood Sugar &gt; 120 mg/dl
                    </label>
                    <select
                      id="fastingBS"
                      name="fastingBS"
                      value={formData.fastingBS}
                      onChange={handleChange}
                      required
                        className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                      >
                        <option value="" className="bg-zinc-900">Select option</option>
                        <option value="yes" className="bg-zinc-900">Yes</option>
                        <option value="no" className="bg-zinc-900">No</option>
                    </select>
                    </motion.div>

                  {/* Resting ECG */}
                    <motion.div variants={fadeInUp}>
                      <label htmlFor="restingECG" className="block text-sm font-medium text-gray-300 mb-1">
                      Resting ECG Results
                    </label>
                    <select
                      id="restingECG"
                      name="restingECG"
                      value={formData.restingECG}
                      onChange={handleChange}
                      required
                        className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                      >
                        <option value="" className="bg-zinc-900">Select result</option>
                        <option value="normal" className="bg-zinc-900">Normal</option>
                        <option value="st-t" className="bg-zinc-900">ST-T Wave Abnormality</option>
                        <option value="lv" className="bg-zinc-900">Left Ventricular Hypertrophy</option>
                    </select>
                    </motion.div>

                  {/* Max Heart Rate */}
                    <motion.div variants={fadeInUp}>
                      <label htmlFor="maxHR" className="block text-sm font-medium text-gray-300 mb-1">
                      Maximum Heart Rate
                    </label>
                    <input
                      type="number"
                      id="maxHR"
                      name="maxHR"
                      value={formData.maxHR}
                      onChange={handleChange}
                      required
                      min="60"
                      max="220"
                        className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                      placeholder="e.g., 150"
                    />
                    </motion.div>

                    {/* Smoking Status */}
                    <motion.div variants={fadeInUp}>
                      <label htmlFor="smoking" className="block text-sm font-medium text-gray-300 mb-1">
                        Smoking Status
                    </label>
                    <select
                        id="smoking"
                        name="smoking"
                        value={formData.smoking}
                      onChange={handleChange}
                      required
                        className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                      >
                        <option value="" className="bg-zinc-900">Select option</option>
                        <option value="yes" className="bg-zinc-900">Yes</option>
                        <option value="no" className="bg-zinc-900">No</option>
                    </select>
                    </motion.div>

                    {/* Obesity Status */}
                    <motion.div variants={fadeInUp}>
                      <label htmlFor="obesity" className="block text-sm font-medium text-gray-300 mb-1">
                        Obesity Status
                    </label>
                    <select
                        id="obesity"
                        name="obesity"
                        value={formData.obesity}
                      onChange={handleChange}
                      required
                        className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                      >
                        <option value="" className="bg-zinc-900">Select option</option>
                        <option value="yes" className="bg-zinc-900">Yes</option>
                        <option value="no" className="bg-zinc-900">No</option>
                      </select>
                    </motion.div>
                  </motion.div>

                  {error && (
                    <motion.div
                      variants={fadeInUp}
                      className="p-4 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
                    >
                      <p className="text-sm">{error}</p>
                    </motion.div>
                  )}

                  <motion.div 
                    variants={fadeInUp}
                    className="pt-6"
                  >
                  <button
                    type="submit"
                      className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white font-medium rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center group"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                        <span className="flex items-center">
                          Get Prediction
                          <Heart className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        </span>
                    )}
                  </button>
                  </motion.div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100 
                }}
                className="backdrop-blur-sm bg-white/10 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)] p-8 border border-white/20"
              >
                {user && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center text-gray-300">
                          <User className="h-4 w-4 mr-2" />
                          <span className="text-sm">{user.name}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Mail className="h-4 w-4 mr-2" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center justify-center w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        <History className="h-4 w-4 mr-2" />
                        View Prediction History
                      </button>
                    </div>
                  </motion.div>
                )}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                {prediction ? (
                    <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-500 p-1">
                      <div className="w-full h-full rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                      </div>
                  </div>
                ) : (
                    <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 p-1">
                      <div className="w-full h-full rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                      </div>
                  </div>
                )}
                </motion.div>

                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-4 text-white"
                >
                {prediction
                  ? 'Higher Risk of Heart Disease Detected'
                  : 'Lower Risk of Heart Disease Detected'}
                </motion.h2>

                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 mb-4"
                >
                {prediction
                  ? 'Based on the information provided, our model predicts a higher risk of heart disease. Please consult with a healthcare professional for a thorough evaluation.'
                  : 'Based on the information provided, our model predicts a lower risk of heart disease. Continue maintaining a healthy lifestyle and regular check-ups.'}
                </motion.p>

                {probability !== null && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="mb-8 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <p className="text-sm text-gray-300">
                      Prediction Confidence: <span className="font-semibold text-purple-400">{probability.toFixed(1)}%</span>
                    </p>
                  </motion.div>
                )}

                

                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                onClick={resetForm}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white font-medium rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 w-full group"
              >
                  <span className="flex items-center justify-center">
                Make Another Prediction
                    <Heart className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </span>
                </motion.button>
            </motion.div>
          )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Prediction;