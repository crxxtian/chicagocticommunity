
import { useEffect, useRef, useState } from "react";

export const CyberAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      originalX: number;
      originalY: number;
    }> = [];
    
    const colors = ["#0EA5E9", "#8B5CF6", "#D946EF", "#F97316", "#9b87f5"];
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      createParticles();
    };
    
    const createParticles = () => {
      particles = [];
      const numParticles = Math.floor(canvas.width * canvas.height / 10000);
      
      for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2 + 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particles.push({
          x,
          y,
          radius,
          color,
          vx: 0,
          vy: 0,
          originalX: x,
          originalY: y
        });
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Calculate distance from mouse
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Repel particles if mouse is nearby
        if (distance < 100) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (100 - distance) / 50;
          particle.vx = -forceDirectionX * force;
          particle.vy = -forceDirectionY * force;
        } else {
          // Move back to original position
          const dxOrigin = particle.originalX - particle.x;
          const dyOrigin = particle.originalY - particle.y;
          particle.vx = dxOrigin * 0.05;
          particle.vy = dyOrigin * 0.05;
        }
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Draw the particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Draw connections between particles
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(150, 150, 255, ${(100 - distance) / 100 * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousemove", handleMouseMove);
    
    resizeCanvas();
    animate();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);
  
  return (
    <div className="w-full mt-12 mb-8 overflow-hidden rounded-lg">
      <h2 className="font-mono text-xl mb-4 text-center">Interactive Threat Network</h2>
      <canvas 
        ref={canvasRef} 
        className="w-full h-[250px] bg-secondary/20 rounded-lg cursor-pointer border border-border"
      />
      <p className="text-center text-sm text-muted-foreground mt-2">
        Move your cursor to see how threats disperse in a network
      </p>
    </div>
  );
};
