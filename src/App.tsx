import { useState, useEffect, useRef } from "react";
import gessLogo from "./assets/gess-logo.jpg";

/* ── Types ─────────────────────────────────────────────── */
interface DropdownItem { label: string; href: string; }
interface NavItem { label: string; href: string; dropdown?: DropdownItem[]; }

/* ── Nav config ─────────────────────────────────────────── */
const NAV: NavItem[] = [
  { label: "Home", href: "#hero" },
  {
    label: "About Us",
    href: "#about",
    dropdown: [
      { label: "Our Story & Mission", href: "#about-story" },
      { label: "Executive Board & Committees", href: "#about-identity" },
      { label: "Constitution & By-Laws", href: "#about" },
    ],
  },
  {
    label: "Academics & Resources",
    href: "#pillars",
    dropdown: [
      { label: "Technical Workshops (GIS, Surveying, Data Science)", href: "#geospatial-mastery" },
      { label: "Board Exam Prep Hub", href: "#professional-development" },
      { label: "Equipment Guides & Manuals", href: "#field-competence" },
    ],
  },
  {
    label: "Events & News",
    href: "#events",
    dropdown: [
      { label: "Upcoming Webinars & Seminars", href: "#workshops" },
      { label: "National Competitions & Summits", href: "#summits" },
      { label: "Community Outreach Archives", href: "#outreach" },
    ],
  },
  { label: "Gallery & Projects", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

/* ── Crosshair SVG ──────────────────────────────────────── */
function CrosshairIcon({ size = 24, opacity = 0.4 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <circle cx="12" cy="12" r="9" stroke="#7BC635" strokeWidth="0.8" />
      <circle cx="12" cy="12" r="2" stroke="#7BC635" strokeWidth="0.8" />
      <line x1="12" y1="1" x2="12" y2="6" stroke="#7BC635" strokeWidth="0.8" />
      <line x1="12" y1="18" x2="12" y2="23" stroke="#7BC635" strokeWidth="0.8" />
      <line x1="1" y1="12" x2="6" y2="12" stroke="#7BC635" strokeWidth="0.8" />
      <line x1="18" y1="12" x2="23" y2="12" stroke="#7BC635" strokeWidth="0.8" />
    </svg>
  );
}

/* ── Toporaphic SVG wave divider ────────────────────────── */
function TopoWave({ flip = false }: { flip?: boolean }) {
  return (
    <div style={{ transform: flip ? "scaleY(-1)" : undefined, lineHeight: 0 }}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#0D2E14" />
        <path d="M0,55 C200,20 440,70 720,50 C1000,30 1240,65 1440,55 L1440,80 L0,80 Z" fill="#0D2E14" opacity="0.5" />
      </svg>
    </div>
  );
}

/* ── Interactive topo canvas hero bg ────────────────────── */
function TopoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const frame = useRef(0);

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

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    let t = 0;

    const draw = () => {
      t += 0.003;
      frame.current++;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const mx = mouse.current.x * width;
      const my = mouse.current.y * height;

      for (let i = 0; i < 18; i++) {
        const progress = i / 18;
        const baseY = height * (0.2 + progress * 0.7);
        const amp = 30 + i * 8;
        const freq = 0.004 + progress * 0.002;
        const phase = t + i * 0.4;
        const distortX = (mx - width / 2) * 0.04;
        const distortY = (my - height / 2) * 0.02;

        ctx.beginPath();
        ctx.moveTo(0, baseY);

        for (let x = 0; x <= width; x += 4) {
          const y =
            baseY +
            Math.sin(x * freq + phase) * amp +
            Math.sin(x * freq * 2.1 + phase * 1.3 + distortX * 0.01) * (amp * 0.4) +
            distortY * (1 - progress);
          ctx.lineTo(x, y);
        }

        const alpha = 0.08 + progress * 0.05;
        ctx.strokeStyle = `rgba(123, 198, 53, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

/* ── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const enter = (label: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(label);
  };
  const leave = () => {
    timerRef.current = setTimeout(() => setOpen(null), 120);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
        backgroundColor: scrolled ? "rgba(13, 46, 20, 0.97)" : "rgba(13, 46, 20, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(123,198,53,0.15)" : "1px solid transparent",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", height: 64, justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid rgba(123,198,53,0.6)",
                flexShrink: 0,
                boxShadow: "0 0 12px rgba(123,198,53,0.2)",
              }}
            >
              <img
                src={gessLogo}
                alt="GESS Logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#fff", lineHeight: 1.1 }}>
                GESS
              </div>
              <div style={{ fontSize: 10, color: "rgba(123,198,53,0.8)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Student-led geomatics community
              </div>
            </div>
          </a>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden-mobile">
            {NAV.map((item) => (
              <div
                key={item.label}
                style={{ position: "relative" }}
                onMouseEnter={() => item.dropdown && enter(item.label)}
                onMouseLeave={() => item.dropdown && leave()}
                onFocus={() => item.dropdown && enter(item.label)}
                onBlur={leave}
              >
                <a
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "6px 12px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    color: open === item.label ? "#7BC635" : "rgba(255,255,255,0.85)",
                    fontFamily: "var(--font-display)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#7BC635";
                  }}
                  onMouseLeave={(e) => {
                    if (open !== item.label) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
                  }}
                >
                  {item.label}
                  {item.dropdown && (
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </a>

                {/* Active dot */}
                {open === item.label && (
                  <div style={{ position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)" }}>
                    <CrosshairIcon size={10} opacity={1} />
                  </div>
                )}

                {/* Dropdown */}
                {item.dropdown && open === item.label && (
                  <div
                    className="dropdown-menu"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#0a2410",
                      border: "1px solid rgba(123,198,53,0.2)",
                      borderRadius: 8,
                      padding: "6px",
                      minWidth: 240,
                      boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
                    }}
                  >
                    {item.dropdown.map((d) => (
                      <a
                        key={d.label}
                        href={d.href}
                        onClick={() => setOpen(null)}
                        style={{
                          display: "block",
                          padding: "8px 14px",
                          borderRadius: 5,
                          fontSize: 12.5,
                          color: "rgba(255,255,255,0.75)",
                          textDecoration: "none",
                          transition: "all 0.15s",
                          fontFamily: "var(--font-body)",
                          letterSpacing: "0.01em",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(123,198,53,0.1)";
                          (e.currentTarget as HTMLElement).style.color = "#7BC635";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                          (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
                        }}
                      >
                        {d.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA button */}
          <a
            href="#contact"
            className="hidden-mobile"
            style={{
              padding: "8px 18px",
              borderRadius: 6,
              backgroundColor: "#2B6636",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "var(--font-display)",
              textDecoration: "none",
              border: "1px solid rgba(123,198,53,0.3)",
              transition: "all 0.2s",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#7BC635";
              (e.currentTarget as HTMLElement).style.color = "#0D2E14";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#2B6636";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
          >
            Join GESS
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="show-mobile"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              color: "#fff",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {mobileOpen ? (
                <>
                  <line x1="4" y1="4" x2="18" y2="18" stroke="#7BC635" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="18" y1="4" x2="4" y2="18" stroke="#7BC635" strokeWidth="1.8" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="19" y2="7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="19" y2="12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="3" y1="17" x2="19" y2="17" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{
              borderTop: "1px solid rgba(123,198,53,0.15)",
              paddingBottom: 16,
            }}
          >
            {NAV.map((item) => (
              <div key={item.label} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <a
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    padding: "10px 0",
                    color: "rgba(255,255,255,0.85)",
                    textDecoration: "none",
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </a>
                {item.dropdown?.map((child) => (
                  <a
                    key={child.label}
                    href={child.href}
                    onClick={() => setMobileOpen(false)}
                    style={{ display: "block", padding: "7px 0 7px 16px", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 12 }}
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#0D2E14",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <TopoCanvas />

      {/* Decorative crosshairs */}
      <div style={{ position: "absolute", top: 120, left: 40, opacity: 0.25 }}>
        <CrosshairIcon size={48} opacity={1} />
      </div>
      <div style={{ position: "absolute", bottom: 120, right: 60, opacity: 0.2 }}>
        <CrosshairIcon size={64} opacity={1} />
      </div>
      <div style={{ position: "absolute", top: "40%", right: "15%", opacity: 0.15 }}>
        <CrosshairIcon size={80} opacity={1} />
      </div>

      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(43,102,54,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(43,102,54,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 64, alignItems: "center" }}>
          <div>
            {/* Tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 14px",
                borderRadius: 100,
                border: "1px solid rgba(123,198,53,0.3)",
                marginBottom: 28,
                backgroundColor: "rgba(123,198,53,0.08)",
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#7BC635" }} />
              <span style={{ fontSize: 11, color: "#7BC635", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Geodetic Engineering Students Society
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5.5vw, 72px)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.08,
                marginBottom: 24,
                letterSpacing: "-0.02em",
              }}
            >
              Precision in{" "}
              <span style={{ color: "#7BC635" }}>Every</span>
              <br />
              Dimension.
              <br />
              Excellence in{" "}
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(123,198,53,0.6)",
                }}
              >
                Every Map.
              </span>
            </h1>

            <p
              style={{
                fontSize: "clamp(15px, 1.6vw, 18px)",
                color: "rgba(255,255,255,0.65)",
                fontFamily: "var(--font-body)",
                lineHeight: 1.7,
                maxWidth: 540,
                marginBottom: 40,
              }}
            >
              Empowering the next generation of spatial data scientists and geodetic engineers
              to measure the earth and model the future.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a
                href="#contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 28px",
                  borderRadius: 7,
                  backgroundColor: "#2B6636",
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: "none",
                  border: "1px solid rgba(123,198,53,0.3)",
                  transition: "all 0.25s",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#7BC635";
                  (e.currentTarget as HTMLElement).style.color = "#0D2E14";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(123,198,53,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#2B6636";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                Join Our Society
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#pillars"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 28px",
                  borderRadius: 7,
                  backgroundColor: "transparent",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.2)",
                  transition: "all 0.25s",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,198,53,0.5)";
                  (e.currentTarget as HTMLElement).style.color = "#7BC635";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                Explore Our Projects
              </a>
            </div>

            {/* Stats bar */}
            <div
              style={{
                display: "flex",
                gap: 40,
                marginTop: 56,
                paddingTop: 32,
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {[
                { value: "126+", label: "Active Members" },
                { value: "13+", label: "Years of Excellence" },
                { value: "30+", label: "Projects Completed" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "#7BC635" }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2, letterSpacing: "0.05em" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero logo */}
          <div
            className="hero-logo-wrap"
            style={{
              position: "relative",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 280,
                height: 280,
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid rgba(123,198,53,0.4)",
                boxShadow: "0 0 60px rgba(43,102,54,0.4), 0 0 120px rgba(43,102,54,0.2)",
                position: "relative",
              }}
            >
              <img
                src={gessLogo}
                alt="Geodetic Engineering Students Society Logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {/* Orbit ring */}
            <div
              style={{
                position: "absolute",
                inset: -20,
                borderRadius: "50%",
                border: "1px dashed rgba(123,198,53,0.2)",
                animation: "spin 20s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: -40,
                borderRadius: "50%",
                border: "1px dashed rgba(43,102,54,0.15)",
                animation: "spin 30s linear infinite reverse",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          background: "linear-gradient(transparent, #0D2E14)",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .hero-logo-wrap { display: none !important; }
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 901px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </section>
  );
}

/* ── About ───────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" style={{ backgroundColor: "#0D2E14", paddingBottom: 0 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* Left — text */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <CrosshairIcon size={18} opacity={0.8} />
              <span style={{ fontSize: 11, color: "#7BC635", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Who We Are
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.5vw, 46px)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: 24,
              }}
            >
              The Central Hub for{" "}
              <span style={{ color: "#7BC635" }}>Geomatics</span> Professionals
            </h2>
            <p id="about-story"
              style={{
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.8,
                fontSize: 15,
                fontFamily: "var(--font-body)",
                marginBottom: 20,
              }}
            >
              The Geodetic Engineering Students Society (GESS) unites students passionate about measuring, mapping, and managing the physical world using cutting-edge spatial technologies. By blending theoretical principles with hands-on field experience, we prepare our members to tackle global challenges—from urban planning and climate resilience to advanced satellite data analysis.
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.8,
                fontSize: 15,
                fontFamily: "var(--font-body)",
              }}
            >
              We believe that engineering extends beyond technical precision; it requires a deep commitment to ethical practice and community advancement. GESS serves as a platform where students develop leadership capabilities, network with industry veterans, and collaborate on projects that create real-world impact.
            </p>

            <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
              {["GIS", "Remote Sensing", "GNSS", "Photogrammetry", "Hydrographic Survey"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 4,
                    border: "1px solid rgba(123,198,53,0.25)",
                    fontSize: 11.5,
                    color: "#7BC635",
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    backgroundColor: "rgba(123,198,53,0.06)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — logo symbolism cards */}
          <div id="about-identity" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                icon: "⊕",
                title: "The Crosshairs & Target",
                desc: "Symbolizes our commitment to mathematical precision, accurate data acquisition, and absolute focus on engineering excellence.",
              },
              {
                icon: "👤",
                title: "The Surveyors",
                desc: "Represents the hands-on, field-ready nature of our members—mastering total stations, GNSS receivers, and modern geomatics tools.",
              },
              {
                icon: "〰",
                title: "The Topographic Layers",
                desc: "Mirrors the physical landscape we measure and analyze, bridging natural geography with digital spatial systems.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "18px 22px",
                  borderRadius: 10,
                  border: "1px solid rgba(123,198,53,0.15)",
                  backgroundColor: "rgba(43,102,54,0.15)",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  transition: "border-color 0.2s, background-color 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,198,53,0.4)";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(43,102,54,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,198,53,0.15)";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(43,102,54,0.15)";
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: "rgba(123,198,53,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "#fff", marginBottom: 5 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TopoWave />
    </section>
  );
}

/* ── Pillars ─────────────────────────────────────────────── */
function Pillars() {
  const pillars = [
    {
      number: "01",
      title: "Geospatial Mastery",
      desc: "Training our members in the tools that define modern geography, including Geographic Information Systems (GIS), Remote Sensing, Global Navigation Satellite Systems (GNSS), and photogrammetry.",
      tags: ["GIS", "Remote Sensing", "GNSS"],
    },
    {
      number: "02",
      title: "Field Competence",
      desc: "Mastering traditional and cutting-edge surveying instrumentation. We emphasize hands-on fieldwork, hydrographic surveying techniques, and cadastral data management.",
      tags: ["Total Station", "Hydrographic", "Cadastral"],
    },
    {
      number: "03",
      title: "Data Science Integration",
      desc: "Bridging the gap between physical measurement and digital analysis. Our members learn to leverage spatial data science, programming languages, and cloud-based mapping platforms.",
      tags: ["Python", "Cloud Mapping", "Spatial Analysis"],
    },
    {
      number: "04",
      title: "Professional Development",
      desc: "Connecting students directly to the industry through career fairs, alumni mentorship panels, board exam preparation groups, and corporate networking events.",
      tags: ["Board Exam Prep", "Mentorship", "Networking"],
    },
  ];

  return (
    <section id="pillars" style={{ backgroundColor: "#F4F9F5", padding: "96px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <CrosshairIcon size={16} opacity={0.6} />
            <span style={{ fontSize: 11, color: "#2B6636", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Core Competencies
            </span>
            <CrosshairIcon size={16} opacity={0.6} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3.5vw, 46px)",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Four Pillars of{" "}
            <span style={{ color: "#2B6636" }}>Engineering Excellence</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {pillars.map((p) => (
            <div
              id={p.title.toLowerCase().replaceAll(" ", "-")}
              key={p.number}
              style={{
                padding: "32px",
                borderRadius: 12,
                border: "1px solid rgba(43,102,54,0.15)",
                backgroundColor: "#fff",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.25s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(43,102,54,0.4)";
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = "0 12px 36px rgba(43,102,54,0.12)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(43,102,54,0.15)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Decorative corner crosshair */}
              <div style={{ position: "absolute", top: 16, right: 16, opacity: 0.15 }}>
                <CrosshairIcon size={28} opacity={1} />
              </div>

              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 48,
                  fontWeight: 700,
                  color: "rgba(43,102,54,0.08)",
                  lineHeight: 1,
                  marginBottom: 12,
                  letterSpacing: "-0.04em",
                }}
              >
                {p.number}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 12,
                  letterSpacing: "-0.01em",
                }}
              >
                {p.title}
              </h3>
              <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7, fontFamily: "var(--font-body)", marginBottom: 20 }}>
                {p.desc}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {p.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: "3px 10px",
                      borderRadius: 4,
                      backgroundColor: "rgba(43,102,54,0.07)",
                      fontSize: 11,
                      color: "#2B6636",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      border: "1px solid rgba(43,102,54,0.15)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Events Banner ───────────────────────────────────────── */
function Events() {
  const events = [
    { id: "workshops", title: "Technical learning", type: "Workshop", location: "Watch the GESS Facebook page for announcements" },
    { id: "academic", title: "Academic support", type: "Academic", location: "Peer learning and professional preparation" },
    { id: "summits", title: "Industry connections", type: "Summit", location: "Alumni and industry collaboration opportunities" },
    { id: "outreach", title: "Student-led activities", type: "Outreach", location: "Community-focused initiatives and updates" },
  ];

  const typeColors: Record<string, string> = {
    Workshop: "#2B6636",
    Academic: "#1a5276",
    Summit: "#7d3c98",
    Outreach: "#d35400",
  };

  return (
    <section id="events" style={{ backgroundColor: "#fff", padding: "96px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <CrosshairIcon size={16} opacity={0.6} />
              <span style={{ fontSize: 11, color: "#2B6636", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Events & News
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(26px, 3vw, 40px)",
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.02em",
              }}
            >
              Upcoming Activities
            </h2>
          </div>
          <a
            href="https://www.facebook.com/usepgess"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 13,
              color: "#2B6636",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              textDecoration: "none",
              borderBottom: "1px solid #7BC635",
              paddingBottom: 2,
            }}
          >
            Follow GESS on Facebook →
          </a>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {events.map((ev, i) => (
            <div
              key={ev.id}
              id={ev.id}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr auto",
                gap: 24,
                alignItems: "center",
                padding: "20px 24px",
                borderRadius: 8,
                border: "1px solid rgba(43,102,54,0.1)",
                backgroundColor: "#F4F9F5",
                transition: "all 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#fff";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(43,102,54,0.3)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(43,102,54,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#F4F9F5";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(43,102,54,0.1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 12,
                  color: "#2B6636",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                }}
              >
                {ev.type}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, color: "#111827", marginBottom: 3 }}>
                  {ev.title}
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", fontFamily: "var(--font-body)" }}>
                  📍 {ev.location}
                </div>
              </div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 4,
                  backgroundColor: `${typeColors[ev.type]}18`,
                  color: typeColors[ev.type],
                  fontSize: 11,
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  border: `1px solid ${typeColors[ev.type]}30`,
                }}
              >
                {ev.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Gallery ─────────────────────────────────────────────── */
function Gallery() {
  const photos = [
    { id: "1526778548025-fa2f459cd5c1", label: "GNSS Field Survey", w: 600, h: 400 },
    { id: "1464822759023-fed622ff2c3b", label: "Topographic Mapping", w: 600, h: 400 },
    { id: "1518005020951-eccb494ad742", label: "Satellite Data Analysis", w: 600, h: 400 },
    { id: "1519608487953-e999c86e7455", label: "GIS Workshop Session", w: 600, h: 400 },
    { id: "1553877522-43269d4ea984", label: "Field Instrumentation", w: 600, h: 400 },
    { id: "1515263487990-61b07816b324", label: "Community Outreach", w: 600, h: 400 },
  ];

  return (
    <section id="gallery" style={{ backgroundColor: "#F4F9F5", padding: "96px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <CrosshairIcon size={16} opacity={0.6} />
            <span style={{ fontSize: 11, color: "#2B6636", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Gallery & Projects
            </span>
            <CrosshairIcon size={16} opacity={0.6} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(26px, 3.5vw, 42px)",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.02em",
            }}
          >
            Fieldwork & Mapping Portfolios
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {photos.map((photo, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                borderRadius: 10,
                overflow: "hidden",
                aspectRatio: "4/3",
                backgroundColor: "#2B6636",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const overlay = e.currentTarget.querySelector(".gallery-overlay") as HTMLElement;
                if (overlay) overlay.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                const overlay = e.currentTarget.querySelector(".gallery-overlay") as HTMLElement;
                if (overlay) overlay.style.opacity = "0";
              }}
            >
              <img
                src={`https://images.unsplash.com/photo-${photo.id}?w=${photo.w}&h=${photo.h}&fit=crop&auto=format`}
                alt={photo.label}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = gessLogo;
                }}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
              />
              {/* Corner crosshairs */}
              <div style={{ position: "absolute", top: 10, left: 10, opacity: 0.6 }}>
                <CrosshairIcon size={16} opacity={1} />
              </div>
              <div
                className="gallery-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(13,46,20,0.9) 0%, transparent 60%)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: 16,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "#fff" }}>
                  {photo.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact / CTA ───────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" style={{ backgroundColor: "#0D2E14", position: "relative", overflow: "hidden" }}>
      {/* Topo grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(43,102,54,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(43,102,54,0.08) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          {/* Left */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <CrosshairIcon size={18} opacity={0.8} />
              <span style={{ fontSize: 11, color: "#7BC635", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Get In Touch
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.5vw, 46px)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: 20,
              }}
            >
              Join the Map-Makers of{" "}
              <span style={{ color: "#7BC635" }}>Tomorrow</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.7, fontFamily: "var(--font-body)", marginBottom: 36 }}>
              Ready to chart your path in geodetic engineering? Connect with us for membership inquiries, partnerships, or collaboration opportunities.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "↗", label: "Facebook", value: "GESS Facebook page" },
                { icon: "◎", label: "Updates", value: "Announcements and activities on Facebook" },
                { icon: "◌", label: "Community", value: "Student-led learning and collaboration" },
              ].map((c) => (
                <div key={c.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-display)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                      {c.label}
                    </div>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body)" }}>
                      {c.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(123,198,53,0.15)",
              borderRadius: 14,
              padding: 32,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Full Name", placeholder: "Juan dela Cruz", type: "text" },
                { label: "Email Address", placeholder: "name@example.com", type: "email" },
                { label: "Area of Interest", placeholder: "GIS, surveying, outreach...", type: "text" },
              ].map((field) => (
                <div key={field.label}>
                  <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 7,
                      border: "1px solid rgba(123,198,53,0.2)",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      fontSize: 14,
                      fontFamily: "var(--font-body)",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(123,198,53,0.6)")}
                    onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(123,198,53,0.2)")}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                  Message
                </label>
                <textarea
                  placeholder="Tell us why you want to join GESS..."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 7,
                    border: "1px solid rgba(123,198,53,0.2)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    fontSize: 14,
                    fontFamily: "var(--font-body)",
                    outline: "none",
                    resize: "vertical",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = "rgba(123,198,53,0.6)")}
                  onBlur={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = "rgba(123,198,53,0.2)")}
                />
              </div>
              <button
                type="button"
                aria-label="Open the official GESS Facebook page"
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: 7,
                  backgroundColor: "#2B6636",
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 14,
                  border: "1px solid rgba(123,198,53,0.3)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  letterSpacing: "0.04em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#7BC635";
                  (e.currentTarget as HTMLElement).style.color = "#0D2E14";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#2B6636";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onClick={() => window.open("https://www.facebook.com/usepgess", "_blank", "noopener,noreferrer")}
              >
                Continue on Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ backgroundColor: "#050f07", borderTop: "1px solid rgba(43,102,54,0.3)", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(123,198,53,0.4)" }}>
              <img src={gessLogo} alt="GESS" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "#fff" }}>
                Geodetic Engineering Students Society
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Student-led geomatics community</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-body)" }}>
            © 2026 GESS. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "Home", href: "#hero" },
              { label: "About", href: "#about" },
              { label: "Events", href: "#events" },
              { label: "Gallery", href: "#gallery" },
              { label: "Contact", href: "#contact" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "var(--font-display)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#7BC635")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Root ────────────────────────────────────────────────── */
export default function App() {
  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <Navbar />
      <Hero />
      <About />
      <Pillars />
      <Events />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}
