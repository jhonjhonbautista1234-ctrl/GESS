"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

export default function AdminBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const crosshairs = [
      { x: 0.08, y: 0.14, phase: 0, size: 14 }, { x: 0.82, y: 0.09, phase: 1.2, size: 10 },
      { x: 0.55, y: 0.72, phase: 2.4, size: 16 }, { x: 0.18, y: 0.62, phase: 0.7, size: 12 },
      { x: 0.93, y: 0.55, phase: 3.1, size: 10 }, { x: 0.38, y: 0.38, phase: 1.8, size: 8 },
      { x: 0.7, y: 0.88, phase: 0.4, size: 13 },
    ];
    const tin: Point[] = [
      { x: 0.08, y: 0.14 }, { x: 0.82, y: 0.09 }, { x: 0.55, y: 0.72 }, { x: 0.18, y: 0.62 },
      { x: 0.93, y: 0.55 }, { x: 0.38, y: 0.38 }, { x: 0.7, y: 0.88 }, { x: 0.25, y: 0.9 },
      { x: 0.65, y: 0.22 }, { x: 0.46, y: 0.55 }, { x: 0.9, y: 0.78 }, { x: 0.12, y: 0.42 },
    ];
    const edges: Array<[number, number]> = [];
    tin.forEach((point, i) => tin.slice(i + 1).forEach((other, offset) => {
      const distance = Math.hypot(point.x - other.x, point.y - other.y);
      if (distance < 0.32) edges.push([i, i + offset + 1]);
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let frame = 0;
    let time = 0;
    const draw = () => {
      time += 0.0028;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const hills = [
        { x: width * (0.3 + 0.12 * Math.sin(time * 0.22)), y: height * (0.38 + 0.1 * Math.cos(time * 0.17)) },
        { x: width * (0.68 + 0.08 * Math.cos(time * 0.19)), y: height * (0.55 + 0.12 * Math.sin(time * 0.24)) },
      ];
      for (let contour = 0; contour < 20; contour += 1) {
        const alpha = 0.03 + (contour / 20) * 0.055;
        const baseRadius = Math.min(width, height) * (0.05 + contour * 0.028);
        const mix = 0.5 + 0.5 * Math.sin(time * 0.13 + contour * 0.3);
        const centerX = hills[0].x * mix + hills[1].x * (1 - mix);
        const centerY = hills[0].y * mix + hills[1].y * (1 - mix);
        ctx.beginPath();
        for (let step = 0; step <= 200; step += 1) {
          const angle = (step / 200) * Math.PI * 2;
          const radius = baseRadius * (0.5 + 0.28 * Math.sin(angle * 3 + time * 0.55 + contour * 0.2) + 0.12 * Math.sin(angle * 7 - time * 0.38) + 0.09 * Math.sin(angle * 11 + time * 0.25 + contour * 0.4));
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          if (step === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(123,198,53,${alpha})`;
        ctx.lineWidth = contour % 5 === 0 ? 1.1 : 0.65;
        ctx.stroke();
        if (contour % 5 === 0 && contour > 0) {
          const labelAngle = time * 0.4 + contour * 0.9;
          ctx.font = "7px 'Space Grotesk', monospace";
          ctx.fillStyle = `rgba(123,198,53,${alpha * 1.8})`;
          ctx.fillText(`${100 + contour * 20}m`, centerX + Math.cos(labelAngle) * baseRadius * 0.9, centerY + Math.sin(labelAngle) * baseRadius * 0.9);
        }
      }

      const grid = 72;
      ctx.setLineDash([2, 4]);
      ctx.strokeStyle = "rgba(43,102,54,0.13)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= width; x += grid) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = 0; y <= height; y += grid) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
      ctx.setLineDash([]);
      ctx.font = "7.5px 'Space Grotesk', monospace";
      ctx.fillStyle = "rgba(43,102,54,0.35)";
      for (let x = 1; x * grid < width; x += 1) for (let y = 1; y * grid < height; y += 1) if ((x + y) % 3 === 0) ctx.fillText(`${500000 + x * 50}E`, x * grid + 2, y * grid - 2);

      edges.forEach(([from, to]) => {
        const alpha = 0.055 + 0.03 * Math.sin(time * 1.1 + from * 0.5);
        ctx.beginPath(); ctx.moveTo(tin[from].x * width, tin[from].y * height); ctx.lineTo(tin[to].x * width, tin[to].y * height);
        ctx.strokeStyle = `rgba(123,198,53,${alpha})`; ctx.lineWidth = 0.7; ctx.stroke();
      });
      tin.forEach((point, index) => {
        const pulse = 0.5 + 0.5 * Math.sin(time * 1.8 + index * 0.72);
        const x = point.x * width; const y = point.y * height; const radius = 1.8 + pulse * 1.4;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(123,198,53,${0.18 + pulse * 0.28})`; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, radius + 3, 0, Math.PI * 2); ctx.strokeStyle = `rgba(123,198,53,${0.054 + pulse * 0.084})`; ctx.lineWidth = 0.6; ctx.stroke();
      });

      crosshairs.forEach((crosshair) => {
        const x = crosshair.x * width; const y = crosshair.y * height;
        const pulse = 0.5 + 0.5 * Math.sin(time * 1.4 + crosshair.phase);
        const size = crosshair.size + pulse * 5; const alpha = 0.18 + pulse * 0.28;
        ctx.strokeStyle = `rgba(123,198,53,${alpha})`; ctx.lineWidth = 0.75;
        ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, size * 0.38, 0, Math.PI * 2); ctx.stroke();
        const gap = size * 0.45; const arm = size * 1.55;
        ctx.beginPath(); ctx.moveTo(x - arm, y); ctx.lineTo(x - gap, y); ctx.moveTo(x + gap, y); ctx.lineTo(x + arm, y); ctx.moveTo(x, y - arm); ctx.lineTo(x, y - gap); ctx.moveTo(x, y + gap); ctx.lineTo(x, y + arm); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fillStyle = `rgba(123,198,53,${alpha})`; ctx.fill();
      });

      const originX = width * 0.5; const originY = height * 0.5; const scanRadius = Math.max(width, height) * 0.65; const scanAngle = time * 0.45;
      ctx.beginPath(); ctx.moveTo(originX, originY); ctx.arc(originX, originY, scanRadius, scanAngle - 0.18, scanAngle); ctx.closePath();
      const fan = ctx.createRadialGradient(originX, originY, 0, originX, originY, scanRadius); fan.addColorStop(0, "rgba(123,198,53,0.07)"); fan.addColorStop(1, "rgba(123,198,53,0)"); ctx.fillStyle = fan; ctx.fill();
      ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + Math.cos(scanAngle) * scanRadius, originY + Math.sin(scanAngle) * scanRadius); ctx.strokeStyle = "rgba(123,198,53,0.14)"; ctx.lineWidth = 1; ctx.stroke();

      [{ start: -0.3, span: 2.1, radius: 0.44, phase: 0 }, { start: 1.8, span: 1.6, radius: 0.6, phase: 1.5 }, { start: 3.4, span: 2.4, radius: 0.38, phase: 3 }].forEach((arc) => {
        const radiusX = width * arc.radius; const radiusY = height * arc.radius * 0.55;
        ctx.beginPath();
        for (let step = 0; step <= 80; step += 1) { const angle = arc.start + (step / 80) * arc.span; const x = originX + Math.cos(angle) * radiusX; const y = originY + Math.sin(angle) * radiusY; if (step === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
        ctx.strokeStyle = "rgba(96,217,188,0.055)"; ctx.lineWidth = 0.8; ctx.setLineDash([4, 6]); ctx.stroke(); ctx.setLineDash([]);
        const satellite = arc.start + ((time * 0.18 + arc.phase) % arc.span); const sx = originX + Math.cos(satellite) * radiusX; const sy = originY + Math.sin(satellite) * radiusY;
        ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, Math.PI * 2); ctx.fillStyle = "rgba(96,217,188,0.55)"; ctx.fill();
      });

      const scanY = ((time * 0.055 * height) % (height + 80)) - 40;
      const scanGradient = ctx.createLinearGradient(0, 0, width, 0); scanGradient.addColorStop(0, "rgba(123,198,53,0)"); scanGradient.addColorStop(0.5, "rgba(123,198,53,0.09)"); scanGradient.addColorStop(1, "rgba(123,198,53,0)");
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(width, scanY); ctx.strokeStyle = scanGradient; ctx.stroke();
      ctx.font = "bold 9px 'Space Grotesk', monospace"; ctx.fillStyle = "rgba(123,198,53,0.28)";
      ctx.fillText(`E ${(500000 + Math.sin(time * 0.3) * 12).toFixed(2)}  N ${(1200000 + Math.cos(time * 0.22) * 8).toFixed(2)}  Z ${(142.4 + Math.sin(time * 0.5) * 0.3).toFixed(2)}m`, 12, height - 10);
      ctx.textAlign = "right"; ctx.fillText("WGS84 · UTM Zone 51N · ITRF2020", width - 12, height - 10); ctx.textAlign = "left";
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}
