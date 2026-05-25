import React, { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";
import ThemeToggle from "../theme-toggle/ThemeToggle";

interface NavbarProps {
  brandName?: string;
  theme: "light" | "dark";
  toggleTheme: () => void;
  hasSwitcher?: boolean;
}

/**
 * NOTE: 使用 IntersectionObserver 监听页面中 4 个全屏 section 的可视状态，
 * 「创始人」链接指向 advantages section 内部的卡片锚点，高亮跟随 advantages section。
 */
const SECTION_IDS = ["hero", "company-profile", "showcase", "advantages", "footer"];

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, hasSwitcher }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // IntersectionObserver: 追踪当前进入视口的 section
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue("--nav-height").trim() || "48px"} 0px -40% 0px`,
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const maxParticles = 50;

    // Track mouse coordinates & speed
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
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

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

        // Dispersion velocities
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.size = Math.random() * 2 + 1;

        // Neon plasma color palettes
        const colors = [
          "rgba(255, 255, 255, ", // Bright white core
          "rgba(255, 59, 48, ",   // Brand accent red
          "rgba(41, 151, 255, ",  // Electric blue
          "rgba(155, 81, 224, "   // Electric purple
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.gravityStrength = Math.random() * 0.04 + 0.015;
      }

      update() {
        // Gathering effect (gravitate to cursor if active)
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 3) {
            this.vx += (dx / dist) * this.gravityStrength;
            this.vy += (dy / dist) * this.gravityStrength;
          }
        }

        // Apply friction & update position
        this.x += this.vx;
        this.y += this.vy;
        
        this.vx *= 0.93;
        this.vy *= 0.93;

        // Thermal jitter/random dispersion
        this.vx += (Math.random() - 0.5) * 0.2;
        this.vy += (Math.random() - 0.5) * 0.2;

        this.alpha -= this.decay;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = this.color + this.alpha + ")";
        
        // High intensity neon glow
        c.shadowColor = this.color.includes("255, 59, 48") ? "#ff3b30" : "#2997ff";
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

      // Spawn particles based on velocity (disperse)
      const speed = Math.sqrt(mouse.speedX * mouse.speedX + mouse.speedY * mouse.speedY);
      const spawnCount = Math.min(Math.floor(speed * 0.6) + 1, 4);
      for (let i = 0; i < spawnCount; i++) {
        if (particles.length < maxParticles) {
          const px = newX + (Math.random() - 0.5) * 4;
          const py = newY + (Math.random() - 0.5) * 4;
          particles.push(new Particle(px, py));
        }
      }
    };

    const handleMouseEnter = () => {
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.globalCompositeOperation = "screen";

      // Draw thin energy arcs (connecting nearby plasma particles)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 26) {
            const opacity = (1 - dist / 26) * 0.28 * Math.min(particles[i].alpha, particles[j].alpha);
            ctx.strokeStyle = particles[i].color.includes("255, 59, 48") 
              ? `rgba(255, 59, 48, ${opacity})`
              : `rgba(41, 151, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & render particles
      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      // Passive micro-spawns to sustain plasma field when stationary
      if (mouse.active && Math.random() < 0.25 && particles.length < maxParticles) {
        particles.push(new Particle(
          mouse.x + (Math.random() - 0.5) * 8,
          mouse.y + (Math.random() - 0.5) * 8
        ));
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <nav className={`${styles.navContainer} ${hasSwitcher ? styles.hasSwitcher : ""}`}>
      <div className={styles.navContent}>
        {/* Scrolling text logo with custom plasma canvas cursor effect */}
        <a href="#" className={styles.logoLink} onClick={handleLinkClick}>
          <div className={styles.scrollingLogoContainer}>
            <div className={styles.scrollingTextWrapper}>
              <div className={styles.scrollingText}>
                <span className={styles.scrollSpan}>每日智鼎 味来无限</span>
                <span className={styles.scrollSpan}>每日智鼎 味来无限</span>
              </div>
            </div>
            <canvas ref={canvasRef} className={styles.plasmaCanvas} />
          </div>
        </a>

        {/* Desktop Links — 活跃 section 自动高亮 */}
        <ul className={styles.linksList}>
          {[
            { id: "hero", label: "首页", activeMatch: "hero" },
            { id: "company-profile", label: "公司简介", activeMatch: "company-profile" },
            { id: "showcase", label: "产品系列", activeMatch: "showcase" },
            { id: "advantages", label: "核心优势", activeMatch: "advantages" },
            { id: "founder", label: "创始人", activeMatch: "advantages" },
            { id: "footer", label: "联系我们", activeMatch: "footer" },
          ].map((link) => (
            <li key={link.id} className={styles.linkItem}>
              <a
                href={`#${link.id}`}
                className={activeSection === link.activeMatch ? styles.linkActive : ""}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions (Theme Toggle + Hamburger) */}
        <div className={styles.actions}>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          
          <button 
            className={styles.menuButton} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer — 活跃 section 自动高亮 */}
      <div className={`${styles.mobileDrawer} ${isMenuOpen ? styles.mobileDrawerOpen : ""}`}>
        <ul className={styles.mobileLinks}>
          {[
            { id: "hero", label: "首页", activeMatch: "hero" },
            { id: "company-profile", label: "公司简介", activeMatch: "company-profile" },
            { id: "showcase", label: "产品系列", activeMatch: "showcase" },
            { id: "advantages", label: "核心优势", activeMatch: "advantages" },
            { id: "founder", label: "创始人", activeMatch: "advantages" },
            { id: "footer", label: "联系我们", activeMatch: "footer" },
          ].map((link) => (
            <li key={link.id} className={styles.mobileLinkItem}>
              <a
                href={`#${link.id}`}
                onClick={handleLinkClick}
                className={activeSection === link.activeMatch ? styles.linkActive : ""}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
