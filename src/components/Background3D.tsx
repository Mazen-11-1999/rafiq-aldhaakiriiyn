import React from 'react';
import { motion } from 'motion/react';

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#fbf9f6]">
      {/* Base Image Layer */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.pexels.com/photos/8384879/pexels-photo-8384879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")' }}
      />
      
      {/* Soft Overlay to blend the image and ensure content readability */}
      <div className="absolute inset-0 bg-linear-to-b from-[#fbf9f6]/80 via-[#fbf9f6]/40 to-[#fbf9f6]/90 z-[1]" />

      {/* Deepest Layer - Large soft gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [-50, 50, -50],
          y: [-50, 50, -50],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] rounded-full bg-[#d1e8dd]/40 blur-[120px]"
      />
      
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          x: [50, -50, 50],
          y: [50, -50, 50],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#f4dfcb]/40 blur-[120px]"
      />

      {/* Mid Layer - Organic floating "glass" orbs */}
      <motion.div 
        animate={{ 
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[15%] w-64 h-64 rounded-full bg-white/30 backdrop-blur-3xl border border-white/40 shadow-2xl shadow-[#4e635a]/5 ring-1 ring-white/20"
      />

      <motion.div 
        animate={{ 
          y: [30, -30, 30],
          x: [20, -20, 20],
          rotate: [0, -8, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[30%] left-[10%] w-48 h-48 rounded-[60px] bg-white/20 backdrop-blur-2xl border border-white/30 shadow-xl ring-1 ring-white/10"
      />

      {/* Floating Pill Shape like in the Dribbble shot */}
      <motion.div 
        animate={{ 
          y: [0, 40, 0],
          rotate: [15, 20, 15],
          x: [0, 10, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[20%] w-32 h-64 rounded-full bg-linear-to-br from-white/40 to-white/10 backdrop-blur-xl border border-white/50 shadow-2xl ring-1 ring-white/20"
      />

      <motion.div 
        animate={{ 
          y: [0, -40, 0],
          rotate: [-25, -20, -25],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] right-[25%] w-24 h-48 rounded-full bg-linear-to-tr from-[#d1e8dd]/40 to-white/10 backdrop-blur-xl border border-white/50 shadow-2xl ring-1 ring-white/20"
      />

      {/* Floating Accent Elements (Small particles/lights) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            opacity: 0 
          }}
          animate={{ 
            y: [null, Math.random() * -100 - 50],
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: 10 + Math.random() * 10, 
            repeat: Infinity, 
            delay: Math.random() * 5,
            ease: "linear"
          }}
          className="absolute w-2 h-2 rounded-full bg-[#4e635a]/20 blur-[1px]"
        />
      ))}

      {/* Glass Pane Overlays for edge depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#fbf9f6]/20 pointer-events-none" />
    </div>
  );
}
