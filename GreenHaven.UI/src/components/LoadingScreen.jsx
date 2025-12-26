import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ message = "Growing GreenHaven..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-secondary"
    >
      <div className="relative flex flex-col items-center">
        {/* Logo Animation */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8 relative"
        >
          <img 
            src="/logo.png" 
            alt="GreenHaven Logo" 
            className="w-24 h-24 md:w-32 md:h-32 object-contain relative z-10"
          />
          {/* Subtle Glow */}
          <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full -z-10" />
        </motion.div>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden mb-6">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-full h-full bg-primary shadow-[0_0_10px_rgba(27,67,50,0.5)]"
          />
        </div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary font-serif text-xl md:text-2xl font-semibold tracking-widest uppercase"
        >
          {message}
        </motion.p>

        {/* Decorative Elements */}
        <div className="absolute -z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="w-[400px] h-[400px] border border-primary/5 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-primary/10 rounded-full border-dashed"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
