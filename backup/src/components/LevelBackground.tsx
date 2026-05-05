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
                parallaxNodesRef.current[20] = el;
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
                parallaxNodesRef.current[10] = el;
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
                parallaxNodesRef.current[11] = el;
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
                parallaxNodesRef.current[12] = el;
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
              const platformX = i * 1200 + 800;
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
        {level.environment !== "cyberpunk" && (<div className="absolute inset-0">
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
        </div>)}

        
        {/* CYBERPUNK SPECIFIC VISUALS */}
        {level.environment === "cyberpunk" && (
           <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
               {/* Matrix rain background */}
               <div className="absolute inset-0 opacity-40">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={`matrix-${i}`}
                        className="absolute font-mono text-emerald-500 text-sm overflow-hidden font-bold leading-none tracking-widest break-all"
                        style={{ top: 0, left: `${Math.random() * 100}%`, width: "20px", height: "100%", writingMode: "vertical-rl", textOrientation: "upright", textShadow: "0 0 5px #10b981" }}
                        animate={{ opacity: [0, 0.8, 0], y: ["-10%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 2 + Math.random() * 4, delay: Math.random() * 5, ease: "linear" }}
                    >
                        {"01<>/".repeat(15).split("").sort(() => Math.random() - 0.5).join("")}
                    </motion.div>
                  ))}
               </div>

               {/* Far Skyline (Parallaxed slowly via scale or CSS, we'll just auto pan it or use absolute CSS) */}
               <motion.div 
                 className="absolute bottom-[20vh] left-0 w-[400vw] h-[50vh] flex items-end flex-nowrap z-10"
                 animate={{ x: [0, -1000] }}
                 transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
               >
                 {[...Array(50)].map((_, i) => (
                     <div key={`b1-${i}`} className="relative flex-shrink-0 bg-[#0e0f1f] border-t border-l border-r border-[#1a1c36] shadow-[0_0_15px_rgba(139,92,246,0.1)_inset]" style={{ width: `${100 + Math.random() * 80}px`, height: `${Math.random() * 150 + (i % 5 === 0 ? 250 : 50)}px` }}>
                        {[...Array(Math.floor(Math.random() * 5))].map((_, j) => (
                           <div key={j} className="absolute bg-fuchsia-600/30 w-full h-1" style={{ top: `${20 + j * 30}px` }} />
                        ))}
                        {i % 7 === 0 && <div className="absolute top-0 right-2 w-1 h-8 bg-cyan-500/50 -translate-y-full" />}
                     </div>
                 ))}
               </motion.div>

               {/* Mid Skyline (Faster parallax) */}
               <motion.div 
                 className="absolute bottom-[100px] left-0 w-[600vw] h-[40vh] flex items-end flex-nowrap z-20"
                 animate={{ x: [0, -2000] }}
                 transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
               >
                 {[...Array(80)].map((_, i) => (
                    <div key={`b2-${i}`} className="relative flex-shrink-0 bg-[#121327] border-t border-[#312e81]" style={{ width: `${150 + Math.random() * 100}px`, height: `${Math.random() * 150 + 100}px` }}>
                       {i % 4 === 0 && <div className="absolute top-2 left-2 w-10 h-4 border border-cyan-400 bg-cyan-900/50 shadow-[0_0_10px_#22d3ee]" />}
                       {i % 5 === 0 && <div className="absolute top-10 right-0 w-20 h-6 border-y border-pink-500 bg-pink-900/40 shadow-[0_0_10px_#ec4899]" />}
                    </div>
                 ))}
               </motion.div>

               {/* Near Balconies & Humans Escaping */}
               <motion.div 
                 className="absolute bottom-[80px] left-0 w-[500vw] h-[30vh] flex items-end flex-nowrap z-30"
                 animate={{ x: [0, -2000] }}
                 transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
               >
                 {[...Array(30)].map((_, i) => (
                     <div key={`b3-${i}`} className="relative flex-shrink-0 bg-[#181a33] border-t-2 border-indigo-500 shadow-[0_-5px_20px_rgba(79,70,229,0.4)]" style={{ width: `${300 + Math.random() * 200}px`, height: `${60 + Math.random() * 80}px`, marginRight: `${Math.random() * 250 + 100}px` }}>
                         <div className="absolute top-0 inset-x-0 h-3 bg-indigo-900/80 border-b border-indigo-400/50" />
                         
                         {/* Humans escaping */}
                         {i % 2 === 0 && (
                            <motion.div 
                               className="absolute -top-12 left-0 flex items-end gap-3"
                               animate={{ x: [0, 600] }}
                               transition={{ repeat: Infinity, duration: 3 + Math.random() * 2, ease: "linear" }}
                            >
                               {/* Human 1 running */}
                               <div className="relative w-4 h-10 flex flex-col items-center">
                                  <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full mb-0.5" />
                                  <motion.div className="w-3 h-5 bg-sky-500 rounded-sm" animate={{ rotate: [-20, 20] }} transition={{ repeat: Infinity, duration: 0.15, repeatType: "mirror" }} />
                                  <div className="flex gap-[2px]">
                                     <motion.div className="w-1.5 h-4 bg-stone-800" animate={{ rotate: [-40, 40] }} transition={{ repeat: Infinity, duration: 0.15, repeatType: "mirror" }} />
                                     <motion.div className="w-1.5 h-4 bg-stone-800" animate={{ rotate: [40, -40] }} transition={{ repeat: Infinity, duration: 0.15, repeatType: "mirror" }} />
                                  </div>
                               </div>
                               
                               {/* Human 2 running */}
                               <div className="relative w-4 h-9 flex flex-col items-center">
                                  <div className="relative w-3.5 h-3.5 bg-rose-400 rounded-full mb-0.5"><div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-700 rounded-full" /></div>
                                  <motion.div className="w-3 h-4 bg-pink-500 rounded-sm" animate={{ rotate: [-20, 20] }} transition={{ repeat: Infinity, duration: 0.15, repeatType: "mirror" }} />
                                  <div className="flex gap-[2px]">
                                     <motion.div className="w-1.5 h-3 bg-stone-900" animate={{ rotate: [-40, 40] }} transition={{ repeat: Infinity, duration: 0.15, repeatType: "mirror" }} />
                                     <motion.div className="w-1.5 h-3 bg-stone-900" animate={{ rotate: [40, -40] }} transition={{ repeat: Infinity, duration: 0.15, repeatType: "mirror" }} />
                                  </div>
                               </div>
                               
                               {/* Child running */}
                               <div className="relative w-3 h-7 flex flex-col items-center">
                                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full mb-0.5" />
                                  <motion.div className="w-2 h-3 bg-white rounded-sm" animate={{ rotate: [-20, 20] }} transition={{ repeat: Infinity, duration: 0.1, repeatType: "mirror" }} />
                                  <div className="flex gap-[1px]">
                                     <motion.div className="w-1 h-2.5 bg-blue-800" animate={{ rotate: [-50, 50] }} transition={{ repeat: Infinity, duration: 0.1, repeatType: "mirror" }} />
                                     <motion.div className="w-1 h-2.5 bg-blue-800" animate={{ rotate: [50, -50] }} transition={{ repeat: Infinity, duration: 0.1, repeatType: "mirror" }} />
                                  </div>
                               </div>

                               <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.3 }} className="absolute -top-5 right-0 text-red-500 font-bold text-xs">!</motion.div>
                            </motion.div>
                         )}
                     </div>
                 ))}
               </motion.div>
               
               {/* Flying cars in background */}
               {[...Array(20)].map((_, i) => (
                 <motion.div
                   key={`car-${i}`}
                   className="absolute w-8 h-2.5 rounded-full blur-[1px] opacity-80"
                   style={{ top: `${Math.random() * 40 + 10}%`, backgroundColor: i % 2 === 0 ? '#38bdf8' : '#fb7185', boxShadow: i % 2 === 0 ? '0 0 15px #38bdf8' : '0 0 15px #fb7185' }}
                   animate={{ x: i % 2 === 0 ? ['100vw', '-20vw'] : ['-20vw', '100vw'] }}
                   transition={{ repeat: Infinity, duration: 3 + Math.random() * 6, ease: "linear", delay: Math.random() * 5 }}
                 >
                    <div className="absolute top-[1px] left-1 w-3 h-1.5 bg-white rounded-full opacity-90" />
                 </motion.div>
               ))}
           </div>
        )}

        {/* Midground: Layered Elements (Dunes, Flora, Mountains) */}
        {level.environment !== "cyberpunk" && (<div className="absolute inset-x-0 bottom-0 h-2/3 overflow-hidden pointer-events-none">
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
        </div>)}

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
