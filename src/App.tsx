import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  RotateCcw,
  Info,
  Sparkles,
  ArrowRight,
  MousePointer2,
  ChevronRight,
  Star,
  Brain,
} from "lucide-react";
import { LEVELS } from "./types";
import { LevelBackground } from "./components/LevelBackground";
import { GeminiRunner } from "./components/GeminiRunner";
import { Competitor, CompetitorType } from "./components/Competitor";
import { LevelPortal } from "./components/LevelPortal";
import { Dollar } from "./components/Dollar";
import { Flyer } from "./components/Flyer";
import { TokenProjectile } from "./components/Projectile";
import { TransitionGame } from "./components/TransitionGame";
import { cn } from "./lib/utils";

const GRAVITY = 0.4;
const JUMP_FORCE = -11;

type GameState = "menu" | "guide" | "interlevel" | "playing" | "gameover" | "complete";

const GuideAutoAdvance = ({ onComplete }: { onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(6);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  return (
    <div className="mt-8 flex flex-col items-center">
      <p className="text-white/40 text-sm mb-2">Auto-starting in {timeLeft}...</p>
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-white"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 6, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default function App() {
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [targetLevel, setTargetLevel] = useState(0);
  const [gameState, setGameState] = useState<GameState>("menu");

  // High-performance Physics (using Refs to skip React state lag during calculation)
  const playerXRef = useRef(100);
  const playerYRef = useRef(0);
  const velocityYRef = useRef(0);

  const [isJumping, setIsJumping] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isPortraitGameboy, setIsPortraitGameboy] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isL = w > h;
      
      const isMobileLandscape = isL && h < 500;
      const isMobilePortrait = !isL && w <= 768 && h > 500;
      
      let gameW = w;
      let gameH = h;
      let scaleBase = 1;
      let sidebarWidth = 0;

      if (isMobileLandscape) {
        gameH = h;
        scaleBase = Math.max(0.45, gameH / 750);
        const requiredSidebar = 105; 
        const maxW = w - (requiredSidebar * 2);
        const maxRatio = h * 1.8; 
        gameW = Math.min(maxW, maxRatio);
        sidebarWidth = (w - gameW) / 2;
      } else if (isMobilePortrait) {
        // Gameboy style: game at top, controls at bottom
        // Game takes a portion of the top screen
        gameW = w;
        const maxGameH = Math.min(h - 220, w * 1.3); // leaving at least 220px for controls
        gameH = maxGameH;
        scaleBase = Math.max(0.45, gameH / 750);
      } else {
        gameW = w;
        gameH = h;
        scaleBase = 1;
      }

      winWRef.current = gameW / scaleBase;
      winHRef.current = gameH / scaleBase;
      setIsLandscape(isL);
      setIsPortraitGameboy(isMobilePortrait);
      
      document.documentElement.style.setProperty("--mobile-scale", scaleBase.toString());
      document.documentElement.style.setProperty("--mobile-inv-scale", (1 / scaleBase).toString());
      document.documentElement.style.setProperty("--game-height-px", `${gameH}px`);
      document.documentElement.style.setProperty("--game-width-px", `${gameW}px`);
      document.documentElement.style.setProperty("--sidebar-width-px", `${sidebarWidth}px`);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isJumpingRef = useRef(false);
  const [isHit, setIsHit] = useState(false);
  const isHitRef = useRef(false);
  const [powerLevel, setPowerLevel] = useState(0);
  const powerLevelRef = useRef(0);
  const [dollarsCollected, setDollarsCollected] = useState(0);
  const [isFlying, setIsFlying] = useState(false);
  const isFlyingRef = useRef(false);
  const flyTimerRef = useRef(0);
  const [flyTimer, setFlyTimer] = useState(0);
  const [isTransforming, setIsTransforming] = useState(false);
  const isTransformingRef = useRef(false);
  const hasTransformedThisLevelRef = useRef(false);
  const deathSequenceRef = useRef(false);
  const [showDeathScreen, setShowDeathScreen] = useState(false);
  const screenshakeRef = useRef(0);
  const [screenshake, setScreenshake] = useState(0);
  const [isDizzy, setIsDizzy] = useState(false);
  const [isShooting, setIsShooting] = useState(false);
  const isShootingRef = useRef(false);

  const [isAbducting, setIsAbducting] = useState(false);
  const isAbductingRef = useRef(false);

  const [isMeteorCrash, setIsMeteorCrash] = useState(false);
  const isMeteorCrashRef = useRef(false);
  const [isShipOnFire, setIsShipOnFire] = useState(false);

  // Add state for persistent UFO in level 2
  const [ufoHoverY, setUfoHoverY] = useState(0);
  const ufoPhaseRef = useRef(0);

  const [enemies, setEnemies] = useState<
    {
      id: string;
      type: CompetitorType | "prompt";
      variant?: string;
      x: number;
      y: number;
      isDead: boolean;
      health: number;
      behavior: string;
      size: number;
      phase: number;
      text?: string;
    }[]
  >([]);
  const enemiesRef = useRef<any[]>([]);
  const [hasFarmer, setHasFarmer] = useState(false);
  const [hasProfessor, setProfessor] = useState(false);
  const profPhaseRef = useRef("idle");
  const [profPhase, setProfPhase] = useState("idle");
  const profTimerRef = useRef(0);
  const farmerTimerRef = useRef(0);
  const farmerPhaseRef = useRef("idle");
  const [farmerPhase, setFarmerPhase] = useState("idle");
  const [dollars, setDollars] = useState<
    { id: string; x: number; isCollected: boolean }[]
  >([]);
  const dollarsRef = useRef<{ id: string; x: number; isCollected: boolean }[]>([]);
  const [flyers, setFlyers] = useState<
    { id: string; x: number; isCollected: boolean }[]
  >([]);
  const flyersRef = useRef<{ id: string; x: number; isCollected: boolean }[]>([]);
  const [projectiles, setProjectiles] = useState<
    { id: string; x: number; y: number; tier: number }[]
  >([]);
  const projectilesRef = useRef<
    { id: string; x: number; y: number; tier: number }[]
  >([]);

  // Input State
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const requestRef = useRef<number | null>(null);

  const currentLevel = currentIdx >= 0 ? LEVELS[currentIdx] : null;
  const currentLevelRef = useRef<typeof currentLevel>(null);
  useEffect(() => {
    currentLevelRef.current = currentLevel;
  }, [currentLevel]);

  const startLevel = useCallback((idx: number) => {
    const level = LEVELS[idx];
    playerXRef.current = 100;
    playerYRef.current = 0;
    velocityYRef.current = 0;

    let hasF = level.enemySpawns.some((s) => s.variant === "farmer");
    const freshEnemies = level.enemySpawns.map((spawn, i) => {
      const isAI = spawn.type !== "prompt";
      // 25% chance of being a crazy running cow (except level 2)
      const isRandomCow =
        isAI &&
        Math.random() < 0.1 &&
        level.number !== 7 &&
        level.number !== 6 &&
        level.number !== 5 && level.number !== 10 && spawn.variant !== "helicopter";

      return {
        id: `${idx}-${i}`,
        type: spawn.type,
        variant: isRandomCow ? "cow" : spawn.variant,
        x: spawn.x,
        y:
          spawn.behavior === "fall" ||
          spawn.behavior === "bounce" ||
          spawn.type === "prompt"
            ? -500
            : spawn.behavior === "seeker"
              ? -300
              : spawn.y || 0,
        isDead: false,
        health: 2,
        behavior: isRandomCow ? "sprint" : spawn.behavior || "walk",
        size: spawn.size || 1,
        phase: Math.random() * 60,
        text: spawn.text,
      };
    });

    setHasFarmer(hasF);
    let hasP = level.enemySpawns.some((s) => s.variant === "professor");
    setProfessor(hasP);
    profTimerRef.current = 0;
    profPhaseRef.current = "idle";
    farmerTimerRef.current = 0;
    farmerPhaseRef.current = "idle";

    enemiesRef.current = freshEnemies;
    setEnemies(freshEnemies);

    const newDollars = level.dollarSpawns.map((x, i) => ({
      id: `${idx}-coin-${i}`,
      x: x,
      isCollected: false,
    }));
    dollarsRef.current = newDollars;
    setDollars(newDollars);

    const newFlyers = (level.flyerSpawns || []).map((x, i) => ({
      id: `${idx}-flyer-${i}`,
      x: x,
      isCollected: false,
    }));
    flyersRef.current = newFlyers;
    setFlyers(newFlyers);

    setProjectiles([]);
    setPowerLevel(0);
    powerLevelRef.current = 0;
    setDollarsCollected(0);
    if (level.number === 5) {
      isFlyingRef.current = true;
      setIsFlying(true);
      flyTimerRef.current = 99999;
      setFlyTimer(99999);
      playerYRef.current = -150;
    } else {
      setIsFlying(false);
      isFlyingRef.current = false;
      flyTimerRef.current = 0;
      setFlyTimer(0);
    }
    setIsHit(false);
    isHitRef.current = false;
    setIsJumping(false);
    isJumpingRef.current = false;
    isTransformingRef.current = false;
    hasTransformedThisLevelRef.current = level.number === 5; // Do not transform in level 5
    setIsTransforming(false);
    setIsAbducting(false);
    isAbductingRef.current = false;
    setIsMeteorCrash(false);
    isMeteorCrashRef.current = false;
    setGameState("interlevel");
    setTimeout(() => {
      setGameState("playing");
    }, 2000);
  }, []);

  const nextLevel = useCallback(() => {
    if (currentIdx < LEVELS.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      startLevel(nextIdx);
    } else {
      setGameState("complete");
    }
  }, [currentIdx, startLevel]);

  const gameStateRef = useRef<GameState>(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const nextLevelRef = useRef(nextLevel);
  useEffect(() => {
    nextLevelRef.current = nextLevel;
  }, [nextLevel]);

  const lastTimeRef = useRef<number>(0);
  const winWRef = useRef(window.innerWidth);
  const winHRef = useRef(window.innerHeight);

  const gameLoop = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    let dt = time - lastTimeRef.current;
    if (dt > 100) dt = 100; // Cap at 100ms so we don't go into slow-motion, but physics don't break too badly
    lastTimeRef.current = time;
    const timeScale = dt / 16.666;

    if (gameStateRef.current !== "playing" || !currentLevelRef.current) {
      if (gameStateRef.current === "interlevel" && currentLevelRef.current) {
        const isL = winWRef.current > winHRef.current;
        const groundY = 100;
        const camX = Math.max(0, playerXRef.current - (isL ? 1200 : winWRef.current) / 3);
        const worldEl = document.getElementById("game-world");
        if (worldEl) worldEl.style.transform = `translateX(${-camX}px)`;
        const playerEl = document.getElementById("player-wrapper");
        if (playerEl) {
          playerEl.style.left = `${playerXRef.current}px`;
          playerEl.style.bottom = `${groundY - playerYRef.current}px`;
        }
        
        const worldLevelFactor = currentLevelRef.current?.number === 1 ? 0.65 : 1.0;
        const eScaleMultiplier = (isL ? 0.85 : 0.95) * worldLevelFactor;
        enemiesRef.current.forEach((e: any) => {
          const el = document.getElementById("enemy-" + e.id);
          if (el) {
            el.style.left = `${e.x}px`;
            el.style.bottom = `${groundY - e.y}px`;
            el.style.transform = `scale(${(e.size || 1) * eScaleMultiplier}) ${e.behavior === "roll" ? `rotate(${e.phase}deg)` : ""}`;
          }
        });
        
        const ridingAnimalEl = document.getElementById("riding-animal");
        if (ridingAnimalEl) {
          ridingAnimalEl.style.left = `${playerXRef.current - 10}px`;
          ridingAnimalEl.style.bottom = `${groundY - playerYRef.current - 10}px`;
        }
        
        window.dispatchEvent(new CustomEvent("updateCamera", { detail: camX }));
      }
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    if (
      deathSequenceRef.current ||
      isTransformingRef.current ||
      isAbductingRef.current
    ) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // UFO persistent boss in Level 2
    if (currentLevelRef.current.number === 7 && !isAbductingRef.current) {
      ufoPhaseRef.current += 0.05 * timeScale;
      setUfoHoverY(Math.sin(ufoPhaseRef.current) * 15);
    }

    const isL = winWRef.current > winHRef.current;
    const gScale = isL ? Math.max(1, winWRef.current / 1200) : 1;
    const internalH = isL ? winHRef.current / gScale : winHRef.current;
    const baseSpeed = 3.0; // Universal base speed so time-to-complete is identical on mobile & desktop
    let nX = playerXRef.current + baseSpeed * timeScale;
    let nY = playerYRef.current;
    let nVY = velocityYRef.current;

    // Movement Input
    const rightPressed =
      keysPressed.current["ArrowRight"] ||
      keysPressed.current["KeyD"] ||
      keysPressed.current["d"] ||
      keysPressed.current["D"];
    const leftPressed =
      keysPressed.current["ArrowLeft"] ||
      keysPressed.current["KeyA"] ||
      keysPressed.current["a"] ||
      keysPressed.current["A"];

    if (rightPressed) {
      nX += (isFlyingRef.current ? 8 : 5) * timeScale;
    }
    if (leftPressed) {
      nX -= 4.5 * timeScale;
    }

    // Flight Logic
    if (isFlyingRef.current) {
      if (
        keysPressed.current["ArrowUp"] ||
        keysPressed.current["KeyW"] ||
        keysPressed.current["Space"] ||
        keysPressed.current["ShiftLeft"] ||
        keysPressed.current["ShiftRight"] ||
        keysPressed.current["TouchJump"]
      ) {
        nVY = -8.5 * timeScale;
      } else if (
        keysPressed.current["ArrowDown"] ||
        keysPressed.current["KeyS"]
      ) {
        nVY = 8.5 * timeScale;
      } else {
        nVY *= Math.pow(0.88, timeScale);
      }
      nY += nVY * timeScale;

      const skyLimit = -(internalH - (isL ? 160 : 200));
      if (nY < skyLimit) {
        nY = skyLimit;
        nVY = 0;
      }
      if (nY > 0) nY = 0;

      if (currentLevelRef.current?.number !== 5) {
        flyTimerRef.current -= 1 * timeScale;
        if (flyTimerRef.current <= 0) {
          setIsFlying(false);
          isFlyingRef.current = false;
          flyTimerRef.current = 0;
        }
      }
      // Sync flight timer to UI occasionally
      if (Math.floor(flyTimerRef.current) % 30 === 0)
        setFlyTimer(Math.floor(flyTimerRef.current));
    } else {
      // Jump Logic
      if (
        (keysPressed.current["Space"] ||
          keysPressed.current["ArrowUp"] ||
          keysPressed.current["KeyW"] ||
          keysPressed.current["TouchJump"]) &&
        !isJumpingRef.current
      ) {
        nVY = JUMP_FORCE;
        setIsJumping(true);
        isJumpingRef.current = true;
      }

      nVY += GRAVITY * timeScale;
      nY += nVY * timeScale;
    }

    // Floor & Platform Collision
    let grounded = false;
    if (nY >= 0) {
      nY = 0;
      nVY = 0;
      grounded = true;
    }

    currentLevelRef.current.platforms.forEach((plat) => {
      if (
        nVY > 0 &&
        nX + 40 > plat.x &&
        nX < plat.x + plat.width &&
        playerYRef.current <= -plat.y &&
        nY >= -plat.y
      ) {
        nY = -plat.y;
        nVY = 0;
        grounded = true;
      }
    });

    if (grounded) {
      setIsJumping(false);
      isJumpingRef.current = false;
    }

    // Enemy Collision
    let hit = false;
    let stomp = false;
    let stompedId = "";

    const nextEnemies = enemiesRef.current.map((e) => {
      if (e.isDead) return e;

      let speedMult = 1;
      let newEy = e.y || 0;
      let newPhase = e.phase || 0;

      // Behavior Logic
      if (e.variant === "farmer" && currentLevelRef.current?.number !== 1) {
        if (Math.abs(nX - e.x) < 950) {
          newPhase += 1 * timeScale;
        }
        if (newPhase < 120) {
          speedMult = 0;
        } else if (newPhase >= 120 && newPhase < 150) {
          speedMult = 0; // Winding up / throwing
        } else {
          speedMult = 0.6; // Walk
        }
      } else if (e.behavior === "roll") {
        speedMult = 1.9;
        newPhase += 15 * timeScale;
      } else if (e.behavior === "idle") {
        speedMult = 0;
      } else if (e.behavior === "sprint") {
        speedMult = Math.sin(Date.now() / 400) > 0 ? 3 : 0.5;
      } else if (e.behavior === "back") {
        speedMult = -2;
      } else if (e.behavior === "thrown") {
        speedMult = 6 + (e.size || 1) - 1.8; // Different speeds based on size
      } else if (e.behavior === "seeker") {
        speedMult = 1.6;
      } else if (e.behavior === "laser") {
        speedMult = 7;
      }

      // World 5: track phase for per-UFO timed laser shots
      if (currentLevelRef.current?.number === 5 && e.variant === "ufo") {
        newPhase += 1 * timeScale;
      }
      // World 6: track phase for per-alien timed laser shots
      // World 4: track phase for fish/octopus/jellyfish enemies to shoot
      if (
        (currentLevelRef.current?.number === 6 && e.variant === "alien") ||
        (currentLevelRef.current?.number === 4 && (e.variant === "normal" || e.variant === "fish" || e.variant === "octopus" || e.variant === "jellyfish"))
      ) {
        newPhase += 1 * timeScale;
      }

      let newEx = e.x - 1.3 * speedMult * timeScale;

      // Vertical Logic
      if (e.behavior === "laser") {
        // lasers fly straight — no vertical movement
      } else if (
        e.behavior === "fall_slow" ||
        e.behavior === "fall" ||
        e.type === "prompt"
      ) {
        const threshold = e.behavior === "fall_slow" ? 1200 : 900;
        if (Math.abs(nX - e.x) < threshold && newEy < -10) {
          newEy += (e.behavior === "fall_slow" ? 4 : 16) * timeScale;
          if (newEy > 0) newEy = 0;
        }
      } else if (e.behavior === "bounce") {
        const isW3Ufo =
          (currentLevelRef.current?.number === 5 ||
            currentLevelRef.current?.number === 6) &&
          e.variant === "ufo";
        const floorY = isW3Ufo ? -80 : 0;
        if (Math.abs(nX - e.x) < 700 && newEy < floorY - 10) {
          newEy += 12 * timeScale;
          if (newEy > floorY) newEy = floorY;
        }
        if (newEy >= floorY) {
          const eid = parseInt(e.id.split("-").pop() || "0");
          newEy = isW3Ufo
            ? Math.sin(Date.now() / 380 + eid * 1.3) * 90 - 180 // float 80–260px above ground
            : Math.sin(Date.now() / 200) * 80 - 80;
        }
      } else if (e.behavior === "thrown" && newEy < 0) {
        newEy += 7 * timeScale;
        if (newEy > 0) newEy = 0;
      } else if (e.behavior === "seeker") {
        // Slowly track Gemini Y
        if (Math.abs(nX - e.x) < 800) {
          // Only start tracking when relatively close
          const targetY = e.variant === "helicopter" ? nY - 200 : nY;
          if (newEy > targetY + 10) newEy -= 1.5 * timeScale;
          else if (newEy < targetY - 10) newEy += 1.5 * timeScale;
        }
      }

      const lscale = isL ? 1.05 : 1;
      const eScaleMultiplier = isL ? 0.85 : 0.95;
      const pScale =
        (isFlyingRef.current
          ? 0.9
          : powerLevelRef.current === 2
            ? 1.0
            : powerLevelRef.current === 1
              ? 1.0
              : 0.8) * lscale;
      const pCx = nX + 24;
      const pCy = nY - 28;
      // Hitbox slightly inset from visual boundaries to be forgiving
      const pLeft = pCx - 12 * pScale;
      const pRight = pCx + 12 * pScale;
      const pTop = pCy - 20 * pScale;
      const pBottom = pCy + 28 * pScale;

      const eSize = (e.size || 1) * eScaleMultiplier;
      let eLeft, eRight, eTop, eBottom;

      if (e.type === "prompt") {
        // Prompt is a wide label
        eLeft = newEx;
        eRight = newEx + 140 * eSize;
        eTop = newEy - 40 * eSize;
        eBottom = newEy;
      } else {
        const eCx = newEx + 24;
        const eCy = newEy - 28;
        // Give forgiving hitboxes for enemies
        eLeft = eCx - 12 * eSize;
        eRight = eCx + 12 * eSize;
        eTop = eCy - 20 * eSize;
        eBottom = eCy + 28 * eSize;
      }

      const intersectX = pLeft < eRight && pRight > eLeft;
      const intersectY = pTop < eBottom && pBottom > eTop;

      if (
        intersectX &&
        intersectY &&
        !isFlyingRef.current &&
        !deathSequenceRef.current &&
        !isHitRef.current &&
        e.variant !== "farmer" &&
        e.variant !== "professor" &&
        currentLevelRef.current?.number !== 1 // Celebration Level: No Hits!
      ) {
        // Fix stomp: Check if the player was above the enemy in the previous frame
        const wasAboveIt = nY - nVY < eTop + 24;
        if (nVY > 0 && wasAboveIt) {
          stomp = true;
          stompedId = e.id;
        } else if (
          !(currentLevelRef.current?.number === 8 && e.type === "prompt")
        ) {
          // Harmless prompts in world 8 (farm)
          hit = true;
        }
      }

      // Clamp Enemy Y to prevent overflow
      const enemySkyLimit = -(internalH - (isL ? 180 : 240));
      if (newEy < enemySkyLimit) newEy = enemySkyLimit;

      return { ...e, x: newEx, y: newEy, phase: newPhase };
    });

    const notStaleThrown = (e: { behavior: string; x: number }) =>
      !(e.behavior === "thrown" && e.x < nX - 1200);
    const notStaleLaser = (e: { behavior: string; x: number }) =>
      !(e.behavior === "laser" && e.x < nX - 150);
    if (stomp) {
      enemiesRef.current = nextEnemies
        .map((u: any) => (u.id === stompedId ? { ...u, isDead: true } : u))
        .filter(notStaleThrown)
        .filter(notStaleLaser);
      nVY = JUMP_FORCE * 0.7;
      screenshakeRef.current = 10;
      setEnemies(enemiesRef.current);
    } else {
      enemiesRef.current = nextEnemies
        .filter(notStaleThrown)
        .filter(notStaleLaser);
    }

    // World 5: each UFO fires every ~180 frames (~3s, phase-based)
    if (currentLevelRef.current?.number === 5) {
      enemiesRef.current.forEach((e: any) => {
        if (
          !e.isDead &&
          e.variant === "ufo" &&
          e.phase >= 180 &&
          Math.abs(nX - e.x) > 80 &&
          Math.abs(nX - e.x) < 700
        ) {
          e.phase = 0;
          enemiesRef.current.push({
            id: `laser-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: e.type,
            variant: "enemy_laser",
            x: e.x - 10,
            y: e.y - 10,
            isDead: false,
            health: 1,
            behavior: "laser",
            size: 0.7,
            phase: 0,
          });
        }
      });
    }

    // World 6/4: each soldier fires every ~180 frames (phase-based, ~3s)
    if (currentLevelRef.current?.number === 6 || currentLevelRef.current?.number === 4) {
      enemiesRef.current.forEach((e: any) => {
        const isShooter = 
          (currentLevelRef.current?.number === 6 && e.variant === "alien") ||
          (currentLevelRef.current?.number === 4 && (e.variant === "normal" || e.variant === "fish" || e.variant === "octopus" || e.variant === "jellyfish"));

        if (
          !e.isDead &&
          isShooter &&
          e.phase >= 180 &&
          Math.abs(nX - e.x) > 80 &&
          Math.abs(nX - e.x) < 700
        ) {
          e.phase = 0;
          enemiesRef.current.push({
            id: `laser-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: e.type,
            variant: "enemy_laser",
            x: e.x - 10,
            y: e.y - 20,
            isDead: false,
            health: 1,
            behavior: "laser",
            size: 0.7,
            phase: 0,
          });
        }
      });
    }

    // Global Farmer Logic
    const _prevFarmerPhase = farmerPhaseRef.current;
    if (
      currentLevelRef.current?.enemySpawns?.some((s) => s.variant === "farmer") && currentLevelRef.current?.number !== 1
    ) {
      farmerTimerRef.current += timeScale;
      const ft = farmerTimerRef.current;
      // 2 second loop (120 frames)
      // 0-60: Idle
      // 60-110: Wind-up (Shaking)
      // 110-120: Throw
      if (ft >= 60 && ft < 110) {
        farmerPhaseRef.current = "throwing"; // Using this for the wind-up/shake state
      } else if (ft >= 110 && ft < 120) {
        // Actual throw event — use threshold crossing to survive variable timeScale
        if (ft >= 110 && ft - timeScale < 110) {
          const types = ["gpt", "claude", "copilot"];
          const variants = ["pig", "cow", "sheep"];

          // Spawn from tractor position — bottom-right, low arc
          const throwCamX = Math.max(
            0,
            nX - (isL ? 1200 : winWRef.current) / 3,
          );
          const baseX = throwCamX + winWRef.current - 100;
          const baseY = -160;

          enemiesRef.current.push({
            id: `thrown-${Date.now()}-1`,
            type: types[Math.floor(Math.random() * types.length)] as any,
            variant: variants[
              Math.floor(Math.random() * variants.length)
            ] as any,
            behavior: "thrown",
            x: baseX,
            y: baseY,
            size: 1.6,
            health: 1,
            isDead: false,
            phase: 0,
          });
          setEnemies([...enemiesRef.current]);
        }
      } else if (ft >= 120) {
        farmerTimerRef.current = 0;
        farmerPhaseRef.current = "idle";
      } else {
        farmerPhaseRef.current = "idle";
      }
    }
    if (farmerPhaseRef.current !== _prevFarmerPhase)
      setFarmerPhase(farmerPhaseRef.current);

    const _prevProfPhase = profPhaseRef.current;
    if (
      currentLevelRef.current?.enemySpawns?.some(
        (s) => s.variant === "professor",
      ) && currentLevelRef.current?.number !== 1
    ) {
      profTimerRef.current += timeScale;
      const pt = profTimerRef.current;
      if (pt >= 60 && pt < 110) {
        profPhaseRef.current = "throwing";
      } else if (pt >= 110 && pt < 120) {
        if (pt >= 110 && pt - timeScale < 110) {
          const variants = ["flask", "wrench", "gadget"];
          const throwCamX = Math.max(
            0,
            nX - (isL ? 1200 : winWRef.current) / 3,
          );
          const baseX = throwCamX + winWRef.current - 100;
          const baseY = -160;

          enemiesRef.current.push({
            id: `thrown-${Date.now()}-2`,
            type: "gpt",
            variant: variants[
              Math.floor(Math.random() * variants.length)
            ] as any,
            behavior: "thrown",
            x: baseX,
            y: baseY,
            size: 1.4,
            health: 1,
            isDead: false,
            phase: 0,
          });
          setEnemies([...enemiesRef.current]);
        }
      } else if (pt >= 120) {
        profTimerRef.current = 0;
        profPhaseRef.current = "idle";
      } else {
        profPhaseRef.current = "idle";
      }
    }
    if (profPhaseRef.current !== _prevProfPhase)
      setProfPhase(profPhaseRef.current);

    // Direct DOM update for enemies
    const groundY = 100;
    const isW2 = currentLevelRef.current?.number === 7;
    const worldLevelFactor = currentLevelRef.current?.number === 1 ? 0.65 : 1.0;
    const eScaleMultiplier = (isL ? 0.85 : 0.95) * worldLevelFactor;
    enemiesRef.current.forEach((e: any) => {
      const el = document.getElementById("enemy-" + e.id);
      if (el) {
        el.style.left = `${e.x}px`;
        el.style.bottom = `${groundY - e.y}px`;
        el.style.transform = `scale(${(e.size || 1) * eScaleMultiplier}) ${e.behavior === "roll" ? `rotate(${e.phase}deg)` : ""}`;
      }
    });

    if (hit && !deathSequenceRef.current && !isHitRef.current) {
      if (isFlyingRef.current) {
        // Lose flight first
        setIsFlying(false);
        isFlyingRef.current = false;
        flyTimerRef.current = 0;
        setIsHit(true);
        isHitRef.current = true;
        screenshakeRef.current = 25;
        setTimeout(() => {
          setIsHit(false);
          isHitRef.current = false;
        }, 1500);
      } else if (powerLevelRef.current > 0) {
        // Lose power level
        const nextPower = powerLevelRef.current - 1;
        setPowerLevel(nextPower);
        powerLevelRef.current = nextPower;
        setIsHit(true);
        isHitRef.current = true;
        screenshakeRef.current = 25;
        setTimeout(() => {
          setIsHit(false);
          isHitRef.current = false;
        }, 1500);
      } else {
        // No power level? Immediate death
        deathSequenceRef.current = true;
        setShowDeathScreen(true);
        screenshakeRef.current = 60;
        setIsDizzy(true);
        setTimeout(() => {
          setGameState("gameover");
          deathSequenceRef.current = false;
          setShowDeathScreen(false);
          setIsDizzy(false);
        }, 3000);
        return;
      }
    }

    // Collectibles
    let dollarCollectedCount = 0;
    {
      let changed = false;
      const next = dollarsRef.current.map((d: { id: string; x: number; isCollected: boolean }) => {
        if (!d.isCollected && Math.abs(nX - d.x) < 70 && Math.abs(nY) < 70) {
          changed = true;
          dollarCollectedCount += 1;
          screenshakeRef.current = 5;
          return { ...d, isCollected: true };
        }
        return d;
      });
      if (changed) {
        dollarsRef.current = next;
        setDollars(next);
      }
    }

    if (dollarCollectedCount > 0) {
      setDollarsCollected((curr) => curr + dollarCollectedCount);
      const newPower = Math.min(
        2,
        powerLevelRef.current + dollarCollectedCount,
      );
      if (powerLevelRef.current !== newPower) {
        setPowerLevel(newPower);
        powerLevelRef.current = newPower;
      }
    }

    {
      let changed = false;
      const next = flyersRef.current.map((f: { id: string; x: number; isCollected: boolean }) => {
        // Must jump to collect (nY must be sufficiently high)
        if (!f.isCollected && Math.abs(nX - f.x) < 80 && nY < -80) {
          changed = true;
          if (!hasTransformedThisLevelRef.current) {
            hasTransformedThisLevelRef.current = true;
            setIsTransforming(true);
            isTransformingRef.current = true;
            screenshakeRef.current = 20;
            setTimeout(() => {
              setIsFlying(true);
              isFlyingRef.current = true;
              flyTimerRef.current = 360;
              setFlyTimer(360);
              setIsTransforming(false);
              isTransformingRef.current = false;
            }, 2000);
          } else {
            // Already transformed, just give flight time
            setIsFlying(true);
            isFlyingRef.current = true;
            flyTimerRef.current = Math.max(flyTimerRef.current, 360);
            setFlyTimer(Math.max(flyTimerRef.current, 360));
          }
          return { ...f, isCollected: true };
        }
        return f;
      });
      if (changed) {
        flyersRef.current = next;
        setFlyers(next);
      }
    }

    const movedProjectiles = projectilesRef.current.map((p) => ({
      ...p,
      x: p.x + 22 * timeScale,
    }));
    const deadIds = new Set<string>();
    let eChanged = false;

    const uEnemies = enemiesRef.current.map((e) => {
      if (e.isDead || currentLevelRef.current?.number === 1) return e;
      const bHit = movedProjectiles.find(
        (p) =>
          !deadIds.has(p.id) &&
          Math.abs(p.x - e.x) < 90 &&
          Math.abs(p.y - e.y) < 90,
      );
      if (bHit) {
        deadIds.add(bHit.id);
        eChanged = true;
        return { ...e, isDead: true };
      }
      return e;
    });

    if (eChanged) {
      enemiesRef.current = uEnemies;
      setEnemies(uEnemies); // re-render when an enemy dies
    }

    const uncollided = movedProjectiles.filter(
      (p) => !deadIds.has(p.id) && p.x < playerXRef.current + 1200,
    );
    // Update DOM directly for projectiles
    uncollided.forEach((p) => {
      const el = document.getElementById("proj-" + p.id);
      if (el) el.style.left = `${p.x}px`;
    });

    if (uncollided.length !== projectilesRef.current.length) {
      setProjectiles(uncollided);
    }
    projectilesRef.current = uncollided;

    if (nX >= currentLevelRef.current.worldLength - 120) {
      if (currentLevelRef.current.number === 7 && !isAbductingRef.current) {
        setIsAbducting(true);
        isAbductingRef.current = true;
        setTimeout(() => {
          nextLevelRef.current();
        }, 4500);
        return;
      }
      if (currentLevelRef.current.number === 5 && !isMeteorCrashRef.current) {
        setIsMeteorCrash(true);
        isMeteorCrashRef.current = true;

        // 🔥 Fase 2: fuego en la nave
        setTimeout(() => {
          setIsShipOnFire(true);
        }, 2000);

        // ⏭ Fase 3: avanzar de nivel
        setTimeout(() => {
          nextLevelRef.current();

          // 👉 RESET (MUY IMPORTANTE)
          setIsMeteorCrash(false);
          setIsShipOnFire(false);
          isMeteorCrashRef.current = false;
        }, 4500);

        return;
      }

      if (
        currentLevelRef.current.number !== 7 &&
        currentLevelRef.current.number !== 5
      ) {
        console.log(
          `Reaching end of world: ${currentLevelRef.current.number}, nX: ${nX}, worldLength: ${currentLevelRef.current.worldLength}`,
        );
        nextLevelRef.current();
        return;
      }
    }

    playerXRef.current = nX;
    playerYRef.current = nY;
    velocityYRef.current = nVY;

    // Direct DOM update for camera and player instead of setRenderState
    const camX = Math.max(
      0,
      playerXRef.current - (isL ? 1200 : winWRef.current) / 3,
    );
    const worldEl = document.getElementById("game-world");
    if (worldEl) worldEl.style.transform = `translateX(${-camX}px)`;

    const playerEl = document.getElementById("player-wrapper");
    if (playerEl) {
      playerEl.style.left = `${nX}px`;
      playerEl.style.bottom = `${groundY - nY}px`;
    }

    const ridingAnimalEl = document.getElementById("riding-animal");
    if (ridingAnimalEl) {
      ridingAnimalEl.style.left = `${nX - 10}px`;
      ridingAnimalEl.style.bottom = `${groundY - nY - 10}px`;
    }

    const fighterShipEl = document.getElementById("fighter-ship");
    if (fighterShipEl) {
      fighterShipEl.style.left = `${nX - 40}px`;
      fighterShipEl.style.bottom = `${groundY - nY - 8}px`;
    }

    const progEl = document.getElementById("progress-bar");
    if (progEl) {
      progEl.style.width = `${(nX / currentLevelRef.current.worldLength) * 100}%`;
    }

    window.dispatchEvent(new CustomEvent("updateCamera", { detail: camX }));

    if (screenshakeRef.current > 0) {
      screenshakeRef.current -= 1;
      if (screenshakeRef.current % 2 === 0)
        setScreenshake(screenshakeRef.current);
    } else {
      if (screenshake !== 0) setScreenshake(0);
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const triggerJump = () => {
    if (gameState !== "playing" || isTransforming || deathSequenceRef.current)
      return;
    if (isFlying) return;

    if (!isJumpingRef.current) {
      velocityYRef.current = JUMP_FORCE;
      setIsJumping(true);
      isJumpingRef.current = true;
    }
  };

  // Handle Mouse/Touch jump
  const handleInteraction = (
    e: React.MouseEvent | React.TouchEvent | React.PointerEvent,
  ) => {
    // Ignore if touching a UI button
    if (
      (e.target as HTMLElement).tagName === "BUTTON" ||
      (e.target as HTMLElement).closest("button")
    ) {
      return;
    }

    if (currentIdx === 3 || currentIdx === 4 || currentIdx === 5 || currentIdx === 6 || currentIdx === 7) {
      // El Oeste / Nave Alien / Galaxia / Océano Cyber / Cementerio Caótico
      shootRef.current();
    } else {
      triggerJump();
    }
  };

  const shoot = useCallback(() => {
    if (gameState !== "playing") return;

    const isShooterLevel =
      currentLevelRef.current?.number === 7 ||
      currentLevelRef.current?.number === 6 ||
      currentLevelRef.current?.number === 5 ||
      currentLevelRef.current?.number === 4;
    if (!isShooterLevel && powerLevelRef.current === 0) return;

    if (isShootingRef.current) return; // Debounce
    setIsShooting(true);
    isShootingRef.current = true;
    setTimeout(() => {
      setIsShooting(false);
      isShootingRef.current = false;
    }, 150);

    const bulletId = `bullet-${Date.now()}`;
    const newBullet = {
      id: bulletId,
      x: playerXRef.current + 50,
      y: playerYRef.current - 35,
      tier: isShooterLevel ? 1 : powerLevelRef.current,
    };
    projectilesRef.current.push(newBullet);
    setProjectiles([...projectilesRef.current]);
  }, [gameState]);

  useEffect(() => {
    if (gameState === "playing" || gameState === "interlevel") {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, gameLoop]);

  const shootRef = useRef(shoot);
  useEffect(() => {
    shootRef.current = shoot;
  }, [shoot]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Comprehensive preventDefault for ALL game keys to stop scrolling
      const gameKeys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        " ",
        "w",
        "a",
        "s",
        "d",
        "W",
        "A",
        "S",
        "D",
      ];
      const gameCodes = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Space",
        "KeyW",
        "KeyA",
        "KeyS",
        "KeyD",
      ];

      if (gameKeys.includes(e.key) || gameCodes.includes(e.code)) {
        if (
          gameStateRef.current === "playing" ||
          gameStateRef.current === "interlevel"
        ) {
          e.preventDefault();
        }
      }

      keysPressed.current[e.code] = true;
      keysPressed.current[e.key] = true;

      if (["KeyF", "KeyZ", "KeyX", "Period", "Enter"].includes(e.code)) {
        shootRef.current();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
      keysPressed.current[e.key] = false;
    };
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleStart = () => {
    setTargetLevel(0);
    setGameState("guide");
  };

  const handleReset = () => {
    setCurrentIdx(-1);
    setIsDizzy(false);
    deathSequenceRef.current = false;
    setShowDeathScreen(false);
    setGameState("menu");
  };

  const handleJumpToLevel = (idx: number) => {
    setTargetLevel(idx);
    setGameState("guide");
  };

  const proceedFromGuide = useCallback(() => {
    setCurrentIdx(targetLevel);
    startLevel(targetLevel);
    setTimeout(() => {
      document.getElementById("game-container")?.focus();
    }, 100);
  }, [targetLevel, startLevel]);

  const cameraX = Math.max(
    0,
    playerXRef.current - (isLandscape ? 1200 : window.innerWidth) / 3,
  );
  const shakeX = (Math.random() - 0.5) * screenshake;
  const shakeY = (Math.random() - 0.5) * screenshake;

  return (
    <main
      id="game-container"
      tabIndex={0}
      className={cn(
        "fixed w-screen h-[100dvh] inset-0 bg-[#050505] text-white font-sans overflow-hidden select-none focus:outline-none flex items-center",
        isPortraitGameboy ? "flex-col justify-start" : "justify-center",
        gameState === "playing" ? "touch-none" : "touch-auto"
      )}
      onPointerDown={handleInteraction}
      style={{
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <div 
        style={{
          transform: `scale(var(--mobile-scale, 1))`,
          transformOrigin: isPortraitGameboy ? 'top center' : 'center',
          width: `calc(var(--game-width-px, 100%) * var(--mobile-inv-scale, 1))`,
          height: `calc(var(--game-height-px, 100dvh) * var(--mobile-inv-scale, 1))`,
          position: 'relative'
        }}
      >
        
      {/* Game Rendering Area */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          style={{ width: "100%", height: "100%" }}
          className="relative overflow-hidden pointer-events-auto"
        >
          {/* Background Parallax */}
          {currentLevel && gameState !== "complete" && gameState !== "menu" && <LevelBackground level={currentLevel} />}

          {/* World Elements */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {currentLevel &&
              gameState !== "menu" &&
              gameState !== "complete" && (
                <div
                  id="game-world"
                  className="absolute inset-0 will-change-transform"
                  style={{ transform: `translateX(${-cameraX}px)` }}
                >
                  {/* The Level Portal */}
                  <div
                    className="absolute flex flex-col items-center -translate-x-1/2 select-none"
                    style={{
                      bottom: `100px`,
                      left: `${currentLevel.worldLength}px`,
                    }}
                  >
                    <LevelPortal
                      currentLevelNumber={currentLevel.number}
                      targetNumber={
                        gameState === "interlevel"
                          ? currentLevel.number - 1
                          : currentIdx < LEVELS.length - 1
                            ? LEVELS[currentIdx + 1].number
                            : 1
                      }
                    />
                  </div>

                  {/* Platforms */}
                  {currentLevel.platforms.map((plat, i) => {
                    const isEnergyFence = ["nebula", "void", "star"].includes(
                      currentLevel.environment,
                    );
                    const isTechDeck = ["ship", "graveyard"].includes(
                      currentLevel.environment,
                    );

                    return (
                      <div
                        key={`plat-${i}`}
                        className={`absolute ${isEnergyFence ? "flex items-center justify-center" : "rounded-sm overflow-hidden"} ${
                          isTechDeck
                            ? "bg-zinc-800 border-t-2 border-b-4 border-b-zinc-950 border-t-cyan-400 shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                            : isEnergyFence
                              ? ""
                              : "bg-white/20 border-t-4 border-white/40"
                        }`}
                        style={{
                          left: `${plat.x}px`,
                          bottom: `${100 + plat.y}px`,
                          width: `${plat.width}px`,
                          height: "40px",
                        }}
                      >
                        {isTechDeck && (
                          <>
                            <div className="absolute top-1 inset-x-2 h-px bg-cyan-400/40" />
                            <div className="absolute bottom-1.5 inset-x-0 h-1.5 bg-black/80 border-y border-zinc-700/50" />
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
                            <div className="absolute w-full top-0 h-3 bg-cyan-500/10" />
                            <div className="absolute inset-x-4 top-3 flex justify-between opacity-50">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_5px_#22d3ee]" />
                              <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_5px_#22d3ee]" />
                            </div>
                          </>
                        )}

                        {isEnergyFence && (
                          <div className="relative w-full h-full flex flex-col justify-center">
                            <div 
                              className={cn(
                                "absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee]",
                                currentLevel.number === 1 && "bg-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                              )} 
                            />
                            <div
                              className={cn(
                                "absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-cyan-500/20 shadow-[0_0_20px_#22d3ee_inset]",
                                currentLevel.number === 1 && "bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.2)_inset]"
                              )}
                              style={{
                                backgroundImage:
                                  currentLevel.number === 1 
                                    ? "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(34,211,238,0.1) 10px, rgba(34,211,238,0.1) 12px)"
                                    : "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(34,211,238,0.3) 10px, rgba(34,211,238,0.3) 12px)",
                              }}
                            />
                            <div className={cn(
                              "absolute left-0 top-0 bottom-0 w-3 bg-zinc-800 rounded-full border border-cyan-400 z-10 shadow-[0_0_10px_#22d3ee]",
                              currentLevel.number === 1 && "bg-zinc-800/40 border-cyan-400/20 shadow-none"
                            )} />
                            <div className={cn(
                              "absolute right-0 top-0 bottom-0 w-3 bg-zinc-800 rounded-full border border-cyan-400 z-10 shadow-[0_0_10px_#22d3ee]",
                              currentLevel.number === 1 && "bg-zinc-800/40 border-cyan-400/20 shadow-none"
                            )} />
                          </div>
                        )}

                        {!isTechDeck && !isEnergyFence && (
                          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                        )}
                      </div>
                    );
                  })}

                  {/* Small Flyer Powerups */}
                  {flyers.map(
                    (f) =>
                      !f.isCollected &&
                      !isFlying && (
                        <Flyer
                          key={f.id}
                          x={f.x}
                          y={f.y || -60}
                          isLandscape={isLandscape}
                        />
                      ),
                  )}

                  {/* Dollars */}
                  {dollars.map(
                    (dollar) =>
                      !dollar.isCollected && (
                        <Dollar
                          key={dollar.id}
                          x={dollar.x}
                          isLandscape={isLandscape}
                        />
                      ),
                  )}

                  {/* Projectiles */}
                  {projectilesRef.current.map((p) => (
                    <TokenProjectile
                      id={p.id}
                      key={p.id}
                      x={p.x}
                      y={120 - p.y}
                      tier={p.tier}
                      variant={currentIdx === 3 ? "google" : "normal"}
                    />
                  ))}

                  {/* Muzzle Flash for Cowboy / Space Gemini */}
                  {isShooting &&
                    (currentIdx === 3 ||
                      currentIdx === 4 ||
                      currentIdx === 5 ||
                      currentIdx === 7) && (
                      <motion.div
                        initial={{ opacity: 1, scale: 0.5 }}
                        animate={{ opacity: 0, scale: 1.5 }}
                        className="absolute z-50 w-8 h-8 bg-yellow-400 rounded-full blur-md"
                        style={{
                          left: `${playerXRef.current + 70}px`,
                          bottom: `${100 - playerYRef.current + 30}px`,
                        }}
                      />
                    )}

                  {/* Competitors Group */}
                  {enemiesRef.current.map(
                    (enemy) =>
                      !enemy.isDead &&
                      (enemy.variant !== "farmer" || currentIdx === 9 || currentIdx === 2) &&
                      (enemy.variant !== "professor" || currentIdx === 9 || currentIdx === 0) && (
                        <div
                          id={`enemy-${enemy.id}`}
                          key={enemy.id}
                          className="absolute z-60 will-change-transform"
                          style={{
                            left: `${enemy.x}px`,
                            bottom: `${100 - enemy.y}px`,
                            transform: `scale(${(enemy.size || 1) * (isLandscape ? 0.85 : 0.95) * (currentIdx === 9 ? 0.65 : 1.0)}) ${enemy.behavior === "roll" ? `rotate(${enemy.phase}deg)` : ""}`,
                            transformOrigin: "bottom",
                            filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.9))",
                          }}
                        >
                          {currentIdx === 9 && !enemy.isDead && (
                            <motion.div 
                              className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center select-none pointer-events-none drop-shadow-[0_0_10px_rgba(255,0,100,0.8)]"
                              animate={{ 
                                scale: [1, 1.3, 1],
                                y: [0, -5, 0]
                              }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              <div className="text-3xl text-pink-500">❤️</div>
                            </motion.div>
                          )}
<Competitor
  type={enemy.type}
                            action={
                              enemy.variant === "farmer" &&
                              enemy.phase >= 120 &&
                              enemy.phase < 150
                                ? "throwing"
                                : currentLevel.coyoteAction
                            }
                            isMoving={true}
                            behavior={enemy.behavior}
                            text={enemy.text}
                            variant={
                              enemy.variant
                                ? enemy.variant
                                : currentLevel.environment === "graveyard"
                                  ? "zombie"
                                  : currentLevel.environment === "moon"
                                      ? "werewolf"
                                      : currentLevel.environment === "water"
                                        ? "fish"
                                        : currentLevel.environment === "nebula"
                                          ? "ufo"
                                          : currentLevel.environment === "void"
                                            ? "ufo"
                                            : "normal"
                            }
                            facing={
                              enemy.variant === "horse" ||
                              enemy.variant === "native_rider"
                                ? "left"
                                : "right"
                            }
                          />
                        </div>
                      ),
                  )}

                  {/* World 7: Horse under Gemini */}
                  {currentIdx === 3 && !isAbducting && (
                    <div
                      id="riding-animal"
                      className="absolute z-20 pointer-events-none"
                      style={{
                        left: `${playerXRef.current - 20}px`,
                        bottom: `${100 - playerYRef.current - 20}px`,
                        transform: `scale(${isLandscape ? 1.15 : 1.49})`,
                      }}
                    >
                      <Competitor
                        type="gpt"
                        variant="horse"
                        action="walk"
                        isMoving={true}
                      />
                    </div>
                  )}

                  {/* World 8 end: Hitching post — Gemini steals this horse to start World 7 */}
                  {currentIdx === 2 && currentLevel && (
                    <div
                      className="absolute z-20 flex items-end gap-2"
                      style={{
                        left: `${currentLevel.worldLength - 180}px`,
                        bottom: `${100}px`,
                      }}
                    >
                      {/* Post with crossbar */}
                      <div className="relative flex flex-col items-center flex-shrink-0">
                        <div className="w-4 h-24 bg-amber-950 border-2 border-amber-800 rounded-sm" />
                        <div
                          className="absolute top-4 left-1/2 w-20 h-3 bg-amber-900 border border-amber-800 rounded-sm"
                          style={{ transform: "translateX(-20%)" }}
                        />
                        <div
                          className="absolute top-[1.4rem] left-[70%] w-2 h-12 bg-amber-800 border border-amber-700 rounded-sm"
                          style={{
                            transform: "rotate(10deg)",
                            transformOrigin: "top",
                          }}
                        />
                      </div>
                      {/* Tied horse */}
                      <Competitor
                        type="gpt"
                        variant="horse"
                        action="walk"
                        isMoving={false}
                        facing="left"
                      />
                    </div>
                  )}

                  {/* World 5: Google G Fighter Ship */}
                  {currentIdx === 5 && (
                    <motion.div
                      id="fighter-ship"
                      className="absolute z-[25] pointer-events-none will-change-transform"
                      style={{
                        left: `${playerXRef.current - 55}px`,
                        bottom: `${100 - playerYRef.current - 14}px`,
                      }}
                      animate={
                        isMeteorCrash
                          ? { rotate: [0, 12, 28], y: [0, 30, 120, 320] }
                          : {}
                      }
                      transition={
                        isMeteorCrash ? { duration: 3.5, ease: "easeIn" } : {}
                      }
                    >
                      <div className="relative w-24 h-[58px]">
                        {/* Thruster exhaust — two jets on the left */}
                        <motion.div
                          className="absolute rounded-l-full blur-[4px]"
                          style={{
                            left: "4px",
                            top: "26px",
                            width: "34px",
                            height: "8px",
                            background:
                              "linear-gradient(to right, transparent, #60a5fa)",
                          }}
                          animate={{
                            scaleX: [1, 2, 1],
                            opacity: [0.8, 1, 0.8],
                          }}
                          transition={{ repeat: Infinity, duration: 0.11 }}
                        />
                        <motion.div
                          className="absolute rounded-l-full blur-[4px]"
                          style={{
                            left: "4px",
                            top: "50px",
                            width: "28px",
                            height: "7px",
                            background:
                              "linear-gradient(to right, transparent, #4ade80)",
                          }}
                          animate={{
                            scaleX: [1, 1.8, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.14,
                            delay: 0.06,
                          }}
                        />

                        {/* Main body */}
                        <div
                          className="absolute overflow-hidden border-2 border-white/50 shadow-[0_0_28px_rgba(139,92,246,0.7)]"
                          style={{
                            left: "32px",
                            top: "12px",
                            right: "0",
                            bottom: "12px",
                            borderRadius: "6px 40px 40px 6px",
                          }}
                        >
                          {/* Google G color stripes top→bottom */}
                          <div className="absolute inset-0 flex flex-col">
                            <div className="flex-1 bg-blue-500" />
                            <div className="flex-1 bg-red-500" />
                            <div className="flex-1 bg-yellow-400" />
                            <div className="flex-1 bg-green-500" />
                          </div>
                          {/* White inner body */}
                          <div
                            className="absolute inset-[5px] bg-white/90"
                            style={{ borderRadius: "3px 36px 36px 3px" }}
                          />
                          {/* G letter */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[15px] font-black text-slate-800 tracking-tight">
                              G
                            </span>
                          </div>
                        </div>

                        {/* Top wing */}
                        <div
                          className="absolute bg-gradient-to-r from-slate-300 to-white border border-slate-300 shadow-sm"
                          style={{
                            left: "40px",
                            top: "0px",
                            width: "56px",
                            height: "16px",
                            clipPath: "polygon(0 100%, 100% 100%, 75% 0)",
                          }}
                        />
                        {/* Bottom wing */}
                        <div
                          className="absolute bg-gradient-to-r from-slate-300 to-white border border-slate-300 shadow-sm"
                          style={{
                            left: "40px",
                            bottom: "0px",
                            width: "56px",
                            height: "16px",
                            clipPath: "polygon(0 0, 100% 0, 75% 100%)",
                          }}
                        />

                        {/* Nose cone */}
                        <div
                          className="absolute"
                          style={{
                            right: "-12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 0,
                            height: 0,
                            borderTop: "9px solid transparent",
                            borderBottom: "9px solid transparent",
                            borderLeft: "16px solid white",
                          }}
                        />

                        {/* Fire overlay when crashing */}
                        {isShipOnFire && (
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                "radial-gradient(ellipse at 15% 50%, rgba(251,191,36,0.95) 0%, rgba(239,68,68,0.85) 35%, rgba(239,68,68,0.4) 65%, transparent 85%)",
                            }}
                            animate={{
                              opacity: [0.6, 1, 0.7, 1],
                              scale: [1, 1.15, 1, 1.2],
                            }}
                            transition={{ repeat: Infinity, duration: 0.18 }}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}

                  <div
                    id="player-wrapper"
                    className={cn(
                      "absolute z-30 transition-shadow duration-300 will-change-transform",
                      isHit && "opacity-50 brightness-200",
                      (isAbducting || currentIdx === 5) && "opacity-0",
                    )}
                    style={{
                      left: `${playerXRef.current}px`,
                      bottom: `${100 - playerYRef.current}px`,
                      transformOrigin: "bottom",
                      transform: `scale(${(isFlying ? 0.9 : powerLevel === 2 ? 1.0 : powerLevel === 1 ? 1.0 : 0.8) * (isLandscape ? (currentIdx === 9 ? 1.8 : currentIdx === 3 ? 1.15 : 1.05) : currentIdx === 9 ? 2.4 : currentIdx === 3 ? 1.49 : 1)})`,
                    }}
                  >
                    <GeminiRunner
                      isMoving={true}
                      isJumping={isJumping}
                      powerLevel={powerLevel}
                      isFlying={isFlying}
                      isDizzy={isDizzy}
                      isCowboy={currentIdx === 3}
                      isShooting={isShooting}
                      hideLabel={isLandscape && currentIdx === 3}
                    />
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Cinematic Transformation Overlay */}
        {isTransforming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 w-full h-full z-[9999] bg-black flex flex-col items-center justify-center p-8"
          >
            <div
              style={{}}
              className="flex flex-col items-center justify-center relative w-full h-full"
            >
              {/* White Flash Effect */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-white z-[2002]"
              />

              <motion.div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                }}
                animate={
                  isLandscape
                    ? {
                        rotate: 1080,
                        scale: [0.5, 1.4, 1.2],
                        y: [0, 20, 10],
                      }
                    : {
                        rotate: 1080,
                        scale: [0.5, 2.2, 1.8],
                        y: [0, 40, 20],
                      }
                }
                transition={{ duration: 2.5, ease: "easeInOut" }}
                className="z-[2001]"
              >
                <GeminiRunner
                  isMoving={false}
                  isJumping={false}
                  powerLevel={2}
                  isFlying={false}
                />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                style={{ fontSize: "clamp(1rem, 4vmin, 3rem)" }}
                className="font-black italic text-orange-500 mt-8 md:mt-12 text-center drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] z-[2001]"
              >
                SUPER GEMINI
              </motion.h2>

              {/* Energy Burst */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 5], opacity: [0, 0.4, 0] }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute border-[20px] border-orange-400 rounded-full w-40 h-40 z-[2001]"
              />

              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(251,191,36,0.4)_0%,transparent_70%)] animate-pulse" />
            </div>
          </motion.div>
        )}

        {/* World 2 Persistent UFO & Abduction Sequence */}
        {currentLevel && currentLevel.number === 7 && (
          <div className="fixed inset-0 pointer-events-none z-[9000]">
            {/* The UFO */}
            <motion.div
              className="absolute top-14 left-1/2 -translate-x-1/2"
              animate={
                isAbducting
                  ? {
                      scale: [0.85, 1.8, 1.8, 0.2],
                      y: [ufoHoverY, 20, 20, -1500],
                      opacity: [1, 1, 1, 0],
                    }
                  : {
                      y: ufoHoverY,
                      x: [-25, 25, -25],
                    }
              }
              transition={
                isAbducting
                  ? {
                      duration: 4,
                      times: [0, 0.2, 0.8, 1],
                      ease: "easeInOut",
                    }
                  : {
                      x: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                    }
              }
            >
              <div className="relative">
                {/* UFO Body */}
                <div className="w-36 h-11 bg-slate-400 rounded-[100%] border-b-6 border-slate-600 shadow-[0_20px_50px_rgba(34,211,238,0.5)] relative z-20">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-10 bg-cyan-300/40 rounded-full blur-sm" />

                  {/* Abduction Hole (only visible when abducting) */}
                  {isAbducting && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-6 bg-black rounded-full shadow-inner blur-[1px]" />
                  )}

                  {/* Fuel Gage */}
                  {!isAbducting && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-cyan-900/50 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 animate-[pulse_1s_infinite] w-[70%]" />
                    </div>
                  )}
                </div>

                {/* Cockpit */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-18 bg-gradient-to-b from-cyan-100 to-slate-300 rounded-[100%] border-b-4 border-slate-500 overflow-hidden flex items-center justify-center z-10">
                  <Brain className="w-8 h-8 text-cyan-600/30 animate-pulse" />
                  <div className="absolute top-2 w-16 h-4 bg-white/40 rounded-full blur-[2px]" />
                </div>

                {/* Spinning Lights */}
                <div className="absolute inset-0 flex justify-around items-center px-8 z-30">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.3,
                        delay: i * 0.05,
                      }}
                      className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_15px_#fbbf24]"
                    />
                  ))}
                </div>

                {/* The Beam (Only during abduction) */}
                {isAbducting && (
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 6, times: [0.15, 0.25, 0.8, 0.9] }}
                    className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-[1000px] bg-gradient-to-b from-cyan-400/90 via-cyan-400/40 to-transparent origin-top blur-[4px] z-0 shadow-[0_0_100px_rgba(34,211,238,0.4)]"
                    style={{
                      clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
                    }}
                  >
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(transparent,rgba(255,255,255,0.3)_15px,transparent_30px)] animate-[pulse_0.4s_infinite]" />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Gemini alone floats up into the beam */}
            {isAbducting && (
              <motion.div
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{
                  y: [0, 0, -370, -370],
                  opacity: [1, 1, 1, 0],
                  scale: [1, 1, 0.12, 0],
                }}
                transition={{
                  duration: 4,
                  times: [0, 0.28, 0.82, 0.9],
                  ease: "easeInOut",
                }}
                className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center"
              >
                <div className="scale-[2.5] drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">
                  <GeminiRunner
                    isMoving={false}
                    isJumping={false}
                    powerLevel={0}
                    isFlying={false}
                    isCowboy={false}
                    isShooting={false}
                    hideLabel={true}
                  />
                </div>
              </motion.div>
            )}

            {/* Horse stays behind — rears up in panic, then settles looking up */}
            {isAbducting && (
              <motion.div
                initial={{ y: 0, rotate: 0 }}
                animate={{
                  y: [0, 0, -38, 4, -22, 0, -12, 0],
                  rotate: [0, 0, -20, 3, -14, 0, -8, 0],
                }}
                transition={{
                  duration: 3.5,
                  times: [0, 0.2, 0.3, 0.46, 0.58, 0.72, 0.84, 1],
                  ease: "easeInOut",
                }}
                className="absolute bottom-24 left-[32%] -translate-x-1/2 flex flex-col items-center"
              >
                <div className="scale-[2.5] drop-shadow-[0_0_20px_rgba(200,150,50,0.5)]">
                  <Competitor
                    type="gpt"
                    variant="horse"
                    action="walk"
                    isMoving={false}
                    facing="right"
                  />
                </div>
              </motion.div>
            )}

          </div>
        )}

        {/* Farmer Boss Overlay — tractor anchored to bottom-right ground line */}
        {currentLevel && hasFarmer && gameState === "playing" && currentLevelRef.current?.number !== 1 && (
          <div className="fixed bottom-[95px] right-16 pointer-events-none z-[150]">
            {/* Label */}
            <div className="flex justify-center mb-1">
              <div
                className={`text-white text-[8px] px-2 py-0.5 rounded font-black uppercase border border-white/20 ${farmerPhase === "throwing" ? "bg-red-700" : "bg-orange-700/90"}`}
              >
                {farmerPhase === "throwing" ? "LAUNCHING!" : "MAD FARMER"}
              </div>
            </div>

            <div
              className="relative flex items-end"
              style={{
                transform: "scale(0.85)",
                transformOrigin: "bottom right",
              }}
            >
              {/* Farmer — smaller, sitting on top of cabin */}
              <div
                className="absolute z-10"
                style={{ right: "52px", bottom: "54px" }}
              >
                <div
                  style={{
                    transform: "scale(0.72)",
                    transformOrigin: "bottom center",
                  }}
                >
                  <motion.div
                    animate={
                      farmerPhase === "throwing"
                        ? {
                            rotate: [0, -30, 20, 0],
                            y: [0, -8, -2, 0],
                          }
                        : {
                            y: [0, -3, 0],
                            rotate: [-3, 3, -3],
                          }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: farmerPhase === "throwing" ? 0.3 : 2.5,
                    }}
                    className="drop-shadow-[0_0_12px_rgba(251,146,60,0.9)]"
                  >
                    <Competitor
                      type="claude"
                      variant="farmer"
                      action={farmerPhase === "throwing" ? "throwing" : "idle"}
                      isMoving={false}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Tractor */}
              <div
                className="relative flex-shrink-0"
                style={{ width: "158px", height: "80px" }}
              >
                {/* Exhaust pipe */}
                <div
                  className="absolute"
                  style={{
                    left: "44px",
                    top: "-22px",
                    width: "9px",
                    height: "26px",
                    background: "#52525b",
                    border: "1px solid #71717a",
                    borderRadius: "4px 4px 0 0",
                  }}
                />
                {/* Smoke */}
                <motion.div
                  className="absolute rounded-full blur-sm"
                  style={{
                    left: "38px",
                    top: "-36px",
                    width: "20px",
                    height: "20px",
                    background: "rgba(120,113,108,0.55)",
                  }}
                  animate={{
                    y: [-2, -12, -2],
                    opacity: [0.7, 0, 0.7],
                    scale: [0.8, 1.5, 0.8],
                  }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                />

                {/* Engine hood */}
                <div
                  className="absolute"
                  style={{
                    left: "4px",
                    top: "14px",
                    width: "54px",
                    height: "46px",
                    background: "#dc2626",
                    border: "2px solid #991b1b",
                    borderRadius: "4px 0 0 4px",
                  }}
                />

                {/* Cabin body */}
                <div
                  className="absolute"
                  style={{
                    left: "44px",
                    top: "4px",
                    width: "76px",
                    height: "56px",
                    background: "#b91c1c",
                    border: "2px solid #7f1d1d",
                    borderRadius: "4px",
                  }}
                />

                {/* Cabin roof */}
                <div
                  className="absolute"
                  style={{
                    left: "46px",
                    top: "4px",
                    width: "74px",
                    height: "10px",
                    background: "#991b1b",
                    border: "2px solid #7f1d1d",
                  }}
                />

                {/* Windshield */}
                <div
                  className="absolute"
                  style={{
                    left: "46px",
                    top: "16px",
                    width: "22px",
                    height: "26px",
                    background: "rgba(125,211,252,0.35)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: "2px",
                  }}
                />

                {/* Axle bar */}
                <div
                  className="absolute"
                  style={{
                    left: "20px",
                    bottom: "18px",
                    right: "34px",
                    height: "6px",
                    background: "#3f3f46",
                    borderRadius: "4px",
                    transform: "rotate(7deg)",
                    transformOrigin: "right center",
                  }}
                />

                {/* Big rear wheel */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    right: "0",
                    bottom: "0",
                    width: "68px",
                    height: "68px",
                    background: "#1c1917",
                    border: "6px solid #57534e",
                    borderRadius: "50%",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      border: "3px solid #78716c",
                      borderRadius: "50%",
                    }}
                  />
                </div>

                {/* Small front wheel */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    left: "0",
                    bottom: "0",
                    width: "40px",
                    height: "40px",
                    background: "#1c1917",
                    border: "4px solid #57534e",
                    borderRadius: "50%",
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #78716c",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </div>

              {/* Throw flash */}
              {farmerPhase === "throwing" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.85, 0], scale: [0.5, 2.5, 0.5] }}
                  transition={{ duration: 0.28, repeat: Infinity }}
                  className="absolute rounded-full blur-lg"
                  style={{
                    right: "84px",
                    bottom: "62px",
                    width: "38px",
                    height: "38px",
                    background: "rgba(251,146,60,0.7)",
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Professor Boss Overlay */}
        {currentLevel && hasProfessor && gameState === "playing" && currentLevelRef.current?.number !== 1 && (
          <div className="fixed bottom-[74px] right-16 pointer-events-none z-[150]">
            <div className="flex justify-center mb-1">
              <div
                className={`text-white text-[8px] px-2 py-0.5 rounded font-black uppercase border border-blue-400 ${profPhase === "throwing" ? "bg-red-700" : "bg-blue-700/90"}`}
              >
                {profPhase === "throwing" ? "TESTING!" : "DOCTOR LOCO"}
              </div>
            </div>
            <div
              className="relative flex items-end"
              style={{
                transform: "scale(1.5)",
                transformOrigin: "bottom right",
              }}
            >
              <div
                className="absolute z-10"
                style={{ right: "0px", bottom: "0px" }}
              >
                <motion.div
                  animate={
                    profPhase === "throwing"
                      ? {
                          rotate: [0, -20, 15, 0],
                          y: [0, -6, -1, 0],
                        }
                      : {
                          y: [0, -2, 0],
                        }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: profPhase === "throwing" ? 0.3 : 2.5,
                  }}
                  className="drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                >
                  <Competitor
                    type="gpt"
                    variant="professor"
                    action={profPhase === "throwing" ? "throwing" : "idle"}
                    isMoving={true}
                  />
                </motion.div>
              </div>

              {/* Lab Console */}
              <div
                className="relative flex-shrink-0"
                style={{ width: "60px", height: "50px", marginLeft: "30px" }}
              >
                <div className="absolute inset-0 bg-slate-800 border-2 border-slate-600 rounded-t-md" />
                {/* Screen */}
                <div className="absolute top-2 left-2 right-2 h-14 bg-blue-900 border border-blue-400 rounded-sm overflow-hidden flex items-center justify-center">
                  <motion.div
                    className="w-full h-1 bg-blue-400 opacity-50"
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
              </div>

              {/* Throw flash */}
              {profPhase === "throwing" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.85, 0], scale: [0.5, 2.5, 0.5] }}
                  transition={{ duration: 0.28, repeat: Infinity }}
                  className="absolute rounded-full blur-lg"
                  style={{
                    right: "40px",
                    bottom: "40px",
                    width: "38px",
                    height: "38px",
                    background: "rgba(52,211,153,0.7)",
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* World 5: Meteor Shower Crash Overlay */}
        {isMeteorCrash && (
          <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
            {/* Screen flash on impact */}
            <motion.div
              className="absolute inset-0 bg-orange-400"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
            {/* Meteors falling diagonally */}
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={`meteor-${i}`}
                className="absolute"
                style={{
                  width: `${8 + (i % 4) * 6}px`,
                  height: `${8 + (i % 4) * 6}px`,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 30% 30%, #fef3c7, #f97316, #7c2d12)`,
                  boxShadow: "0 0 12px rgba(249,115,22,0.8)",
                  top: `${-10 - i * 40}px`,
                  left: `${20 + i * 6.5}%`,
                }}
                animate={{
                  x: [0, -120 - i * 30],
                  y: [0, window.innerHeight + 100 + i * 20],
                }}
                transition={{
                  duration: 1.2 + i * 0.08,
                  delay: i * 0.05,
                  ease: "easeIn",
                }}
              >
                {/* Tail */}
                <div
                  className="absolute"
                  style={{
                    right: "100%",
                    top: "50%",
                    transform: "translateY(-50%) rotate(35deg)",
                    width: `${20 + i * 4}px`,
                    height: "3px",
                    background:
                      "linear-gradient(to left, rgba(249,115,22,0.9), transparent)",
                    transformOrigin: "right center",
                  }}
                />
              </motion.div>
            ))}
            {/* Big impact explosion at ship position (~1/3 from left, lower area) */}
            <motion.div
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
              style={{
                left: `${winWRef.current / 3}px`,
                bottom: "140px",
                background:
                  "radial-gradient(circle, #fef3c7 0%, #f97316 40%, #dc2626 70%, transparent 100%)",
              }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{
                width: ["0px", "300px", "600px", "800px"],
                height: ["0px", "300px", "600px", "800px"],
                opacity: [0, 1, 0.6, 0],
              }}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            />
          </div>
        )}

        {/* Cinematic Death Overlay */}
        {showDeathScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 w-full h-full z-[9999] bg-black flex flex-col items-center justify-center p-8"
          >
            <div
              style={{}}
              className="flex flex-col items-center justify-center"
            >
              {/* White flash on impact */}
              <motion.div
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white z-[2002]"
              />

              <motion.div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "60px",
                }}
                animate={{
                  scale: [1, 1.5],
                  y: [0, 0],
                }}
                transition={{ duration: 0.5 }}
                className="z-[2001]"
              >
                <GeminiRunner
                  isMoving={false}
                  isJumping={false}
                  isDizzy={true}
                  isSitting={true}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-20 text-center z-[2001]"
              >
                <h2
                  style={{ fontSize: "clamp(1.5rem, 6vmin, 4rem)" }}
                  className="font-black italic text-red-600 mb-6 drop-shadow-[0_0_25px_rgba(220,38,38,0.7)] uppercase"
                >
                  CRITICAL SYSTEM ERROR
                </h2>
                <p
                  style={{ fontSize: "clamp(0.7rem, 2.5vmin, 1.8rem)" }}
                  className="font-mono text-neutral-400 tracking-[0.4em] uppercase"
                >
                  Dimension Sync Lost
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

        {/* HUD Layer */}
      {gameState === "playing" && currentLevel && (
        <>
          <div className="fixed top-12 left-4 z-[120] pointer-events-auto">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-black/80 hover:bg-red-950 border border-white/20 rounded shadow-lg text-white font-black text-[10px] uppercase tracking-tighter transition-all"
            >
              Reset
            </button>
          </div>
          <div className="absolute top-0 inset-x-0 h-[40px] w-full flex justify-center z-50 pointer-events-none bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center justify-between w-full max-w-4xl px-4 gap-4">
              <div className="text-[11px] font-bold text-white uppercase truncate shrink-0 max-w-[40%]">
                {currentLevel.planetName}
              </div>
              <div
                className="flex-1 h-[3px] bg-white/10 rounded-full overflow-hidden relative"
                style={{ minWidth: "50px" }}
              >
                <div
                  id="progress-bar"
                  className="absolute inset-y-0 left-0 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] will-change-[width]"
                  style={{
                    width: `${(playerXRef.current / currentLevel.worldLength) * 100}%`,
                  }}
                />
              </div>
              <div className="text-[11px] font-bold text-blue-400 uppercase shrink-0 flex gap-2 items-center">
                Portal {currentLevel.number}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Overlays (Start/End/Transition) */}
      <AnimatePresence>
        {gameState === "menu" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center justify-center z-[100] bg-black/95 backdrop-blur-3xl"
          >
            <div
              className="flex flex-col items-center justify-center py-4 w-full origin-center z-10 text-center"
            >
              <div className="relative mb-2 md:mb-8 shrink-0">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 40,
                    ease: "linear",
                  }}
                  className="absolute inset-0 border border-blue-500/20 rounded-full scale-150"
                />
                <Sparkles className="w-12 h-12 md:w-24 md:h-24 text-blue-400 relative z-10 drop-shadow-[0_0_30px_rgba(96,165,250,0.5)]" />
              </div>
              <h1
                style={{ fontSize: "clamp(1rem, 4vmin, 3rem)" }}
                className="font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600 italic uppercase shrink-0 leading-none"
              >
                Google I/O 2026
              </h1>
              <div 
                style={{ fontSize: "clamp(1.5rem, 5vmin, 4rem)" }}
                className="font-black tracking-widest text-blue-500 uppercase shrink-0 leading-none mt-2 md:mt-4 mb-2 md:mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                Code the Countdown
              </div>
              <p
                style={{ fontSize: "clamp(0.5rem, 2vmin, 1.5rem)" }}
                className="text-gray-300 font-medium max-w-2xl mx-auto my-1 md:my-6 leading-relaxed shrink-0 text-center px-4"
              >
                Help us countdown the AI Cosmos from 10 to 1!
                <br />
                <span className="text-gray-500 text-sm font-light mt-2 block">
                  Dodge competitors. Collect <span className="text-yellow-400 font-bold">Dollars</span>. Fire <span className="text-blue-400 font-bold">Tokens</span>.
                </span>
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStart();
                }}
                className="mt-2 md:mt-4 px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white font-black text-lg md:text-3xl rounded-full hover:bg-blue-500 hover:scale-110 active:scale-95 transition-all shadow-2xl flex items-center gap-3"
              >
                START COUNTDOWN{" "}
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <div className="mt-6 flex flex-col items-center gap-2">
                <p className="text-white/30 text-[10px] uppercase tracking-widest">
                  — Jump to World —
                </p>
                <div className="flex justify-center gap-1.5 md:gap-2 max-w-full overflow-x-visible">
                  {LEVELS.map((level, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJumpToLevel(idx);
                      }}
                      className={cn(
                        "w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/5 hover:bg-blue-600/80 border border-white/10 rounded-lg text-white/40 hover:text-white font-black text-xs md:text-sm transition-all hover:scale-110 active:scale-95 shadow-lg group relative overflow-hidden",
                        level.number === 1 && "border-blue-500/30 bg-blue-500/5"
                      )}
                    >
                      <span className="relative z-10">{level.number}</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === "guide" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center justify-center z-[100] bg-black/95 backdrop-blur-3xl"
          >
            <div className="absolute inset-0 max-w-5xl mx-auto overflow-hidden pointer-events-none opacity-20">
              <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[150px]" />
              <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-8 md:mb-12">
                — How to Play —
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-12">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center shadow-xl">
                  <div className="h-16 w-16 mb-4 flex items-center justify-center bg-blue-500/20 text-blue-400 rounded-full">
                    <MousePointer2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">JUMP / HOVER</h3>
                  <p className="text-white/60 text-sm mb-4">Spacebar / Up Arrow or tap left side of screen.</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/10 rounded-md text-xs font-mono text-white/80">SPACE</span>
                    <span className="px-3 py-1 bg-white/10 rounded-md text-xs font-mono text-white/80">↑</span>
                    <span className="px-3 py-1 bg-white/10 rounded-md text-xs font-mono text-white/80">TAP</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center shadow-xl">
                  <div className="h-16 w-16 mb-4 flex items-center justify-center bg-yellow-500/20 text-yellow-400 rounded-full">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">SHOOT TOKENS</h3>
                  <p className="text-white/60 text-sm mb-4">Press 'F' or tap the right-side fire button. Costs 1 Dollar.</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/10 rounded-md text-xs font-mono text-white/80">F</span>
                    <span className="px-3 py-1 bg-white/10 rounded-md text-xs font-mono text-white/80">TAP</span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  proceedFromGuide();
                }}
                className="px-8 md:px-12 py-4 md:py-5 bg-white text-black font-black text-xl md:text-2xl rounded-full hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-3"
              >
                PROCEED TO MISSION <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>

              <GuideAutoAdvance onComplete={proceedFromGuide} />
            </div>
          </motion.div>
        )}

        {gameState === "interlevel" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center justify-center z-[9999]",
              currentLevel
                ? `bg-gradient-to-br ${currentLevel.themeColor}`
                : "bg-black",
            )}
          >
            {/* Background Texture/Noise */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {/* Space Mini-Game Background */}
            {(currentLevel?.environment === "void" ||
              currentLevel?.environment === "nebula") && (
                <TransitionGame variant={currentLevel.environment === "nebula" ? "ship" : "orb"} />
            )}

            {/* Watermark number */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                type: "spring",
                bounce: 0.5,
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] md:text-[280px] font-black italic tracking-tighter text-white/10 pointer-events-none select-none z-0 mix-blend-overlay"
              style={{ lineHeight: 0.8 }}
            >
              {currentLevel?.number}
            </motion.div>

            <div
              className="flex flex-col items-center justify-center py-4 relative w-full origin-center z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                className="z-10 flex flex-col items-center justify-center mb-2"
              >
                <div className="text-[clamp(0.6rem,2vmin,1.2rem)] text-white font-mono tracking-[0.5em] uppercase mb-1 opacity-80">
                  HELLO WORLD
                </div>
                <div className="text-[clamp(3rem,12vmin,8rem)] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-[0_10px_30px_rgba(255,255,255,0.3)]">
                  {currentLevel?.number}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ fontSize: "clamp(0.5rem, 1.5vmin, 1rem)" }}
                className="mb-3 uppercase tracking-[0.3em] text-white/60 font-mono z-10"
              >
                Establishing Link... Sector {currentLevel?.number}
              </motion.div>

              <motion.div
                initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  delay: 0.8,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="mb-3 relative z-10"
              >
                <div className="absolute inset-0 blur-3xl bg-white/20 rounded-full animate-pulse" />
                <Competitor
                  type={currentLevel?.rivalType || "gpt"}
                  action="INITIALIZING"
                  isMoving={false}
                  variant={
                    currentLevel?.environment === "graveyard"
                      ? "zombie"
                      : currentLevel?.environment === "moon"
                        ? "werewolf"
                        : currentLevel?.environment === "water"
                          ? "fish"
                          : currentLevel?.environment === "nebula"
                            ? "ufo"
                            : currentLevel?.environment === "void"
                              ? "ufo"
                              : "normal"
                  }
                />
              </motion.div>

              <h2
                style={{ fontSize: "clamp(0.8rem, 2.5vmin, 2rem)" }}
                className="font-black italic tracking-tighter text-white mb-3 drop-shadow-2xl z-10 text-center px-4"
              >
                {currentLevel?.planetName.toUpperCase() || "LOADING..."}
              </h2>

              <div className="flex flex-col items-center gap-3 z-10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5 }}
                  className="h-1 bg-white/30 w-48 md:w-72 rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-white"
                  />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{ fontSize: "clamp(0.7rem, 2vmin, 1.5rem)" }}
                  className="text-white font-mono tracking-[0.3em] uppercase animate-pulse text-center"
                >
                  {currentLevel?.coyoteAction || "READY TO RUN"}
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === "gameover" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center justify-center z-[9999] bg-black/90 backdrop-blur-md"
          >
            <div
              className="flex flex-col items-center justify-center py-4 px-4 w-full origin-center z-10"
            >
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "40px",
                  }}
                >
                  <GeminiRunner
                    isMoving={false}
                    isJumping={false}
                    powerLevel={0}
                    isDizzy={true}
                  />
                </motion.div>
              </div>
              <h2
                style={{ fontSize: "clamp(2rem, 8vmin, 5rem)" }}
                className="font-black italic tracking-tighter text-white mb-6 leading-none uppercase text-center"
              >
                SYSTEM CRASH.
              </h2>
              <p
                style={{ fontSize: "clamp(0.8rem, 3vmin, 2rem)" }}
                className="text-blue-400 font-mono mb-16 tracking-[0.4em] uppercase text-center"
              >
                Unauthorized Rival Interaction
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="px-6 md:px-12 py-3 md:py-6 bg-blue-600 text-white font-black text-lg md:text-3xl rounded-full hover:bg-white hover:text-blue-600 transition-all shadow-[0_0_60px_rgba(59,130,246,0.9)] flex items-center gap-4 group"
              >
                <RotateCcw className="w-10 h-10 group-hover:rotate-180 transition-transform" />{" "}
                REBOOT MISSION
              </button>
            </div>
          </motion.div>
        )}

        {gameState === "complete" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/95"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[40px] p-8 md:p-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              
              <div className="relative z-10 flex flex-col items-center">
                {/* Modernized Google Logo Display */}
                <motion.div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white shadow-[0_10px_30px_rgba(255,255,255,0.2)] flex items-center justify-center mb-8 relative group"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                >
                  <svg viewBox="0 0 24 24" className="w-16 h-16 md:w-20 md:h-20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                  </svg>
                  
                  {/* Subtle rings around logo */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>

                <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                  THANK YOU!
                </h2>
                
                <p className="text-blue-100/80 text-lg md:text-xl font-medium max-w-md mx-auto mb-10 leading-relaxed">
                  The mission is complete. Your Gemini collection is synchronized and ready for the future.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="px-10 py-4 bg-white text-slate-900 rounded-full font-black text-xl shadow-xl hover:shadow-white/20 transition-all flex items-center gap-3"
                >
                  <RotateCcw className="w-6 h-6" />
                  RESTART JOURNEY
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      {/* Hit Vignette */}
      <AnimatePresence>
        {isHit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] pointer-events-none bg-red-900/20 shadow-[inset_0_0_100px_rgba(220,38,38,0.5)]"
          />
        )}
      </AnimatePresence>
    
      </div>

      {/* TOUCH CONTROLS */}
      {gameState === "playing" && (
        <div className="fixed inset-0 z-[10000] pointer-events-none lg:hidden">
          {!isPortraitGameboy ? (
            <>
              {/* Left Sidebar (Movement D-Pad) */}
              <div 
                className="absolute top-0 bottom-0 left-0 flex flex-col justify-end items-center pointer-events-auto pb-6 sm:pb-10"
                style={{ width: `var(--sidebar-width-px)` }}
              >
                <div className="flex flex-col items-center gap-1">
                  <button
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800/90 border-2 border-zinc-600 rounded-full flex items-center justify-center active:scale-95 active:bg-zinc-700 text-white text-lg select-none shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                    onPointerDown={(e) => { e.preventDefault(); keysPressed.current["ArrowUp"] = true; }}
                    onPointerUp={(e) => { e.preventDefault(); keysPressed.current["ArrowUp"] = false; }}
                    onPointerLeave={(e) => { e.preventDefault(); keysPressed.current["ArrowUp"] = false; }}
                  >
                    ↑
                  </button>
                  <div className="flex gap-2">
                    <button
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800/90 border-2 border-zinc-600 rounded-full flex items-center justify-center active:scale-95 active:bg-zinc-700 text-white text-lg select-none shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                      onPointerDown={(e) => { e.preventDefault(); keysPressed.current["ArrowLeft"] = true; }}
                      onPointerUp={(e) => { e.preventDefault(); keysPressed.current["ArrowLeft"] = false; }}
                      onPointerLeave={(e) => { e.preventDefault(); keysPressed.current["ArrowLeft"] = false; }}
                    >
                      ←
                    </button>
                    <button
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800/90 border-2 border-zinc-600 rounded-full flex items-center justify-center active:scale-95 active:bg-zinc-700 text-white text-lg select-none shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                      onPointerDown={(e) => { e.preventDefault(); keysPressed.current["ArrowRight"] = true; }}
                      onPointerUp={(e) => { e.preventDefault(); keysPressed.current["ArrowRight"] = false; }}
                      onPointerLeave={(e) => { e.preventDefault(); keysPressed.current["ArrowRight"] = false; }}
                    >
                      →
                    </button>
                  </div>
                  <button
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800/90 border-2 border-zinc-600 rounded-full flex items-center justify-center active:scale-95 active:bg-zinc-700 text-white text-lg select-none shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                    onPointerDown={(e) => { e.preventDefault(); keysPressed.current["ArrowDown"] = true; }}
                    onPointerUp={(e) => { e.preventDefault(); keysPressed.current["ArrowDown"] = false; }}
                    onPointerLeave={(e) => { e.preventDefault(); keysPressed.current["ArrowDown"] = false; }}
                  >
                    ↓
                  </button>
                </div>
              </div>

              {/* Right Sidebar (Action) */}
              <div 
                className="absolute top-0 bottom-0 right-0 flex flex-col justify-end items-center pointer-events-auto pb-6 sm:pb-10"
                style={{ width: `var(--sidebar-width-px)` }}
              >
                <div className="flex flex-col gap-4 items-center">
                  {(powerLevel > 0 || currentIdx === 3 || currentIdx === 4 || currentIdx === 5 || currentIdx === 7) && (
                    <button
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-900/90 border-2 border-blue-600 rounded-full flex items-center justify-center active:scale-90 text-white text-[9px] sm:text-xs font-black uppercase select-none shadow-[0_0_15px_rgba(30,58,138,0.5)]"
                      onPointerDown={(e) => { e.preventDefault(); shoot(); }}
                    >
                      SHT
                    </button>
                  )}
                  <button
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-800/95 border-2 border-zinc-500 rounded-full flex items-center justify-center active:scale-90 text-white font-black text-sm sm:text-lg uppercase select-none shadow-[0_0_20px_rgba(0,0,0,0.9)]"
                    onPointerDown={(e) => { e.preventDefault(); triggerJump(); }}
                  >
                    JMP
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Portrait Gameboy Overlay */}
              <div 
                className="absolute left-0 right-0 bottom-0 flex justify-between items-center pointer-events-auto px-6 sm:px-12"
                style={{ height: `calc(100dvh - var(--game-height-px))` }}
              >
                {/* D-Pad on Left */}
                <div className="flex flex-col items-center gap-1 md:scale-125 origin-bottom-left">
                  <button
                    className="w-12 h-12 bg-zinc-800/90 border-2 border-zinc-600 rounded-full flex items-center justify-center active:scale-95 active:bg-zinc-700 text-white text-xl select-none shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                    onPointerDown={(e) => { e.preventDefault(); keysPressed.current["ArrowUp"] = true; }}
                    onPointerUp={(e) => { e.preventDefault(); keysPressed.current["ArrowUp"] = false; }}
                    onPointerLeave={(e) => { e.preventDefault(); keysPressed.current["ArrowUp"] = false; }}
                  >
                    ↑
                  </button>
                  <div className="flex gap-2">
                    <button
                      className="w-12 h-12 bg-zinc-800/90 border-2 border-zinc-600 rounded-full flex items-center justify-center active:scale-95 active:bg-zinc-700 text-white text-xl select-none shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                      onPointerDown={(e) => { e.preventDefault(); keysPressed.current["ArrowLeft"] = true; }}
                      onPointerUp={(e) => { e.preventDefault(); keysPressed.current["ArrowLeft"] = false; }}
                      onPointerLeave={(e) => { e.preventDefault(); keysPressed.current["ArrowLeft"] = false; }}
                    >
                      ←
                    </button>
                    <button
                      className="w-12 h-12 bg-zinc-800/90 border-2 border-zinc-600 rounded-full flex items-center justify-center active:scale-95 active:bg-zinc-700 text-white text-xl select-none shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                      onPointerDown={(e) => { e.preventDefault(); keysPressed.current["ArrowRight"] = true; }}
                      onPointerUp={(e) => { e.preventDefault(); keysPressed.current["ArrowRight"] = false; }}
                      onPointerLeave={(e) => { e.preventDefault(); keysPressed.current["ArrowRight"] = false; }}
                    >
                      →
                    </button>
                  </div>
                  <button
                    className="w-12 h-12 bg-zinc-800/90 border-2 border-zinc-600 rounded-full flex items-center justify-center active:scale-95 active:bg-zinc-700 text-white text-xl select-none shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                    onPointerDown={(e) => { e.preventDefault(); keysPressed.current["ArrowDown"] = true; }}
                    onPointerUp={(e) => { e.preventDefault(); keysPressed.current["ArrowDown"] = false; }}
                    onPointerLeave={(e) => { e.preventDefault(); keysPressed.current["ArrowDown"] = false; }}
                  >
                    ↓
                  </button>
                </div>
                
                {/* Action buttons on Right */}
                <div className="flex justify-end gap-3 items-center md:scale-125 origin-bottom-right" style={{ transform: 'rotate(-15deg)' }}>
                  {(powerLevel > 0 || currentIdx === 3 || currentIdx === 4 || currentIdx === 5 || currentIdx === 7) ? (
                    <>
                      <button
                        className="w-14 h-14 bg-blue-900/90 border-2 border-blue-600 rounded-full flex items-center justify-center active:scale-90 text-white text-sm font-black uppercase select-none shadow-[0_0_15px_rgba(30,58,138,0.5)] mt-8"
                        onPointerDown={(e) => { e.preventDefault(); shoot(); }}
                      >
                        SHT
                      </button>
                      <button
                        className="w-16 h-16 bg-zinc-800/95 border-2 border-zinc-500 rounded-full flex items-center justify-center active:scale-90 text-white font-black text-lg uppercase select-none shadow-[0_0_20px_rgba(0,0,0,0.9)] mb-8"
                        onPointerDown={(e) => { e.preventDefault(); triggerJump(); }}
                      >
                        JMP
                      </button>
                    </>
                  ) : (
                    <button
                      className="w-20 h-20 bg-zinc-800/95 border-2 border-zinc-500 rounded-full flex items-center justify-center active:scale-90 text-white font-black text-2xl uppercase select-none shadow-[0_0_20px_rgba(0,0,0,0.9)]"
                      onPointerDown={(e) => { e.preventDefault(); triggerJump(); }}
                    >
                      JMP
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Portrait Warning Overlay for Mobile */}
      {(!isLandscape && !isPortraitGameboy) && gameState !== "menu" && (
        <div className="fixed inset-0 z-[100000] bg-[#050505] flex flex-col items-center justify-center text-center p-8 lg:hidden touch-none pointer-events-auto">
          <RotateCcw className="w-20 h-20 text-blue-500 mb-8" />
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 uppercase tracking-wider">Rotate Device</h2>
          <p className="text-zinc-400 text-lg sm:text-xl max-w-sm">
            Please rotate your phone to landscape mode to play this game.
          </p>
        </div>
      )}

</main>
  );
}
