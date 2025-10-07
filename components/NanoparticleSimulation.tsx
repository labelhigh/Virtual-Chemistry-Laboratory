
import React, { useRef, useEffect } from 'react';
import type { NanoparticleResult } from '../types';

interface NanoparticleSimulationProps {
  result: NanoparticleResult;
  isLoading: boolean;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  color: string;
  targetColor: string;

  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = 5; // Start small and grow
    this.targetRadius = radius;
    this.color = '#f87171'; // Start from a base color
    this.targetColor = color;
  }

  update(width: number, height: number) {
    // Movement
    this.x += this.vx;
    this.y += this.vy;

    // Wall collision
    if (this.x - this.radius < 0 || this.x + this.radius > width) this.vx *= -1;
    if (this.y - this.radius < 0 || this.y + this.radius > height) this.vy *= -1;

    // Animate radius
    this.radius += (this.targetRadius - this.radius) * 0.05;
    
    // Animate color (basic interpolation)
    // This is a simplified color transition. A library would be better for complex cases.
    if (this.color !== this.targetColor) {
        // For this demo, we'll just jump, but a real version would interpolate hex values.
        this.color = this.targetColor;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.8;
    ctx.fill();
    
    // Add a 'glow' effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow
    ctx.globalAlpha = 1.0;
  }
}

const NanoparticleSimulation: React.FC<NanoparticleSimulationProps> = ({ result, isLoading }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    canvas.width = width;
    canvas.height = height;

    if (!ctx) return;

    // Initialize particles on first render
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particlesRef.current.push(new Particle(x, y, result.particleSize / 2, result.color));
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particlesRef.current.forEach(p => {
        p.update(width, height);
        p.draw(ctx);
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Effect to update particle targets when result changes
  useEffect(() => {
    particlesRef.current.forEach(p => {
      p.targetRadius = result.particleSize / 2;
      p.targetColor = result.color;
    });
  }, [result]);

  return (
    <div ref={containerRef} className="relative bg-gray-900 rounded-xl shadow-md h-full w-full overflow-hidden">
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ 
            background: `radial-gradient(circle, ${result.solutionColor}00 0%, ${result.solutionColor} 70%)`,
            opacity: 0.4,
            transition: 'background 500ms ease-in-out'
          }}
        />
        <canvas ref={canvasRef} className={`transition-opacity duration-500 ${isLoading ? 'opacity-30' : 'opacity-100'}`}></canvas>
    </div>
  );
};

export default NanoparticleSimulation;
