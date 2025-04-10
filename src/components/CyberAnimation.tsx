
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
    
    // Wind particles
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      angle: number;
      opacity: number;
      followMouse: boolean;
    }> = [];
    
    // Green color palette for cyber wind
    const colors = [
      "rgba(122, 229, 130, 0.7)",
      "rgba(66, 211, 146, 0.7)",
      "rgba(42, 188, 102, 0.7)",
      "rgba(30, 156, 69, 0.7)",
      "rgba(18, 128, 42, 0.7)",
    ];
    
    // Add some blue accent colors for variety
    const accentColors = [
      "rgba(14, 165, 233, 0.5)", // Ocean blue
      "rgba(242, 252, 226, 0.6)", // Soft green
    ];
    
    const allColors = [...colors, ...accentColors];
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      createParticles();
    };
    
    const createParticles = () => {
      particles = [];
      const numParticles = Math.floor(canvas.width * canvas.height / 6000);
      
      for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle());
      }
    };
    
    const createParticle = () => {
      const size = Math.random() * 15 + 2;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        color: allColors[Math.floor(Math.random() * allColors.length)],
        speed: Math.random() * 3 + 1,
        angle: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.6 + 0.2,
        followMouse: Math.random() > 0.7 // 30% of particles will directly follow the mouse
      };
    };
    
    const drawWind = (x: number, y: number) => {
      ctx.save();
      
      // Create radial gradient for the wind swoosh
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 150);
      gradient.addColorStop(0, "rgba(122, 229, 130, 0.4)");
      gradient.addColorStop(0.5, "rgba(66, 211, 146, 0.2)");
      gradient.addColorStop(1, "rgba(14, 165, 233, 0)");
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 150, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw wind effect around mouse
      if (mousePosition.x > 0 && mousePosition.y > 0) {
        drawWind(mousePosition.x, mousePosition.y);
      }
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        // Different behavior based on if particle should follow the mouse directly
        if (particle.followMouse && mousePosition.x > 0 && mousePosition.y > 0) {
          // Direct followers - move toward mouse position
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
          
          if (distanceToMouse > 5) { // Don't move if very close to mouse
            const targetAngle = Math.atan2(dy, dx);
            particle.angle = targetAngle;
            particle.speed = Math.min(5, 2 + (150 / distanceToMouse));
          } else {
            // Orbit around the mouse when very close
            particle.angle += 0.1;
            particle.speed = 1;
          }
        } else {
          // Calculate distance from mouse to affect particle movement
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Adjust particle angle based on mouse position
          if (distance < 200 && mousePosition.x > 0 && mousePosition.y > 0) {
            const targetAngle = Math.atan2(dy, dx) + Math.PI; // Move away from mouse
            const angleDiff = targetAngle - particle.angle;
            
            // Normalize angle difference
            const normalizedDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
            
            // Gradually adjust angle
            particle.angle += normalizedDiff * 0.1;
            particle.speed = Math.min(particle.speed + 0.2, 8);
          } else {
            // Slow down gradually when away from mouse
            particle.speed = Math.max(particle.speed - 0.05, 1);
          }
        }
        
        // Move particle based on its angle and speed
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        
        // Wrap particles around the canvas
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;
        
        // Draw the particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        
        // Draw a more wind-like shape
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(
          particle.x - Math.cos(particle.angle) * particle.size * 2.5,
          particle.y - Math.sin(particle.angle) * particle.size * 2.5
        );
        ctx.lineTo(
          particle.x - Math.cos(particle.angle) * particle.size * 3 + Math.sin(particle.angle) * particle.size * 0.8,
          particle.y - Math.sin(particle.angle) * particle.size * 3 - Math.cos(particle.angle) * particle.size * 0.8
        );
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
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
    
    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };
    
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    
    resizeCanvas();
    animate();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);
  
  return (
    <div className="w-full my-12 overflow-hidden rounded-lg">
      <h2 className="font-mono text-xl mb-4 text-center">The Windy City of Threats</h2>
      <canvas 
        ref={canvasRef} 
        className="w-full h-[300px] bg-gradient-to-b from-secondary/20 to-secondary/5 rounded-lg cursor-pointer border border-border"
      />
      <p className="text-center text-sm text-muted-foreground mt-2">
        Move your cursor through the cyber winds to see how threats disperse and follow
      </p>
    </div>
  );
};
