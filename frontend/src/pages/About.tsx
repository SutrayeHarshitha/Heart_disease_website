import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Shield, Award, Users } from 'lucide-react';

const About = () => {
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

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  const iconHoverVariants = {
    hover: {
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 bg-gradient-to-b from-black via-zinc-900 to-black text-white"
    >
      {/* Hero Section */}
      <section className="py-12 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 bg-grid-white/[0.1] bg-[length:50px_50px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-black/50 to-transparent"
        />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
              About Heart Disease
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Understanding heart disease is the first step toward prevention. Our mission is to provide accessible tools and information to help people assess and reduce their risk.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is Heart Disease */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
                What is Heart Disease?
              </h2>
              <p className="text-gray-300 mb-4">
                Heart disease refers to several types of heart conditions. The most common type is coronary artery disease, which can lead to heart attack. Other conditions affect your heart's muscle, valves, or rhythm.
              </p>
              <p className="text-gray-300 mb-4">
                Heart disease is the leading cause of death for both men and women worldwide. Every year, about 17.9 million people die from cardiovascular diseases, accounting for 31% of all global deaths.
              </p>
              <p className="text-gray-300">
                The good news is that many forms of heart disease can be prevented or treated with healthy lifestyle choices and proper medical care.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative">
                <img
                  src="https://cdn.britannica.com/51/122151-050-83335A25/Cross-section-human-heart.jpg"
                  alt="Heart anatomy illustration"
                  className="rounded-xl shadow-2xl w-full h-auto object-contain bg-white/5 p-4 transform transition duration-300 group-hover:scale-[1.02]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://upload.wikimedia.org/wikipedia/commons/e/e5/Diagram_of_the_human_heart_%28cropped%29.svg";
                    target.onerror = null;
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm backdrop-blur-sm bg-black/30 p-2 rounded-lg">
                    Understanding heart anatomy is crucial for recognizing and preventing heart disease
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Risk Factors */}
      <section className="py-16 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 bg-grid-white/[0.1] bg-[length:50px_50px]"
        />
        <div className="container mx-auto px-4 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500"
            >
              Risk Factors for Heart Disease
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Several health conditions, lifestyle choices, and genetic factors can increase your risk of heart disease.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              variants={{
                ...itemVariants,
                ...cardHoverVariants
              }}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="backdrop-blur-sm bg-white/10 p-6 rounded-xl border border-white/20"
            >
              <h3 className="text-xl font-bold text-white mb-3">Health Conditions</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>High blood pressure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>High cholesterol</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Diabetes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Obesity</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              variants={{
                ...itemVariants,
                ...cardHoverVariants
              }}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="backdrop-blur-sm bg-white/10 p-6 rounded-xl border border-white/20"
            >
              <h3 className="text-xl font-bold text-white mb-3">Lifestyle Factors</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Smoking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Poor diet</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Physical inactivity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Excessive alcohol consumption</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              variants={{
                ...itemVariants,
                ...cardHoverVariants
              }}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="backdrop-blur-sm bg-white/10 p-6 rounded-xl border border-white/20"
            >
              <h3 className="text-xl font-bold text-white mb-3">Other Factors</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Age (risk increases with age)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Family history of heart disease</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Stress</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Sleep apnea</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Prevention */}
      <section className="py-16 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 bg-grid-white/[0.1] bg-[length:50px_50px]"
        />
        <div className="container mx-auto px-4 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500"
            >
              Preventing Heart Disease
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Many heart diseases can be prevented by making healthy lifestyle choices.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover="hover"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              variants={{
                ...cardHoverVariants,
                ...itemVariants
              }}
              className="backdrop-blur-sm bg-white/10 p-8 rounded-xl border border-white/20"
            >
              <div className="flex flex-col space-y-6">
                <motion.div 
                  className="flex items-start"
                  whileHover="hover"
                  variants={iconHoverVariants}
                >
                  <div className="mr-4 p-2 bg-purple-500/10 rounded-full">
                    <Activity className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Regular Physical Activity</h3>
                    <p className="text-gray-300">
                      Aim for at least 150 minutes of moderate-intensity exercise per week. This can help control weight, reduce blood pressure, and improve cholesterol levels.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start"
                  whileHover="hover"
                  variants={iconHoverVariants}
                >
                  <div className="mr-4 p-2 bg-purple-500/10 rounded-full">
                    <Shield className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Healthy Diet</h3>
                    <p className="text-gray-300">
                      Eat a diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit salt, sugar, and processed foods.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start"
                  whileHover="hover"
                  variants={iconHoverVariants}
                >
                  <div className="mr-4 p-2 bg-purple-500/10 rounded-full">
                    <Award className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Maintain a Healthy Weight</h3>
                    <p className="text-gray-300">
                      Being overweight increases your risk of heart disease. Losing even a small amount of weight can help reduce this risk.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover="hover"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              variants={{
                ...cardHoverVariants,
                ...itemVariants
              }}
              className="backdrop-blur-sm bg-white/10 p-8 rounded-xl border border-white/20"
            >
              <div className="flex flex-col space-y-6">
                <motion.div 
                  className="flex items-start"
                  whileHover="hover"
                  variants={iconHoverVariants}
                >
                  <div className="mr-4 p-2 bg-purple-500/10 rounded-full">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Don't Smoke</h3>
                    <p className="text-gray-300">
                      If you smoke, quit. If you don't smoke, don't start. Smoking damages your blood vessels and can lead to heart disease.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start"
                  whileHover="hover"
                  variants={iconHoverVariants}
                >
                  <div className="mr-4 p-2 bg-purple-500/10 rounded-full">
                    <Heart className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Limit Alcohol</h3>
                    <p className="text-gray-300">
                      Excessive alcohol consumption can raise blood pressure and add extra calories, leading to weight gain.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start"
                  whileHover="hover"
                  variants={iconHoverVariants}
                >
                  <div className="mr-4 p-2 bg-purple-500/10 rounded-full">
                    <Activity className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Manage Stress</h3>
                    <p className="text-gray-300">
                      Chronic stress can contribute to heart disease. Find healthy ways to manage stress, such as exercise, meditation, or spending time with loved ones.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Technology */}
      <section className="py-16 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 bg-grid-white/[0.1] bg-[length:50px_50px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-pink-500/20"
        />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
              Our Prediction Technology
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              HeartGuard uses advanced machine learning algorithms trained on extensive medical datasets to provide accurate heart disease risk assessments. Our model considers multiple risk factors to deliver personalized predictions.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl"
            >
              <a href="/prediction" className="flex items-center">
                Try Our Prediction Tool
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Heart className="ml-2 h-5 w-5" />
                </motion.div>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;