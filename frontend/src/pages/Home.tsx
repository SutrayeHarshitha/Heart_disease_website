import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Activity, AlertCircle, ArrowRight } from 'lucide-react';
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const features = [
    {
      icon: <Heart className="h-10 w-10 text-red-500" />,
      title: 'Early Detection',
      description:
        'Our AI-powered system helps identify potential heart disease risks before they become serious problems.',
    },
    {
      icon: <Activity className="h-10 w-10 text-blue-500" />,
      title: 'Personalized Analysis',
      description:
        'Get insights tailored to your specific health metrics and lifestyle factors.',
    },
    {
      icon: <AlertCircle className="h-10 w-10 text-amber-500" />,
      title: 'Prevention Guidance',
      description:
        'Receive actionable recommendations to reduce your risk of heart disease.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <BackgroundBeamsWithCollision className="min-h-screen">
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
                    Predict and Prevent
                  </span>{' '}
                  <span className="text-white">
                    Heart Disease
                  </span>
                </h1>
                <p className="text-lg text-gray-300 mb-8">
                  Our advanced AI-powered platform analyzes your health data to predict potential heart disease risks and provides personalized prevention strategies.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/prediction"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white font-medium rounded-lg shadow-lg hover:opacity-90 transition-opacity group"
                  >
                    Get Your Prediction
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-medium rounded-lg shadow-lg hover:bg-white/20 transition-colors border border-white/20"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Heart health visualization"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 to-transparent"></div>
                </div>
                <motion.div
                  className="absolute -bottom-6 -right-6 bg-black/50 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Success Rate</p>
                      <p className="text-xl font-bold text-white">95%</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </BackgroundBeamsWithCollision>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              How HeartGuard Works
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Our platform combines medical expertise with advanced machine learning to provide accurate heart disease risk assessment.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-white/10 transition-all hover:border-white/20"
              >
                <div className="mb-4 p-3 rounded-full bg-black/50 inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-500/90 via-violet-500/90 to-pink-500/90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Take Control of Your Heart Health Today
            </h2>
            <p className="text-lg text-indigo-100 mb-8">
              Don't wait until it's too late. Our prediction tool can help you understand your risk factors and take preventive action.
            </p>
            <Link
              to="/prediction"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-medium rounded-lg shadow-lg hover:bg-indigo-50 transition-colors text-lg"
            >
              Get Your Heart Health Assessment
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;