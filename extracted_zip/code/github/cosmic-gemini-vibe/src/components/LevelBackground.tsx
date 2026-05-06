import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Level } from "../types";

interface BackgroundProps {
  level: Level;
  scrollX?: number; // make optional
}

const getClipPath = (env: string, i: number) => {
  if (env === "desert" || env === "lava")
    return "ellipse(60% 100% at 50% 100%)";
  if (env === "tech" || env === "geometric")
    return `polygon(${i % 2 === 0 ? "0% 100%, 0% 20%, 40% 20%, 40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 100%" : "0% 100%, 20% 100%, 20% 40%, 80% 40%, 80% 100%, 100% 100%"})`;
  if (env === "forest")
    return "polygon(0% 100%, 10% 80%, 20% 100%, 30% 70%, 40% 100%, 50% 60%, 60% 100%, 70% 75%, 80% 100%, 90% 85%, 100% 100%)";
  if (env === "ice" || env === "tundra")
    return "polygon(0% 100%, 20% 30%, 40% 60%, 60% 10%, 80% 50%, 100% 100%)";
  if (env === "graveyard")
    return "polygon(10% 100%, 10% 50%, 20% 40%, 30% 50%, 30% 100%, 60% 100%, 60% 30%, 70% 20%, 80% 30%, 80% 100%)";
  if (env === "moon") return "ellipse(80% 100% at 50% 100%)";
  return "polygon(0% 100%, 25% 40%, 50% 70%, 75% 25%, 100% 100%)";
};

export const LevelBackground = ({ level }: BackgroundProps) => {
  const starsRef = useRef<HTMLDivElement>(null);
  const midCloudsRef = useRef<HTMLDivElement>(null);
  const parallaxNodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const floorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleCameraUpdate = (e: any) => {
      const sx = e.detail;
      if (starsRef.current)
        starsRef.current.style.transform = `translateX(${-(sx * 0.01) % 100}vw)`;
      if (midCloudsRef.current)
        midCloudsRef.current.style.transform = `translateX(${-sx * 0.2}px)`; // mid clouds are parralaxed slowly
      if (floorRef.current) {
        if (level.environment === "mad-fields") {
          floorRef.current.style.transform = `translateX(${-(Math.floor(sx) % 3000)}px)`;
        } else if (level.environment === "ship") {
          floorRef.current.style.transform = `translateX(${-(Math.floor(sx) % 256)}px)`;
        } else {
          floorRef.current.style.transform = `translateX(${-(Math.floor(sx) % 128)}px)`;
        }
      }
      parallaxNodesRef.current.forEach((node) => {
        if (node) {
          const depth = parseFloat(node.dataset.depth || "1");
          node.style.transform = `translateX(${-sx * depth}px)`;
        }
      });
    };
    window.addEventListener("updateCamera", handleCameraUpdate);
    return () => window.removeEventListener("updateCamera", handleCameraUpdate);
  }, []);

  if (level.environment === 'cyberpunk') {
    // Deterministic pseudo-random: no Math.random() in render — avoids flicker on re-renders
    const bh1 = [180,260,120,300,200,140,320,170,240,110,280,160,230,190,270,130,310,150,220,180,260,140,300,170,250,120,290,160,210,180,270,130,240,190,310,150,280,120,230,170,260,140,300,180,220,110,290,160,250,130,270,190,240,150,310,120,280,170,220,140,260,180,300,130,250,160,290,110,230,190,270,150,310,140,280,120,260,170,220,180,300,130,250,160,290,110,240,190,270,150,310,140,280,120,260,170,220,180,300,130];
    const bw1 = [80,120,90,140,100,80,130,110,90,100,120,80,140,100,110,90,130,80,100,120,90,140,110,80,100,120,90,130,80,100,120,90,110,80,130,100,90,120,80,100,110,90,130,80,120,90,100,110,80,130,100,90,120,80,100,110,90,130,80,120,90,100,110,80,130,100,90,120,80,100,110,90,130,80,120,90,100,110,80,130,100,90,120,80,100,110,90,130,80,120,90,100,110,80,130,100,90,120,80,100];
    const bh2 = [160,230,140,270,190,120,250,170,210,150,280,130,240,180,260,110,300,160,220,140,270,190,250,130,210,170,290,150,230,120,260,180,240,110,300,160,220,140,270,190,250,130,210,170,290,150,230,120,260,180,240,110,300,160,220,140,270,190,250,130,210,170,290,150,230,120,260,180,240,110];
    const bw2 = [120,160,140,180,130,150,170,120,140,160,130,150,180,120,160,140,130,170,120,150,160,140,130,180,120,160,150,130,170,140,120,160,130,150,180,120,160,140,130,170,120,150,160,140,130,180,120,160,150,130,170,140,120,160,130,150,180,120,160,140,130,170,120,150,160,140,130,180,120,160];
    const bh3 = [100,140,80,120,160,90,130,110,150,80,140,100,120,160,90,130,80,150,110,100,140,80,120,160,90,130,110,150,80,140,100,120,160,90,130,80,150,110,100,140,80,120,160,90,130,110,150,80,140,100];
    const bw3 = [200,260,220,280,240,200,260,220,240,280,200,260,220,280,240,200,260,220,240,280,200,260,220,280,240,200,260,220,240,280,200,260,220,280,240,200,260,220,240,280,200,260,220,280,240,200,260,220,240,280];
    return (
      <AnimatePresence mode="popLayout">
        <motion.div
          key={level.number}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 overflow-hidden pointer-events-none z-0"
          style={{ background: "linear-gradient(to bottom, #0d0221 0%, #0a0118 40%, #060611 100%)", zIndex: 0 }}
        >
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] z-0 opacity-30 pointer-events-none" />

          {/* Matrix rain — fixed positions using index */}
          <div className="absolute inset-0 opacity-25 z-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`matrix-${i}`}
                className="absolute top-0 font-mono text-emerald-400 text-xs leading-none overflow-hidden"
                style={{
                  left: `${(i * 5.1) % 100}%`,
                  width: "14px",
                  height: "100%",
                  writingMode: "vertical-rl",
                  textShadow: "0 0 4px #10b981",
                }}
                animate={{ y: ["-20%", "110%"] }}
                transition={{ repeat: Infinity, duration: 3 + (i % 5), delay: i * 0.4, ease: "linear" }}
              >
                {"10<>/"[(i * 3) % 5].repeat(30)}
              </motion.div>
            ))}
          </div>

          {/* Far Skyline — dense silhouette (Depth 0.05) */}
          <div
            ref={(el) => { if (el) parallaxNodesRef.current[0] = el; }}
            data-depth="0.05"
            className="absolute bottom-[60px] flex items-end will-change-transform"
            style={{ width: "8000px" }}
          >
            {bh1.slice(0, 100).map((h, i) => (
              <div
                key={`b1-${i}`}
                className="relative flex-shrink-0"
                style={{ width: `${bw1[i % bw1.length]}px`, height: `${h}px`, background: "#0b0c1e", borderTop: "1px solid #1e1f3a" }}
              >
                {/* Antenna on tall buildings */}
                {h > 250 && <div style={{ position: "absolute", top: 0, right: "10px", width: "2px", height: "24px", background: "#f97316", boxShadow: "0 0 6px #f97316", transform: "translateY(-100%)" }} />}
                {/* Window rows */}
                {[...Array(Math.floor(h / 40))].map((_, r) => (
                  <div key={r} className="absolute flex gap-[4px]" style={{ top: `${12 + r * 36}px`, left: "8px", right: "8px" }}>
                    {[...Array(Math.floor(bw1[i % bw1.length] / 20))].map((_, c) => (
                      <div key={c} style={{ width: "8px", height: "6px", background: ((i + r + c) % 3 === 0) ? "rgba(139,92,246,0.5)" : "rgba(17,17,34,0.9)" }} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Mid Skyline (Depth 0.15) */}
          <div
            ref={(el: HTMLDivElement | null) => { if (el) parallaxNodesRef.current[1] = el; }}
            data-depth="0.15"
            className="absolute bottom-[60px] flex items-end will-change-transform"
            style={{ width: "10000px" }}
          >
            {bh2.slice(0, 70).map((h, i) => (
              <div
                key={`b2-${i}`}
                className="relative flex-shrink-0"
                style={{ width: `${bw2[i % bw2.length]}px`, height: `${h}px`, background: "#0f1128", borderTop: `2px solid ${i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#0e7490" : "#be185d"}` }}
              >
                {/* Neon sign on some buildings */}
                {i % 6 === 0 && <div style={{ position: "absolute", top: "8px", left: "8px", right: "8px", height: "10px", background: i % 2 === 0 ? "rgba(34,211,238,0.2)" : "rgba(236,72,153,0.2)", border: `1px solid ${i % 2 === 0 ? "#22d3ee" : "#ec4899"}`, boxShadow: `0 0 8px ${i % 2 === 0 ? "#22d3ee" : "#ec4899"}` }} />}
                {/* Window grid */}
                {[...Array(Math.floor(h / 30))].map((_, r) => (
                  <div key={r} className="absolute flex gap-[3px]" style={{ top: `${20 + r * 28}px`, left: "6px", right: "6px" }}>
                    {[...Array(Math.floor(bw2[i % bw2.length] / 18))].map((_, c) => (
                      <div key={c} style={{ flex: 1, height: "7px", background: ((i * 3 + r * 2 + c) % 4 === 0) ? "rgba(56,189,248,0.6)" : ((i + r + c) % 5 === 0) ? "rgba(236,72,153,0.5)" : "rgba(15,18,40,0.95)" }} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Near Buildings — dark silhouettes, no visual clutter (Depth 0.4) */}
          <div
            ref={(el: HTMLDivElement | null) => { if (el) parallaxNodesRef.current[2] = el; }}
            data-depth="0.4"
            className="absolute bottom-[60px] flex items-end will-change-transform"
            style={{ width: "12000px" }}
          >
            {bh3.slice(0, 50).map((h, i) => (
              <div
                key={`b3-${i}`}
                className="relative flex-shrink-0"
                style={{
                  width: `${bw3[i % bw3.length]}px`,
                  height: `${h}px`,
                  background: "#080a1a",
                  borderTop: `3px solid ${i % 2 === 0 ? "#4f46e5" : "#7c3aed"}`,
                }}
              >
                {/* Single rooftop neon strip */}
                <div style={{ position: "absolute", top: "8px", left: "12px", right: "12px", height: "2px", background: i % 2 === 0 ? "#4f46e5" : "#7c3aed", opacity: 0.6 }} />
                {/* Antenna on tall */}
                {h > 120 && <div style={{ position: "absolute", top: 0, right: "16px", width: "2px", height: "20px", background: "#f97316", transform: "translateY(-100%)" }} />}
              </div>
            ))}
          </div>

          {/* Neon floor */}
          <div className="absolute inset-x-0 bottom-0 h-[60px] overflow-hidden" style={{ background: "linear-gradient(to top, #020617, #1e1b4b)" }}>
            <div ref={floorRef} className="flex will-change-transform" style={{ width: "calc(128px * 64)" }}>
              {[...Array(64)].map((_, i) => (
                <div
                  key={`cfloor-${i}`}
                  className="flex-shrink-0 relative"
                  style={{ width: "128px", height: "60px", borderTop: "3px solid rgba(217,70,239,0.8)", background: "#0f172a", boxShadow: "0 0 20px rgba(217,70,239,0.4) inset" }}
                >
                  <div style={{ position: "absolute", inset: "0 0", top: "8px", height: "1px", background: "rgba(34,211,238,0.25)" }} />
                  <div style={{ position: "absolute", top: 0, bottom: 0, left: "64px", width: "1px", background: "rgba(34,211,238,0.25)" }} />
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "16px", background: "linear-gradient(to bottom, rgba(217,70,239,0.25), transparent)" }} />
          </div>

          {/* Flying cars — fixed positions via index */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`car-${i}`}
              className="absolute rounded-full"
              style={{
                top: `${8 + (i * 6.3) % 35}%`,
                width: "28px",
                height: "8px",
                backgroundColor: i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#fb7185' : '#a855f7',
                boxShadow: i % 3 === 0 ? '0 0 12px #38bdf8' : i % 3 === 1 ? '0 0 12px #fb7185' : '0 0 12px #a855f7',
                opacity: 0.8,
              }}
              animate={{ x: i % 2 === 0 ? ['100vw', '-10vw'] : ['-10vw', '100vw'] }}
              transition={{ repeat: Infinity, duration: 4 + (i % 6), ease: "linear", delay: i * 0.7 }}
            >
              <div style={{ position: "absolute", top: "1px", left: "2px", width: "10px", height: "5px", background: "white", borderRadius: "50%", opacity: 0.9 }} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  }

  if (level.environment === "mad-fields") {
    return (
      <AnimatePresence mode="popLayout">
        <motion.div
          key={level.number}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[#87ceeb] overflow-hidden pointer-events-none"
        >
          {/* Clouds */}
          <div
            ref={starsRef}
            className="absolute inset-x-0 top-0 h-1/2 w-[200vw] will-change-transform"
            style={{ transform: `translateX(0px)` }}
          >
            {[...Array(6)].map((_, i) => (
              <svg
                key={`cloud-${i}`}
                className="absolute fill-white/80"
                style={{
                  top: `${5 + Math.random() * 20}%`,
                  left: `${i * 16 + Math.random() * 5}vw`,
                  width: `${100 + Math.random() * 150}px`,
                }}
                viewBox="0 0 24 24"
              >
                <path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10c-.23 0-.455.017-.672.05C16.208 7.15 13.565 5 10.5 5 6.91 5 4 7.91 4 11.5c0 .323.023.64.068.948C2.33 12.872 1 14.502 1 16.5 1 18.985 3.015 21 5.5 21h12z" />
              </svg>
            ))}
          </div>

          <div
            ref={midCloudsRef}
            className="absolute inset-0 w-[8000px] flex items-end pb-[120px] landscape:pb-[40px] will-change-transform pointer-events-none"
          >
            {/* Far hills */}
            {[...Array(10)].map((_, i) => (
              <svg
                key={`bh-${i}`}
                className="absolute bottom-[100px] w-[800px] h-[300px] fill-emerald-800"
                style={{ left: `${i * 600}px` }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path d="M0,100 C30,0 70,0 100,100 Z" />
              </svg>
            ))}
            {/* Red Barn */}
            <svg
              className="absolute bottom-[100px] w-[150px] h-[150px]"
              style={{ left: "800px" }}
              viewBox="0 0 100 100"
            >
              <polygon
                points="50,10 10,40 20,40 20,90 80,90 80,40 90,40"
                fill="#dc2626"
              />
              <rect x="40" y="60" width="20" height="30" fill="white" />
              <polygon
                points="50,5 5,45 15,50 50,20 85,50 95,45"
                fill="white"
              />
              <circle cx="50" cy="30" r="10" fill="white" />
            </svg>
          </div>

          {/* Floor parallax layer */}
          <div
            ref={floorRef}
            className="absolute inset-x-0 bottom-0 h-[120px] landscape:h-[70px] w-[10000px] will-change-transform"
          >
            {/* Mid hills */}
            <div
              className="absolute inset-0"
              style={{ transform: "translateY(-60px)" }}
            >
              {[...Array(15)].map((_, i) => (
                <svg
                  key={`mh-${i}`}
                  className="absolute bottom-0 w-[500px] h-[200px] fill-emerald-700"
                  style={{ left: `${i * 300}px` }}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path d="M0,100 C30,20 70,20 100,100 Z" />
                </svg>
              ))}
            </div>

            {/* Close hills / ground */}
            <div
              className="absolute inset-0"
              style={{ transform: "translateY(-20px)" }}
            >
              {[...Array(20)].map((_, i) => (
                <svg
                  key={`fh-${i}`}
                  className="absolute bottom-0 w-[400px] h-[150px] fill-emerald-600"
                  style={{ left: `${i * 250}px` }}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path d="M0,100 C30,30 70,30 100,100 Z" />
                </svg>
              ))}
            </div>

            {/* Solid Ground Base */}
            <div className="absolute bottom-0 w-[10000px] h-[120px] landscape:h-[70px] bg-emerald-700" />
            <div className="absolute top-0 w-[10000px] h-2 bg-emerald-500" />

            {/* Fence */}
            {[...Array(100)].map((_, i) => (
              <div
                key={`fence-${i}`}
                className="absolute bottom-[115px] landscape:bottom-[65px]"
                style={{ left: `${i * 100}px` }}
              >
                <svg className="w-[100px] h-[80px]" viewBox="0 0 100 80">
                  <rect x="20" y="20" width="8" height="60" fill="#8B4513" />
                  <rect x="70" y="20" width="8" height="60" fill="#8B4513" />
                  <rect x="0" y="30" width="100" height="6" fill="#A0522D" />
                  <rect x="0" y="55" width="100" height="6" fill="#A0522D" />
                </svg>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none">
            {/* Interactive Platforms */}
            {[...Array(10)].map((_, i) => {
              const platformX = i * 1200 + 800;
              return (
                <div
                  key={`platform-${i}`}
                  ref={(el) => {
                    parallaxNodesRef.current[i] = el;
                  }}
                  data-depth="1"
                  className="absolute w-[300px] h-[40px] z-20 will-change-transform"
                  style={{
                    top: "calc(100% - 300px)",
                    left: `${platformX}px`,
                  }}
                >
                  <div className="relative w-full h-full bg-[#8B4513] rounded-sm border-t-4 border-[#A0522D] overflow-hidden shadow-xl" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-4/5 h-4 bg-black/40 blur-md" />
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (level.environment === "lab") {
    return (
      <AnimatePresence mode="popLayout">
        <motion.div
          key={level.number}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[#0f172a] overflow-hidden pointer-events-none"
        >
          {/* Holographic panels, circuit floor, data streams */}
          <div
            ref={starsRef}
            className="absolute inset-0 w-[200vw] will-change-transform"
          >
            {/* Hexagonal grid background */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Data streams */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`stream-${i}`}
                className="absolute w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent shadow-[0_0_8px_#3b82f6]"
                style={{ left: `${i * 10}vw`, top: 0, bottom: 0, opacity: 0.3 }}
                animate={{ y: ["-100%", "100%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + Math.random() * 4,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* Deep screens */}
          <div
            ref={midCloudsRef}
            className="absolute inset-0 w-[8000px] flex items-center will-change-transform pointer-events-none"
          >
            {[...Array(30)].map((_, i) => (
              <div
                key={`screen-${i}`}
                className="absolute top-[20%] w-[300px] h-[200px] border border-blue-500/30 bg-blue-900/10 backdrop-blur-sm rounded-lg flex flex-col justify-between p-4"
                style={{ left: `${i * 450 + 200}px` }}
              >
                <div className="w-full h-2 bg-blue-500/20 rounded" />
                <div className="w-3/4 h-2 bg-blue-500/20 rounded mt-2" />
                <div className="mt-auto flex justify-between">
                  <div className="w-16 h-16 rounded-full border border-blue-400/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-blue-300/50" />
                  </div>
                  <div className="w-32 h-16 flex flex-col justify-end gap-1">
                    {[...Array(4)].map((_, j) => (
                      <div
                        key={j}
                        className="h-2 bg-blue-500/30 w-full rounded"
                      />
                    ))}
                  </div>
                </div>
                {/* Glowing edge */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-400 shadow-[0_0_10px_#60a5fa]" />
              </div>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[120px] landscape:h-[70px] overflow-hidden">
            <div
              ref={floorRef}
              className="flex will-change-transform"
              style={{
                transform: `translateX(0px)`,
                width: "calc(256px * 32)",
              }}
            >
              {[...Array(32)].map((_, i) => (
                <div
                  key={`floor-${i}`}
                  className="flex-shrink-0 relative border-t border-blue-400 bg-slate-900 shadow-[0_0_20px_rgba(59,130,246,0.4)_inset]"
                  style={{ width: "256px", height: "100%" }}
                >
                  {/* Circuit traces on the floor */}
                  <div className="absolute top-2 left-4 w-12 h-1 bg-blue-500/40" />
                  <div className="absolute top-2 left-16 w-1 h-8 bg-blue-500/40" />
                  <div className="absolute top-10 left-16 w-8 h-1 bg-blue-500/40" />
                  <div className="absolute top-10 left-24 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_5px_#60a5fa]" />

                  <div className="absolute bottom-4 right-4 w-16 h-1 bg-blue-500/40" />
                  <div className="absolute bottom-4 right-20 w-1 h-6 bg-blue-500/40" />
                  <div className="absolute bottom-10 right-20 w-3 h-3 border border-blue-400 bg-slate-800" />
                </div>
              ))}
            </div>
            {/* Soft futuristic edge lighting */}
            <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-blue-500/20 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (level.environment === "nebula") {
    return (
      <AnimatePresence mode="popLayout">
        <motion.div
          key={level.number}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            background:
              "linear-gradient(160deg, #0a0015 0%, #0d0030 30%, #050020 60%, #000510 100%)",
          }}
        >
          {/* Nebula color clouds — far back, barely scrolling */}
          <div
            ref={starsRef}
            className="absolute inset-0 w-[200vw] will-change-transform"
          >
            {/* Large purple nebula blob */}
            <div
              className="absolute rounded-full blur-[80px]"
              style={{
                width: "600px",
                height: "400px",
                top: "5%",
                left: "10%",
                background: "rgba(139,92,246,0.18)",
              }}
            />
            {/* Magenta nebula cloud */}
            <div
              className="absolute rounded-full blur-[100px]"
              style={{
                width: "500px",
                height: "350px",
                top: "30%",
                left: "55%",
                background: "rgba(236,72,153,0.14)",
              }}
            />
            {/* Blue nebula */}
            <div
              className="absolute rounded-full blur-[90px]"
              style={{
                width: "700px",
                height: "300px",
                top: "60%",
                left: "25%",
                background: "rgba(59,130,246,0.12)",
              }}
            />
            {/* Teal accent */}
            <div
              className="absolute rounded-full blur-[70px]"
              style={{
                width: "400px",
                height: "250px",
                top: "15%",
                left: "80%",
                background: "rgba(20,184,166,0.10)",
              }}
            />
            {/* Star layer 1 — densest, slowest (depth ~0) */}
            {[...Array(80)].map((_, i) => (
              <div
                key={`sf-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${1 + (i % 2)}px`,
                  height: `${1 + (i % 2)}px`,
                  top: `${Math.sin(i * 2.3) * 45 + 50}%`,
                  left: `${(i * 2.5) % 200}%`,
                  opacity: 0.4 + (i % 5) * 0.12,
                  animation: `pulse ${2 + (i % 4)}s ease-in-out infinite`,
                  animationDelay: `${(i % 7) * 0.3}s`,
                }}
              />
            ))}
          </div>

          {/* Mid-speed stars layer */}
          <div
            ref={midCloudsRef}
            className="absolute inset-0 w-[8000px] will-change-transform"
          >
            {/* Supernova / Sol Alejado */}
            <div
              ref={(el) => {
                parallaxNodesRef.current[53] = el;
              }}
              data-depth="0.02" /* moves very slowly */
              className="absolute will-change-transform"
              style={{ left: "1600px", top: "15%" }}
            >
              <div className="absolute w-64 h-64 rounded-full bg-amber-200/5 blur-[80px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-amber-100 shadow-[0_0_120px_rgba(251,191,36,0.8),0_0_60px_rgba(252,211,77,0.9)_inset]" />
            </div>

            {/* Star layer 2 — medium depth */}
            {[...Array(120)].map((_, i) => (
              <div
                key={`sm-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${1 + (i % 3 === 0 ? 1 : 0)}px`,
                  height: `${1 + (i % 3 === 0 ? 1 : 0)}px`,
                  top: `${Math.cos(i * 1.7) * 45 + 50}%`,
                  left: `${i * 66}px`,
                  opacity: 0.5 + (i % 4) * 0.1,
                  animation: `pulse ${1.5 + (i % 5)}s ease-in-out infinite`,
                  animationDelay: `${(i % 6) * 0.2}s`,
                }}
              />
            ))}

            {/* Planet 1 — large purple gas giant */}
            <div
              ref={(el) => {
                parallaxNodesRef.current[50] = el;
              }}
              data-depth="0.05"
              className="absolute will-change-transform"
              style={{ left: "200px", top: "8%" }}
            >
              <div className="relative w-40 h-40">
                <div
                  className="absolute inset-0 rounded-full shadow-[0_0_60px_rgba(139,92,246,0.5)]"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 35%, #c4b5fd, #7c3aed, #3b0764)",
                  }}
                />
                {/* Planet ring */}
                <div
                  className="absolute"
                  style={{
                    top: "44%",
                    left: "-28%",
                    width: "156%",
                    height: "14%",
                    border: "3px solid rgba(196,181,253,0.35)",
                    borderRadius: "50%",
                    transform: "rotateX(70deg)",
                  }}
                />
                {/* Cloud bands */}
                <div className="absolute inset-0 rounded-full overflow-hidden opacity-40">
                  <div
                    className="absolute"
                    style={{
                      top: "30%",
                      left: 0,
                      right: 0,
                      height: "8%",
                      background: "rgba(167,139,250,0.6)",
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      top: "55%",
                      left: 0,
                      right: 0,
                      height: "6%",
                      background: "rgba(109,40,217,0.5)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Planet 2 — blue ice planet, mid-distance */}
            <div
              ref={(el) => {
                parallaxNodesRef.current[51] = el;
              }}
              data-depth="0.08"
              className="absolute will-change-transform"
              style={{ left: "1000px", top: "55%" }}
            >
              <div className="relative w-24 h-24">
                <div
                  className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.45)]"
                  style={{
                    background:
                      "radial-gradient(circle at 40% 30%, #bfdbfe, #1d4ed8, #1e3a5f)",
                  }}
                />
                <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
                  <div
                    className="absolute"
                    style={{
                      top: "40%",
                      left: 0,
                      right: 0,
                      height: "6%",
                      background: "rgba(147,197,253,0.7)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Planet 3 — red/orange distant planet */}
            <div
              ref={(el) => {
                parallaxNodesRef.current[52] = el;
              }}
              data-depth="0.04"
              className="absolute will-change-transform"
              style={{ left: "1400px", top: "20%" }}
            >
              <div className="relative w-20 h-20">
                <div
                  className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.35)]"
                  style={{
                    background:
                      "radial-gradient(circle at 38% 38%, #fca5a5, #dc2626, #7f1d1d)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Close fast stars — full parallax depth */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(40)].map((_, i) => {
              const sx = i * 200 + 80;
              return (
                <div
                  key={`sc-${i}`}
                  ref={(el) => {
                    parallaxNodesRef.current[i] = el;
                  }}
                  data-depth="0.6"
                  className="absolute will-change-transform"
                  style={{
                    left: `${sx}px`,
                    top: `${Math.sin(i * 1.4) * 40 + 45}%`,
                  }}
                >
                  <div
                    className="rounded-full bg-white"
                    style={{
                      width: `${2 + (i % 3)}px`,
                      height: `${2 + (i % 3)}px`,
                      opacity: 0.6 + (i % 3) * 0.13,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)",
            }}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (level.environment === "ship") {
    return (
      <AnimatePresence mode="popLayout">
        <motion.div
          key={level.number}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, #09090b, #18181b 60%, #27272a)",
          }}
        >
          {/* Emergency ceiling light strips */}
          <div className="absolute top-0 inset-x-0 h-4 flex">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`strip-${i}`}
                className="flex-1 h-full"
                style={{
                  background:
                    i % 2 === 0 ? "rgba(220,38,38,0.85)" : "transparent",
                }}
                animate={{ opacity: [0.9, 0.15, 0.9] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: i * 0.12,
                }}
              />
            ))}
          </div>

          {/* Wall panels with large observation windows */}
          <div
            ref={starsRef}
            className="absolute inset-x-0 inset-y-0 w-[200vw] will-change-transform"
          >
            {[...Array(15)].map((_, i) => (
              <div
                key={`panel-${i}`}
                className="absolute border-x border-zinc-700/50"
                style={{
                  left: `${i * 12}vw`,
                  top: "0%",
                  width: "12vw",
                  height: "75%",
                  background: "transparent",
                }}
              >
                {/* Wall Pillars */}
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-zinc-800 to-zinc-900 border-r border-zinc-700 shadow-xl z-20" />
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-zinc-800 to-zinc-900 border-l border-zinc-700 shadow-xl z-20" />

                {/* Window Frame Header/Footer */}
                <div className="absolute top-0 inset-x-0 h-16 bg-zinc-900 border-b border-zinc-700 z-20" />
                <div className="absolute bottom-0 inset-x-0 h-24 bg-zinc-800 border-t border-zinc-700 z-20 flex flex-col justify-end pb-2">
                  {/* Data screens below window */}
                  <div className="flex gap-2 px-12 mb-2">
                    <span className="w-8 h-4 bg-cyan-900/50 border border-cyan-800 rounded-sm" />
                    <span className="w-12 h-4 bg-emerald-900/50 border border-emerald-800 rounded-sm" />
                  </div>
                </div>

                {/* Big Glass Window into Space */}
                <div className="absolute inset-8 top-16 bottom-24 bg-black overflow-hidden z-10 border-4 border-zinc-950 rounded-sm">
                  {/* Background stars inside the window */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at center, rgba(30,58,138,0.2), transparent 70%)",
                    }}
                  />
                  {[...Array(20)].map((_, j) => (
                    <div
                      key={`win-star-${j}`}
                      className="absolute bg-white rounded-full"
                      style={{
                        width: `${Math.random() > 0.8 ? 2 : 1}px`,
                        height: `${Math.random() > 0.8 ? 2 : 1}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${(j * 43 + i * 17) % 100}%`,
                        opacity: Math.random() * 0.8 + 0.2,
                      }}
                    />
                  ))}
                  {/* Sometimes a distant planet or large nebula cloud */}
                  {i % 4 === 1 && (
                    <div
                      className="absolute w-32 h-32 rounded-full border border-blue-500/20 shadow-[0_0_40px_rgba(30,64,138,0.4)]"
                      style={{
                        top: "20%",
                        left: "40%",
                        background:
                          "radial-gradient(circle at 30% 30%, #1e3a8a, #0f172a, #000)",
                      }}
                    />
                  )}
                  {i % 3 === 2 && (
                    <div className="absolute w-64 h-32 bg-fuchsia-500/10 blur-[40px] top-1/4 left-1/4" />
                  )}
                  {/* Glass reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-1/4" />
                </div>
              </div>
            ))}
          </div>

          {/* Horizontal pipes */}
          <div
            ref={midCloudsRef}
            className="absolute inset-x-0 w-[8000px] will-change-transform"
          >
            <div className="absolute top-[18%] inset-x-0 h-4 bg-zinc-600 border-y border-zinc-500">
              {[...Array(50)].map((_, i) => (
                <div
                  key={`jt-${i}`}
                  className="absolute w-6 h-7 bg-zinc-500 border border-zinc-400 rounded-sm -top-1.5"
                  style={{ left: `${i * 160}px` }}
                />
              ))}
            </div>
            <div className="absolute bottom-[28%] inset-x-0 h-3 bg-zinc-700 border-y border-zinc-600">
              {[...Array(50)].map((_, i) => (
                <div
                  key={`jb-${i}`}
                  className="absolute w-5 h-5 bg-zinc-600 border border-zinc-500 rounded-sm -top-1"
                  style={{ left: `${i * 200 + 80}px` }}
                />
              ))}
            </div>
            {/* Blinking warning lights */}
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={`warn-${i}`}
                className="absolute w-3 h-3 rounded-full bg-red-600"
                style={{ left: `${i * 320 + 60}px`, top: "calc(18% + 14px)" }}
                animate={{ opacity: [1, 0.1, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + (i % 4) * 0.3,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>

          {/* Platforms with safety stripes */}
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => {
              const platformX = i * 1200 + 1100;
              return (
                <div
                  key={`platform-${i}`}
                  ref={(el) => {
                    parallaxNodesRef.current[i] = el;
                  }}
                  data-depth="1"
                  className="absolute w-[300px] h-[40px] z-20 will-change-transform"
                  style={{ top: "calc(100% - 300px)", left: `${platformX}px` }}
                >
                  <div className="relative w-full h-full bg-zinc-700 border-t-4 border-zinc-400 overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, rgba(251,191,36,0.35) 0px, rgba(251,191,36,0.35) 6px, transparent 6px, transparent 18px)",
                      }}
                    />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-4/5 h-4 bg-black/40 blur-md" />
                </div>
              );
            })}
          </div>

          {/* Metal grid floor */}
          <div className="absolute inset-x-0 bottom-0 h-[120px] landscape:h-[70px] overflow-hidden">
            <div
              ref={floorRef}
              className="flex will-change-transform"
              style={{
                transform: `translateX(0px)`,
                width: "calc(256px * 32)",
              }}
            >
              {[...Array(32)].map((_, i) => (
                <div
                  key={`floor-${i}`}
                  className="flex-shrink-0 relative border-t-4 border-zinc-500"
                  style={{
                    width: "256px",
                    height: "120px",
                    background: "linear-gradient(to bottom, #3f3f46, #27272a)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(82,82,91,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(82,82,91,0.5) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                  <div
                    className="absolute top-0 inset-x-0 h-2"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, #fbbf24 0px, #fbbf24 12px, #18181b 12px, #18181b 24px)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Red glow at floor */}
          <motion.div
            className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(220,38,38,0.18) 0%, transparent 70%)",
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={level.number}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className={`absolute inset-0 bg-gradient-to-br ${level.themeColor} overflow-hidden`}
      >
        {/* Far Background: Stars and Orbiting Moon */}
        <div className="absolute inset-0">
          <div
            ref={starsRef}
            className="absolute inset-x-0 inset-y-0 w-[200vw] will-change-transform"
            style={{ transform: `translateX(0vw)` }}
          >
            {[...Array(60)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full animate-[pulse_1s_ease-in-out_infinite]"
                style={{
                  top: `${Math.sin(i) * 50 + 50}%`,
                  left: `${i * 3.33}%`,
                  opacity: Math.random(),
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          <motion.div
            className={`absolute rounded-full blur-[1px] ${
              level.environment === "moon"
                ? "top-10 right-[10%] w-64 h-64 opacity-90 shadow-[0_0_80px_rgba(255,255,255,0.2)]"
                : level.environment === "desert"
                  ? "top-6 right-[12%] w-52 h-52 opacity-85 shadow-[0_0_120px_rgba(251,191,36,0.7)]"
                  : "top-20 right-[20%] w-40 h-40 opacity-40 shadow-[0_0_80px_rgba(255,255,255,0.2)]"
            }`}
            style={{
              background:
                level.environment === "desert"
                  ? "radial-gradient(circle at 40% 40%, #fef3c7, #f59e0b, #d97706)"
                  : `radial-gradient(circle at 30% 30%, white, ${level.particleColor}44)`,
              transform: `translateX(${-(scrollX || 0) * 0.005}px)`,
            }}
            animate={
              level.environment === "desert" ? { scale: [1, 1.02, 1] } : {}
            }
            transition={{ repeat: Infinity, duration: 4 }}
          />
        </div>

        {/* Midground: Layered Elements (Dunes, Flora, Mountains) */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 overflow-hidden pointer-events-none">
          <div
            ref={midCloudsRef}
            className="absolute inset-0 will-change-transform"
            style={{ transform: `translateX(0px)` }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`mid-${i}`}
                className="absolute bottom-0 h-[50vh] w-[80vw] opacity-30"
                style={{
                  left: `${((i * 50) % 400) - 80}vw`,
                  background: `linear-gradient(to top, #000, ${level.particleColor}33)`,
                  clipPath: getClipPath(level.environment, i),
                  filter: "blur(2px)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Interactive Platforms (Logic synced with App.tsx) */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => {
            const platformX = i * 1200 + 800;
            // Removed culling here since scrollX is not updating via react render.
            // But we can cull by styling in the handleCameraUpdate, or just render all 10 (it's fine!)
            return (
              <div
                key={`platform-${i}`}
                ref={(el) => {
                  parallaxNodesRef.current[i] = el;
                }}
                data-depth="1"
                className="absolute w-[300px] h-[40px] z-20 will-change-transform"
                style={{
                  top: "calc(100% - 300px)", // synced with app.tsx bottom
                  left: `${platformX}px`,
                  transform: `translateX(0px)`,
                }}
              >
                {/* Modern Platform Style */}
                <div className="relative w-full h-full bg-slate-900/80 rounded-lg border-2 border-white/20 overflow-hidden">
                  <div
                    className="absolute top-0 inset-x-0 h-1"
                    style={{ backgroundColor: level.particleColor }}
                  />
                  <div className="absolute inset-y-0 left-4 w-px bg-white/10" />
                  <div className="absolute inset-y-0 right-4 w-px bg-white/10" />
                  <div className="flex justify-between items-center h-full px-8 opacity-20">
                    <div className="w-1 h-1 rounded-full bg-white" />
                    <div className="w-2 h-2 rotate-45 border border-white" />
                    <div className="w-1 h-1 rounded-full bg-white" />
                  </div>
                </div>
                {/* Platform Support/Shadow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-4/5 h-4 bg-black/40 blur-md" />
              </div>
            );
          })}
        </div>

        {/* Foreground: The Ground (Solid blocks with details) */}
        <div className="absolute inset-x-0 bottom-0 h-[120px] landscape:h-[70px] flex items-end overflow-hidden">
          <div
            ref={floorRef}
            className="flex will-change-transform"
            style={{ transform: `translateX(0px)`, width: "calc(128px * 30)" }}
          >
            {[...Array(30)].map((_, i) => {
              return (
                <div
                  key={`floor-${i}`}
                  className="flex-shrink-0 w-128 h-32 relative border-t-4 border-white/10"
                  style={{
                    width: "128px",
                    background: `linear-gradient(to bottom, ${level.particleColor}22, #000)`,
                  }}
                >
                  {/* Grid details for modern look */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `linear-gradient(${level.particleColor} 1px, transparent 1px), linear-gradient(90deg, ${level.particleColor} 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Flora/Debris */}
                  {i % 3 === 0 && level.environment !== "graveyard" && (
                    <motion.div
                      className="absolute -top-6 left-4 w-8 h-8 opacity-40"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                    >
                      <div className="w-1 h-6 bg-slate-700 mx-auto" />
                      <div className="w-6 h-1 bg-slate-700 -mt-3 mx-auto rounded-full" />
                    </motion.div>
                  )}
                  {i % 2 === 0 && level.environment === "graveyard" && (
                    <div className="absolute -top-8 left-8 w-8 h-8 opacity-60">
                      <div className="w-4 h-8 bg-slate-900 mx-auto rounded-t-full border-t border-slate-700 shadow-xl" />
                      <div className="w-6 h-1 bg-black -mt-1 mx-auto rounded-full opacity-50 blur-[1px]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Atmosphere Overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)`,
          }}
        />

        {/* Environmental Particles (Lava, Snow, Nebula) */}
        <div className="absolute inset-0 pointer-events-none">
          {level.environment === "water" &&
            [...Array(25)].map((_, i) => (
              <motion.div
                key={`bubble-${i}`}
                className="absolute rounded-full border border-white/30"
                style={{
                  width: `${(i % 5) * 2 + 4}px`,
                  height: `${(i % 5) * 2 + 4}px`,
                }}
                initial={{ y: "110%", x: `${Math.random() * 100}%` }}
                animate={{
                  y: "-10%",
                  x: `${Math.random() * 100 + Math.sin(i) * 10}%`,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4 + Math.random() * 6,
                  ease: "linear",
                }}
              />
            ))}
          {level.environment === "tech" &&
            [...Array(40)].map((_, i) => (
              <motion.div
                key={`matrix-${i}`}
                className="absolute font-mono text-emerald-500/40 text-sm opacity-0 overflow-hidden font-bold leading-none tracking-widest break-all"
                style={{
                  top: 0,
                  left: `${Math.random() * 100}%`,
                  width: "20px",
                  height: "100%",
                  writingMode: "vertical-rl",
                  textOrientation: "upright",
                }}
                animate={{ opacity: [0, 0.8, 0], y: ["-10%", "100%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + Math.random() * 4,
                  delay: Math.random() * 5,
                  ease: "linear",
                }}
              >
                {"01<>/"
                  .repeat(20)
                  .split("")
                  .sort(() => Math.random() - 0.5)
                  .join("")}
              </motion.div>
            ))}
          {level.environment === "ice" &&
            [...Array(30)].map((_, i) => (
              <motion.div
                key={`snow-${i}`}
                className="absolute bg-white w-1 h-1 rounded-full"
                initial={{ y: "-10%", x: `${Math.random() * 100}%` }}
                animate={{
                  y: "110%",
                  x: `${Math.random() * 100 + Math.sin(i) * 5}%`,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5 + Math.random() * 5,
                  ease: "linear",
                }}
              />
            ))}
          {level.environment === "desert" &&
            [...Array(30)].map((_, i) => (
              <motion.div
                key={`sand-${i}`}
                className="absolute rounded-full bg-amber-200/60"
                style={{
                  width: `${(i % 4) * 3 + 2}px`,
                  height: "1px",
                  top: `${(i * 37) % 100}%`,
                }}
                initial={{ x: "-5%", opacity: 0 }}
                animate={{ x: "110%", opacity: [0, 0.7, 0.7, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5 + (i % 5) * 0.4,
                  delay: (i * 0.18) % 3,
                  ease: "linear",
                }}
              />
            ))}
          {level.environment === "graveyard" &&
            [...Array(15)].map((_, i) => (
              <motion.div
                key={`fog-${i}`}
                className="absolute h-12 rounded-full opacity-20 blur-2xl"
                style={{
                  background: level.particleColor,
                  width: `${Math.random() * 300 + 100}px`,
                  top: `${Math.random() * 50 + 50}%`,
                  left: `${((i * 200) % 2000) - 500}px`,
                }}
                animate={{ x: [0, 50, 0], opacity: [0.1, 0.3, 0.1] }}
                transition={{
                  repeat: Infinity,
                  duration: 10 + Math.random() * 10,
                  ease: "linear",
                }}
              />
            ))}
        </div>

        {/* Foreground Elements (Very Fast Parallax) */}
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`fore-${i}`}
              className="absolute w-64 h-2 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-xl"
              style={{
                top: `${20 + i * 30}%`,
                left: `${((i * 1500) % 5000) + 1000}px`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
