"use client";

import { useEffect, useRef } from "react";

export default function TopographicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      };
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    let time = 0;
    const draw = () => {
      time += 0.003;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const mouseX = mouse.current.x * width;
      const mouseY = mouse.current.y * height;

      for (let index = 0; index < 18; index += 1) {
        const progress = index / 18;
        const baseY = height * (0.2 + progress * 0.7);
        const amplitude = 30 + index * 8;
        const frequency = 0.004 + progress * 0.002;
        const phase = time + index * 0.4;
        const distortX = (mouseX - width / 2) * 0.04;
        const distortY = (mouseY - height / 2) * 0.02;

        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= width; x += 4) {
          const y = baseY + Math.sin(x * frequency + phase) * amplitude + Math.sin(x * frequency * 2.1 + phase * 1.3 + distortX * 0.01) * (amplitude * 0.4) + distortY * (1 - progress);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(123, 198, 53, ${0.07 + progress * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}
