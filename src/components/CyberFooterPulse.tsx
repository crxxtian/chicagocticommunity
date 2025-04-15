import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

export const CyberFooterPulse = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const { theme } = useTheme(); // Only using `theme`, not `resolvedTheme`

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    // Draw subtle cyber grid
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
    let bgColor = theme === "dark" ? "#090909" : "#f8f8f8";
    let currentBg = bgColor;

    const createBlip = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      blips.push({ x, y, radius: 0, alpha: 1 });
    };

    const animate = () => {
      // Smooth background transition
      const targetBg = theme === "dark" ? "#090909" : "#f8f8f8";
      currentBg = blendColors(currentBg, targetBg, 0.06);
      ctx.fillStyle = currentBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      const gridColor = theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)";
      drawGrid(gridColor);

      // Occasionally add a blip
      if (Math.random() < 0.06) createBlip();

      // Draw blips
      blips.forEach((blip, index) => {
        ctx.beginPath();
        ctx.arc(blip.x, blip.y, blip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 140, ${blip.alpha})`;
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

// Helper: blend two hex colors
function blendColors(color1: string, color2: string, alpha: number): string {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);

  const r = Math.round(r1 + (r2 - r1) * alpha);
  const g = Math.round(g1 + (g2 - g1) * alpha);
  const b = Math.round(b1 + (b2 - b1) * alpha);

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255,
  ];
}
