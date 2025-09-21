"use client"
import { motion } from "framer-motion"

function LoadingPage() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-purple-100 backdrop-blur-sm h-screen w-full flex flex-col justify-center items-center z-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 p-8 rounded-2xl bg-white/80 backdrop-blur-md shadow-2xl border border-purple-100 flex flex-col items-center">
        {/* Logo with enhanced styling */}
        <motion.h1
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          ENTRAZON
        </motion.h1>

        {/* Enhanced loading animation */}
        <div className="flex justify-center items-center space-x-2 mb-4">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full shadow-lg"
              animate={{
                y: [0, -16, 0],
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.2,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <motion.p
          className="text-purple-600 font-medium text-sm tracking-wide"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          Loading your learning experience...
        </motion.p>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-purple-100 rounded-full mt-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  )
}

export default LoadingPage
