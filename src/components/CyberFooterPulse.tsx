import { useEffect, useRef } from "react";

export const CyberFooterPulse = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const drawGrid = () => {
      const spacing = 25;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;

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
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid();

      // Add blip every few frames
      if (Math.random() < 0.05) {
        createBlip();
      }

      // Draw blips
      blips.forEach((blip, index) => {
        ctx.beginPath();
        ctx.arc(blip.x, blip.y, blip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 128, ${blip.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        blip.radius += 1;
        blip.alpha -= 0.015;

        if (blip.alpha <= 0) {
          blips.splice(index, 1);
        }
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "160px",
        display: "block",
        backgroundColor: "#000",
        borderTop: "1px solid #1f1f1f",
      }}
    />
  );
};
