import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

export const CyberFooterPulse = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const drawGrid = (color: string) => {
      const spacing = 30;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.8;

      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const blips: { x: number; y: number; radius: number; alpha: number }[] = [];

    const createBlip = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      blips.push({ x, y, radius: 0, alpha: 1 });
    };

    const animate = () => {
      // Theme-based background
      ctx.fillStyle = theme === "dark" ? "#090909" : "#f8f8f8";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid color (subtle)
      const gridColor = theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)";
      drawGrid(gridColor);

      // Occasionally create a new blip
      if (Math.random() < 0.06) createBlip();

      // Draw and fade blips
      blips.forEach((blip, index) => {
        ctx.beginPath();
        ctx.arc(blip.x, blip.y, blip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 140, ${blip.alpha})`; // cyber green
        ctx.lineWidth = 1.2;
        ctx.stroke();

        blip.radius += 1.2;
        blip.alpha -= 0.012;

        if (blip.alpha <= 0) blips.splice(index, 1);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-40 border-t border-border"
      style={{
        display: "block",
        transition: "background-color 0.4s ease",
      }}
    />
  );
};
