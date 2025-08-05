import React, { useEffect, useRef } from 'react';

interface Raindrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

export const RainAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raindrops = useRef<Raindrop[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createRaindrops = () => {
      const dropCount = Math.floor(window.innerWidth / 4);
      raindrops.current = [];
      
      for (let i = 0; i < dropCount; i++) {
        raindrops.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight - window.innerHeight,
          length: Math.random() * 30 + 15,
          speed: Math.random() * 3 + 2,
          opacity: Math.random() * 0.6 + 0.3
        });
      }
    };

    const drawRain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      raindrops.current.forEach((drop) => {
        // Create gradient for realistic raindrop
        const gradient = ctx.createLinearGradient(
          drop.x, drop.y, 
          drop.x + drop.length * 0.3, drop.y + drop.length
        );
        gradient.addColorStop(0, `rgba(88, 28, 135, ${drop.opacity})`); // Dark purple start
        gradient.addColorStop(0.5, `rgba(107, 33, 168, ${drop.opacity * 0.9})`); // Dark purple middle
        gradient.addColorStop(1, `rgba(126, 58, 183, ${drop.opacity * 0.6})`); // Medium purple end
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.random() * 2.5 + 1.5;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.length * 0.3, drop.y + drop.length);
        ctx.stroke();
        
        // Update position
        drop.y += drop.speed;
        drop.x += drop.speed * 0.3; // Slight horizontal movement for wind effect
        
        // Reset raindrop when it goes off screen
        if (drop.y > canvas.height + drop.length) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
          drop.length = Math.random() * 30 + 15;
          drop.speed = Math.random() * 3 + 2;
          drop.opacity = Math.random() * 0.6 + 0.3;
        }
        
        if (drop.x > canvas.width + drop.length) {
          drop.x = -drop.length;
        }
      });
    };

    const animate = () => {
      drawRain();
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createRaindrops();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createRaindrops();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};