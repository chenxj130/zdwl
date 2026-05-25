import React, { useRef, useEffect } from "react";
import styles from "./PlasmaText.module.css";

interface PlasmaTextProps {
  children: React.ReactNode;
  glowColor?: "red" | "blue" | "purple";
}

const PlasmaText: React.FC<PlasmaTextProps> = ({ children, glowColor = "red" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const maxParticles = 30; // Local optimized cap to guarantee 0% lag

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
      speedX: 0,
      speedY: 0,
      lastX: 0,
      lastY: 0
    };

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width + 24;
      const height = rect.height + 16;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      gravityStrength: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        // Disperse velocities
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.9 + 0.3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.size = Math.random() * 1.6 + 0.7;

        let colors: string[] = [];
        if (glowColor === "red") {
          colors = [
            "rgba(255, 255, 255, ",
            "rgba(255, 59, 48, ",
            "rgba(255, 120, 110, ",
            "rgba(155, 81, 224, "
          ];
        } else if (glowColor === "blue") {
          colors = [
            "rgba(255, 255, 255, ",
            "rgba(41, 151, 255, ",
            "rgba(120, 200, 255, ",
            "rgba(168, 85, 247, "
          ];
        } else {
          colors = [
            "rgba(255, 255, 255, ",
            "rgba(168, 85, 247, ",
            "rgba(200, 150, 255, ",
            "rgba(255, 59, 48, "
          ];
        }

        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 1.0;
        this.decay = Math.random() * 0.025 + 0.015;
        this.gravityStrength = Math.random() * 0.07 + 0.025;
      }

      update() {
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Gravitation towards mouse (聚)
          if (dist > 3 && dist < 120) {
            this.vx += (dx / dist) * this.gravityStrength;
            this.vy += (dy / dist) * this.gravityStrength;
          }
        }

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.91;
        this.vy *= 0.91;

        // Thermal plasma fluctuations
        this.vx += (Math.random() - 0.5) * 0.15;
        this.vy += (Math.random() - 0.5) * 0.15;

        this.alpha -= this.decay;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = this.color + this.alpha + ")";

        c.shadowColor = glowColor === "red"
          ? "#ff3b30"
          : glowColor === "blue"
          ? "#2997ff"
          : "#a855f7";
        c.shadowBlur = this.size * 3;

        c.fill();
        c.restore();
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;

      mouse.speedX = newX - mouse.lastX;
      mouse.speedY = newY - mouse.lastY;
      mouse.x = newX;
      mouse.y = newY;
      mouse.lastX = newX;
      mouse.lastY = newY;
      mouse.active = true;

      const speed = Math.sqrt(mouse.speedX * mouse.speedX + mouse.speedY * mouse.speedY);
      const spawnCount = Math.min(Math.floor(speed * 0.4) + 1, 3);

      for (let i = 0; i < spawnCount; i++) {
        if (particles.length < maxParticles) {
          const px = newX + (Math.random() - 0.5) * 6;
          const py = newY + (Math.random() - 0.5) * 6;
          particles.push(new Particle(px, py));
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const newX = touch.clientX - rect.left;
      const newY = touch.clientY - rect.top;

      mouse.speedX = newX - mouse.lastX;
      mouse.speedY = newY - mouse.lastY;
      mouse.x = newX;
      mouse.y = newY;
      mouse.lastX = newX;
      mouse.lastY = newY;
      mouse.active = true;

      const speed = Math.sqrt(mouse.speedX * mouse.speedX + mouse.speedY * mouse.speedY);
      const spawnCount = Math.min(Math.floor(speed * 0.4) + 1, 3);

      for (let i = 0; i < spawnCount; i++) {
        if (particles.length < maxParticles) {
          const px = newX + (Math.random() - 0.5) * 6;
          const py = newY + (Math.random() - 0.5) * 6;
          particles.push(new Particle(px, py));
        }
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleMouseEnter = () => {
      mouse.active = true;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchstart", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleMouseLeave, { passive: true });

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width + 24, rect.height + 16);
      ctx.globalCompositeOperation = "screen";

      // Draw electronic filament connective lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 24) {
            const opacity = (1 - dist / 24) * 0.2 * Math.min(particles[i].alpha, particles[j].alpha);
            ctx.strokeStyle = glowColor === "red"
              ? `rgba(255, 59, 48, ${opacity})`
              : glowColor === "blue"
              ? `rgba(41, 151, 255, ${opacity})`
              : `rgba(168, 85, 247, ${opacity})`;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles = particles.filter((p) => p.alpha > 0);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      // Passive micro-spawns to sustain field when stationary
      if (mouse.active && Math.random() < 0.25 && particles.length < maxParticles) {
        particles.push(
          new Particle(
            mouse.x + (Math.random() - 0.5) * 6,
            mouse.y + (Math.random() - 0.5) * 6
          )
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchstart", handleTouchMove);
      container.removeEventListener("touchend", handleMouseLeave);
    };
  }, [glowColor]);

  return (
    <span ref={containerRef} className={styles.plasmaTextContainer}>
      <span className={styles.textWrapper}>{children}</span>
      <canvas ref={canvasRef} className={styles.plasmaCanvas} />
    </span>
  );
};

export default PlasmaText;
