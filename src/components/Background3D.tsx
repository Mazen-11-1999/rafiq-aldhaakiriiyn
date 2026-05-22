import React, { useEffect, useRef } from 'react';

interface Raindrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

interface SpiritualLight {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  alphaSpeed: number;
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Arrays of particles
    const raindrops: Raindrop[] = [];
    const spiritualLights: SpiritualLight[] = [];
    const ripples: Ripple[] = [];

    // Colors that match light/dark modes
    const isDark = document.documentElement.classList.contains('dark');
    const rainColor = isDark ? 'rgba(156, 187, 171, 0.15)' : 'rgba(78, 99, 90, 0.12)';
    const lightColors = isDark 
      ? ['rgba(244, 223, 203, 0.35)', 'rgba(209, 232, 221, 0.4)', 'rgba(255, 255, 255, 0.2)']
      : ['rgba(217, 184, 150, 0.25)', 'rgba(78, 99, 90, 0.08)', 'rgba(255, 255, 255, 0.4)'];

    // Initialize raindrops
    const maxRaindrops = 65;
    for (let i = 0; i < maxRaindrops; i++) {
      raindrops.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        speed: 2 + Math.random() * 4,
        length: 12 + Math.random() * 20,
        opacity: 0.1 + Math.random() * 0.4,
      });
    }

    // Initialize spiritual lights (warm glowing wisdom nodes)
    const maxLights = 15;
    for (let i = 0; i < maxLights; i++) {
      spiritualLights.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 15 + Math.random() * 35,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.1 - Math.random() * 0.4, // gently rising like prayers/duas
        alpha: 0.1 + Math.random() * 0.5,
        alphaSpeed: 0.002 + Math.random() * 0.005,
        color: lightColors[Math.floor(Math.random() * lightColors.length)],
      });
    }

    // Handle Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const draw = () => {
      // Clear with background color blending
      ctx.clearRect(0, 0, width, height);
      
      // Paint Background Gradients/Base
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (document.documentElement.classList.contains('dark')) {
        bgGrad.addColorStop(0, '#121916');
        bgGrad.addColorStop(1, '#0e1210');
      } else {
        bgGrad.addColorStop(0, '#fbf9f6');
        bgGrad.addColorStop(0.5, '#f7f4ec');
        bgGrad.addColorStop(1, '#f1ede2');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Draw and update Spiritual Lights (gently floating glowing nodes)
      spiritualLights.forEach((light) => {
        // Update positions
        light.x += light.vx;
        light.y += light.vy;
        
        // Pulsing opacity
        light.alpha += light.alphaSpeed;
        if (light.alpha > 0.6 || light.alpha < 0.1) {
          light.alphaSpeed = -light.alphaSpeed;
        }

        // Boundary wrap
        if (light.y < -light.radius * 2) {
          light.y = height + light.radius * 2;
          light.x = Math.random() * width;
        }
        if (light.x < -light.radius * 2 || light.x > width + light.radius * 2) {
          light.x = Math.random() * width;
        }

        // Draw radial glow for the spiritual barakah sparks
        const grad = ctx.createRadialGradient(
          light.x, light.y, 0,
          light.x, light.y, light.radius
        );
        
        // Color transition
        const baseColor = light.color.substring(0, light.color.lastIndexOf(','));
        grad.addColorStop(0, `${baseColor}, ${light.alpha})`);
        grad.addColorStop(0.5, `${baseColor}, ${light.alpha * 0.4})`);
        grad.addColorStop(1, `${baseColor}, 0)`);

        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw and update Raindrops (falling from the clouds of mercy)
      ctx.strokeStyle = rainColor;
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';

      raindrops.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 1, drop.y + drop.length); // slightly slanted rain
        ctx.stroke();

        // Update positions
        drop.y += drop.speed;
        drop.x -= 0.15; // match slant

        // If hits bottom or ground, create a ripple and reset
        if (drop.y > height - 10) {
          // Chance to trigger ripple at bottom
          if (ripples.length < 35 && Math.random() < 0.4) {
            ripples.push({
              x: drop.x,
              y: height - (Math.random() * 30 + 5), // Ripple triggers near the bottom
              radius: 1,
              maxRadius: 15 + Math.random() * 25,
              alpha: 0.3,
            });
          }

          // Reset raindrop back to top
          drop.y = -drop.length - Math.random() * 100;
          drop.x = Math.random() * width;
          drop.speed = 1.8 + Math.random() * 3.5;
        }
      });

      // 3. Draw and update Ripples (representing splashes of divine mercy on the ground)
      ctx.lineWidth = 1.0;
      ripples.forEach((ripple, index) => {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(78, 99, 90, ${ripple.alpha})`;
        ctx.stroke();

        // Update ripple
        ripple.radius += 0.6;
        ripple.alpha -= 0.008;

        // Remove dead ripples
        if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) {
          ripples.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div id="dynamic-spirit-background" className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
      />
      {/* Absolute overlay for modern glassmorphism blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fbf9f6]/30 via-transparent to-[#fbf9f6]/40 dark:from-transparent dark:to-transparent z-[1] pointer-events-none" />
    </div>
  );
}
