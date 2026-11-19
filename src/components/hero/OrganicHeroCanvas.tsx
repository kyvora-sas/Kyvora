"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface OrganicHeroCanvasProps {
  className?: string;
}

interface FlowParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSpeed: number;
  size: number;
  alpha: number;
  phase: number;
  color: string;
  history: Array<{ x: number; y: number }>;
}

const PARTICLE_PALETTE = [
  { r: 22, g: 119, b: 255 },  // #1677FF — Electric Blue
  { r: 43, g: 133, b: 255 },  // #2B85FF — Vivid Brand Blue
  { r: 92, g: 168, b: 255 },  // #5CA8FF — Cyan Light Accent
  { r: 175, g: 196, b: 232 }, // #AFC4E8 — Ice White Accent
];

export default function OrganicHeroCanvas({ className = "" }: OrganicHeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let startTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isIntersecting = true;
    let lastTime = performance.now();
    let globalTime = 0;

    // Proximidad de cursor con interpolación suave (lerp)
    const pointer = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    // Detección de dispositivo táctil para foco autónomo
    const isTouchDevice =
      typeof window !== "undefined" &&
      (window.matchMedia("(hover: none)").matches || navigator.maxTouchPoints > 0);

    let particles: FlowParticle[] = [];

    const initParticles = () => {
      const isMobile = width < 768;
      // 12 partículas en móvil para reducir trabajo en GPU; 38 en escritorio
      const count = isMobile ? 12 : 38;
      particles = [];

      for (let i = 0; i < count; i++) {
        const colorDef = PARTICLE_PALETTE[Math.floor(Math.random() * PARTICLE_PALETTE.length)];
        const color = `rgba(${colorDef.r}, ${colorDef.g}, ${colorDef.b},`;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          baseSpeed: 0.35 + Math.random() * 0.45,
          size: 1.2 + Math.random() * 1.8,
          alpha: 0.25 + Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
          color,
          history: [],
        });
      }
    };

    const drawStaticBackground = () => {
      ctx.clearRect(0, 0, width, height);
      const radGrad = ctx.createRadialGradient(
        width * 0.65,
        height * 0.45,
        0,
        width * 0.65,
        height * 0.45,
        Math.max(width, height) * 0.55
      );
      radGrad.addColorStop(0, "rgba(22, 119, 255, 0.12)");
      radGrad.addColorStop(0.5, "rgba(13, 18, 29, 0.04)");
      radGrad.addColorStop(1, "rgba(8, 11, 18, 0)");

      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initParticles();

      // Render inicial de fondo inmediato para evitar destellos
      drawStaticBackground();
    };

    // Eventos de cursor contenidos en el hero (solo si no es dispositivo táctil)
    const handlePointerMove = (e: MouseEvent) => {
      if (isTouchDevice) return;
      const rect = container.getBoundingClientRect();
      pointer.targetX = e.clientX - rect.left;
      pointer.targetY = e.clientY - rect.top;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      pointer.targetX = -1000;
      pointer.targetY = -1000;
    };

    if (!isTouchDevice) {
      container.addEventListener("mousemove", handlePointerMove, { passive: true });
      container.addEventListener("mouseleave", handlePointerLeave, { passive: true });
    }

    // Render loop con delta time y control de FPS adaptativo
    const render = (timestamp: number) => {
      if (!isIntersecting || prefersReduced || (typeof document !== "undefined" && document.hidden)) {
        return;
      }

      const isMobile = width < 768;

      const delta = Math.min((timestamp - lastTime) / 1000, 0.08);
      lastTime = timestamp;
      globalTime += delta;

      // Suavizado del puntero (lerp)
      if (pointer.active) {
        pointer.x += (pointer.targetX - pointer.x) * 0.08;
        pointer.y += (pointer.targetY - pointer.y) * 0.08;
      } else {
        pointer.x += (-1000 - pointer.x) * 0.08;
        pointer.y += (-1000 - pointer.y) * 0.08;
      }

      // Foco dinámico autónomo (especialmente enriquecedor en móviles)
      const focalX = isTouchDevice || !pointer.active
        ? width * 0.62 + Math.sin(globalTime * 0.35) * (width * 0.08)
        : pointer.x;
      const focalY = isTouchDevice || !pointer.active
        ? height * 0.48 + Math.cos(globalTime * 0.28) * (height * 0.08)
        : pointer.y;

      ctx.clearRect(0, 0, width, height);

      // 1. Resplandor volumétrico de respiración orgánica
      const breathAlpha = 0.09 + Math.sin(globalTime * 0.8) * 0.025;
      const radGrad = ctx.createRadialGradient(
        width * 0.65,
        height * 0.45,
        0,
        width * 0.65,
        height * 0.45,
        Math.max(width, height) * 0.58
      );
      radGrad.addColorStop(0, `rgba(22, 119, 255, ${breathAlpha})`);
      radGrad.addColorStop(0.45, `rgba(43, 133, 255, ${breathAlpha * 0.35})`);
      radGrad.addColorStop(0.85, "rgba(8, 11, 18, 0.02)");
      radGrad.addColorStop(1, "rgba(8, 11, 18, 0)");

      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Ondas y filamentos fluidos armónicos (1 en móvil, 3 en escritorio)
      ctx.save();
      const waveCount = isMobile ? 1 : 3;
      for (let w = 0; w < waveCount; w++) {
        const waveOffset = w * 0.85;
        const speed = 0.25 + w * 0.1;
        const waveY = height * (0.35 + w * 0.18);
        const amp = 24 + w * 8;

        ctx.beginPath();
        const step = isMobile ? 32 : 16;
        for (let x = -20; x <= width + 20; x += step) {
          const normX = x / width;
          const y =
            waveY +
            Math.sin(normX * 4.2 + globalTime * speed + waveOffset) * amp +
            Math.cos(normX * 7.5 - globalTime * (speed * 0.7)) * (amp * 0.45);

          if (x === -20) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        const waveAlpha = (0.045 + Math.sin(globalTime * 0.6 + w) * 0.018).toFixed(3);
        ctx.strokeStyle = `rgba(92, 168, 255, ${waveAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();

      // 3. Enlaces de proximidad: activos en escritorio/tablet; omitidos en móvil para ahorrar CPU
      if (!isMobile) {
        const maxDistance = 75;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.hypot(dx, dy);

            if (dist < maxDistance) {
              const lineAlpha = (1 - dist / maxDistance) * 0.14;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(43, 133, 255, ${lineAlpha.toFixed(3)})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }
      }

      // 4. Actualización y renderizado de partículas
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Campo de flujo trigonométrico suave
        const flowAngle =
          Math.sin(p.x * 0.0022 + globalTime * 0.3) *
          Math.cos(p.y * 0.0022 + globalTime * 0.22) *
          Math.PI * 1.6;

        p.vx += Math.cos(flowAngle) * 0.12 * p.baseSpeed;
        p.vy += Math.sin(flowAngle) * 0.12 * p.baseSpeed;

        // Influencia suave por foco / cursor
        const fdx = p.x - focalX;
        const fdy = p.y - focalY;
        const fDist = Math.hypot(fdx, fdy);
        const influenceRadius = isTouchDevice ? 110 : 160;

        if (fDist < influenceRadius && fDist > 4) {
          const force = (1 - fDist / influenceRadius) * 0.45;
          p.vx += (fdx / fDist) * force + (-fdy / fDist) * (force * 0.6);
          p.vy += (fdy / fDist) * force + (fdx / fDist) * (force * 0.6);
        }

        // Amortiguación de velocidad
        p.vx *= 0.94;
        p.vy *= 0.94;

        p.x += p.vx * (delta * 60);
        p.y += p.vy * (delta * 60);

        // Envoltura toroidal suave en bordes
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Respiración de luminosidad y radio
        const currentAlpha = p.alpha * (0.75 + 0.25 * Math.sin(globalTime * 1.4 + p.phase));
        const currentSize = p.size * (0.85 + 0.15 * Math.sin(globalTime * 1.8 + p.phase));

        // Trazado de micro-estela en escritorio (omitido en móvil para aligerar trazados)
        if (!isMobile) {
          p.history.push({ x: p.x, y: p.y });
          if (p.history.length > 5) p.history.shift();

          if (p.history.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.history[0].x, p.history[0].y);
            for (let h = 1; h < p.history.length; h++) {
              ctx.lineTo(p.history[h].x, p.history[h].y);
            }
            ctx.strokeStyle = `${p.color} ${(currentAlpha * 0.35).toFixed(3)})`;
            ctx.lineWidth = currentSize * 0.6;
            ctx.stroke();
          }
        }

        // Núcleo de la partícula
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${currentAlpha.toFixed(3)})`;
        ctx.fill();

        // Resplandor exterior sutil
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${(currentAlpha * 0.2).toFixed(3)})`;
        ctx.fill();
      }

      scheduleNextFrame();
    };

    // Detención total y limpia del ciclo de animación (previene fugas y bucles duplicados)
    const stopLoop = () => {
      if (startTimeoutId !== null) {
        clearTimeout(startTimeoutId);
        startTimeoutId = null;
      }
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    // Programación determinista del siguiente cuadro: cancela cualquier tarea previa antes de encolar
    const scheduleNextFrame = (delayMs?: number) => {
      stopLoop();
      if (prefersReduced || !isIntersecting || (typeof document !== "undefined" && document.hidden)) {
        return;
      }
      const isMobile = width < 768;
      const delay = delayMs ?? (isMobile ? 33 : 0);

      if (delay > 0) {
        startTimeoutId = setTimeout(() => {
          animationFrameId = requestAnimationFrame(render);
        }, delay);
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Observer de visibilidad de sección: pausa cuando sale del viewport y reanuda al entrar
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const wasIntersecting = isIntersecting;
        isIntersecting = Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.05);

        if (isIntersecting && !wasIntersecting) {
          lastTime = performance.now();
          scheduleNextFrame();
        } else if (!isIntersecting) {
          stopLoop();
        }
      },
      { threshold: [0, 0.05, 0.2] }
    );

    intersectionObserver.observe(container);

    // Pausar en pestaña oculta y reanudar solo si el hero sigue visible en pantalla
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else if (isIntersecting) {
        lastTime = performance.now();
        scheduleNextFrame();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Inicialización y ResizeObserver
    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    // Inicio diferido (800ms en móvil para desahogar la hidratación y LCP; 150ms en escritorio)
    if (!prefersReduced) {
      const isMobile = width < 768;
      scheduleNextFrame(isMobile ? 800 : 150);
    }

    return () => {
      stopLoop();
      if (!isTouchDevice) {
        container.removeEventListener("mousemove", handlePointerMove);
        container.removeEventListener("mouseleave", handlePointerLeave);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [prefersReduced]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
}
