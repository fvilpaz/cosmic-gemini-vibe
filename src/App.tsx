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
import { Portal } from "./components/Portal";
import { Dollar } from "./components/Dollar";
import { Flyer } from "./components/Flyer";
import { TokenProjectile } from "./components/Projectile";
import { TransitionGame } from "./components/TransitionGame";
import { cn } from "./lib/utils";

import { RotateScreen } from "./components/RotateScreen";

const GRAVITY = 0.4;
const JUMP_FORCE = -11;

type GameState = "menu" | "interlevel" | "playing" | "gameover" | "complete";

export default function App() {
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [gameState, setGameState] = useState<GameState>("menu");

  // High-performance Physics (using Refs to skip React state lag during calculation)
  const playerXRef = useRef(100);
  const playerYRef = useRef(0);
  const velocityYRef = useRef(0);

  const [isJumping, setIsJumping] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
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
  const [flyers, setFlyers] = useState<
    { id: string; x: number; isCollected: boolean }[]
  >([]);
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

    setDollars(
      level.dollarSpawns.map((x, i) => ({
        id: `${idx}-coin-${i}`,
        x: x,
        isCollected: false,
      })),
    );

    setFlyers(
      (level.flyerSpawns || []).map((x, i) => ({
        id: `${idx}-flyer-${i}`,
        x: x,
        y: 0, // Ground level fix
        isCollected: false,
      })),
    );

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
    setIsTransforming(false);
    setIsAbducting(false);
    isAbductingRef.current = false;
    setIsMeteorCrash(false);
    isMeteorCrashRef.current = false;
    setGameState("interlevel");

    // Show interlevel for 2 seconds
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

  const gameLoop = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    let dt = time - lastTimeRef.current;
    if (dt > 100) dt = 16.666;
    lastTimeRef.current = time;
    const timeScale = dt / 16.666;

    if (gameStateRef.current !== "playing" || !currentLevelRef.current) {
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

    const isL = window.innerWidth > window.innerHeight;
    const gScale = isL ? Math.max(1, window.innerWidth / 1200) : 1;
    const internalH = isL ? window.innerHeight / gScale : window.innerHeight;
    const baseSpeed = (isL ? 3.2 : 1.7) / gScale;
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
      if (e.variant === "farmer") {
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
      if (currentLevelRef.current?.number === 6 && e.variant === "alien") {
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
          if (newEy > nY + 10) newEy -= 1.5 * timeScale;
          else if (newEy < nY - 10) newEy += 1.5 * timeScale;
        }
      }

      const lscale = window.innerWidth > window.innerHeight ? 1.05 : 1;
      const isL = window.innerWidth > window.innerHeight;
      const isW2 = currentLevelRef.current?.number === 7;
      const eScaleMultiplier = isL ? (isW2 ? 1.2 : 0.85) : 0.95;
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
        e.variant !== "professor"
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

    // World 6: each alien soldier fires every ~180 frames (phase-based, ~3s)
    if (currentLevelRef.current?.number === 6) {
      enemiesRef.current.forEach((e: any) => {
        if (
          !e.isDead &&
          e.variant === "alien" &&
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
      currentLevelRef.current?.enemySpawns?.some((s) => s.variant === "farmer")
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
            nX - (isL ? 1200 : window.innerWidth) / 3,
          );
          const baseX = throwCamX + window.innerWidth - 100;
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
      )
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
            nX - (isL ? 1200 : window.innerWidth) / 3,
          );
          const baseX = throwCamX + window.innerWidth - 100;
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
    enemiesRef.current.forEach((e) => {
      const groundY = window.innerWidth > window.innerHeight ? 70 : 120;

      const isL = window.innerWidth > window.innerHeight;
      const isW2 = currentLevelRef.current?.number === 7;
      const eScaleMultiplier = isL ? (isW2 ? 1.2 : 0.85) : 0.95;

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
    setDollars((prev) => {
      let changed = false;
      const next = prev.map((d) => {
        if (!d.isCollected && Math.abs(nX - d.x) < 70 && Math.abs(nY) < 70) {
          changed = true;
          dollarCollectedCount += 1;
          screenshakeRef.current = 5;
          return { ...d, isCollected: true };
        }
        return d;
      });
      return changed ? next : prev;
    });

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

    setFlyers((prev) => {
      let changed = false;
      const next = prev.map((f) => {
        // Must jump to collect (nY must be sufficiently high)
        if (!f.isCollected && Math.abs(nX - f.x) < 80 && nY < -80) {
          changed = true;
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
          return { ...f, isCollected: true };
        }
        return f;
      });
      return changed ? next : prev;
    });

    const movedProjectiles = projectilesRef.current.map((p) => ({
      ...p,
      x: p.x + 22 * timeScale,
    }));
    const deadIds = new Set<string>();
    let eChanged = false;

    const uEnemies = enemiesRef.current.map((e) => {
      if (e.isDead) return e;
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

    if (nX >= currentLevelRef.current.worldLength) {
      if (currentLevelRef.current.number === 7 && !isAbductingRef.current) {
        setIsAbducting(true);
        isAbductingRef.current = true;
        setTimeout(() => {
          nextLevelRef.current();
        }, 9000);
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
      playerXRef.current - (isL ? 1200 : window.innerWidth) / 3,
    );
    const worldEl = document.getElementById("game-world");
    if (worldEl) worldEl.style.transform = `translateX(${-camX}px)`;

    const playerEl = document.getElementById("player-wrapper");
    if (playerEl) {
      const groundY = window.innerWidth > window.innerHeight ? 70 : 120;
      playerEl.style.left = `${nX}px`;
      playerEl.style.bottom = `${groundY - nY}px`;
    }

    const ridingAnimalEl = document.getElementById("riding-animal");
    if (ridingAnimalEl) {
      const groundY = window.innerWidth > window.innerHeight ? 70 : 120;
      ridingAnimalEl.style.left = `${nX - 10}px`;
      ridingAnimalEl.style.bottom = `${groundY - nY - 10}px`;
    }

    const fighterShipEl = document.getElementById("fighter-ship");
    if (fighterShipEl) {
      const groundY = window.innerWidth > window.innerHeight ? 70 : 120;
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

    if (currentIdx === 3 || currentIdx === 4 || currentIdx === 5) {
      // El Oeste / Nave Alien / Galaxia
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
      currentLevelRef.current?.number === 5;
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
    setCurrentIdx(0);
    startLevel(0);
    setGameState("interlevel");
    setTimeout(() => {
      document.getElementById("game-container")?.focus();
    }, 100);
  };

  const handleReset = () => {
    setCurrentIdx(-1);
    setIsDizzy(false);
    deathSequenceRef.current = false;
    setShowDeathScreen(false);
    setGameState("menu");
  };

  const handleJumpToLevel = (idx: number) => {
    setCurrentIdx(idx);
    startLevel(idx);
  };

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
        "fixed w-screen h-[100dvh] inset-0 bg-[#050505] text-white font-sans overflow-hidden select-none focus:outline-none",
        gameState === "playing" ? "touch-none" : "touch-auto"
      )}
      onPointerDown={handleInteraction}
      style={{
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Game Rendering Area */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          style={{ width: "100%", height: "100%" }}
          className="relative overflow-hidden pointer-events-auto"
        >
          {/* Background Parallax */}
          {currentLevel && <LevelBackground level={currentLevel} />}

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
                  {/* The Number Portal */}
                  {currentLevel.number !== 7 && currentLevel.number !== 6 && (
                    <div
                      className="absolute flex flex-col items-center"
                      style={{
                        bottom: `${isLandscape ? 70 : 120}px`,
                        left: `${currentLevel.worldLength}px`,
                      }}
                    >
                      <Portal
                        number={
                          currentIdx < LEVELS.length - 1
                            ? LEVELS[currentIdx + 1].number
                            : 1
                        }
                        color={currentLevel.particleColor}
                      />
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="mt-8 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20"
                      >
                        <p className="text-2xl font-black italic tracking-widest text-white shadow-xl">
                          {currentIdx < LEVELS.length - 1
                            ? `PORTAL TO WORLD ${LEVELS[currentIdx + 1].number}`
                            : "FINAL SYNC"}
                        </p>
                      </motion.div>
                    </div>
                  )}

                  {/* World 6: Hangar exit door */}
                  {currentLevel.number === 6 && (
                    <div
                      className="absolute flex flex-col items-center"
                      style={{
                        bottom: `${isLandscape ? 70 : 120}px`,
                        left: `${currentLevel.worldLength}px`,
                      }}
                    >
                      <div
                        className="relative w-36 h-60 border-4 border-zinc-400 overflow-hidden shadow-[0_0_40px_rgba(74,222,128,0.6)]"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(45deg, rgba(251,191,36,0.25) 0px, rgba(251,191,36,0.25) 6px, transparent 6px, transparent 18px)",
                          backgroundColor: "#18181b",
                        }}
                      >
                        {/* Space through door */}
                        <div
                          className="absolute inset-3 rounded-sm overflow-hidden"
                          style={{
                            background:
                              "radial-gradient(ellipse at 50% 50%, #1e1b4b, #000)",
                          }}
                        >
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-0.5 h-0.5 bg-white rounded-full"
                              style={{
                                top: `${(i * 47) % 100}%`,
                                left: `${(i * 63) % 100}%`,
                                opacity: 0.8,
                              }}
                            />
                          ))}
                        </div>
                        {/* Number 5 glowing */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center z-10"
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          <span
                            className="text-6xl font-black text-green-400"
                            style={{
                              textShadow: "0 0 30px #4ade80, 0 0 60px #4ade80",
                            }}
                          >
                            5
                          </span>
                        </motion.div>
                        {/* Warning stripe */}
                        <div
                          className="absolute bottom-0 inset-x-0 h-3 z-20"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(90deg, #fbbf24 0px, #fbbf24 10px, #18181b 10px, #18181b 20px)",
                          }}
                        />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="mt-4 bg-green-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-green-500/50"
                      >
                        <p
                          className="text-lg font-black italic tracking-widest text-green-400"
                          style={{ textShadow: "0 0 15px #4ade80" }}
                        >
                          HANGAR EXIT → WORLD 5
                        </p>
                      </motion.div>
                    </div>
                  )}

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
                          bottom: `${(isLandscape ? 70 : 120) + plat.y}px`,
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
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee]" />
                            <div
                              className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-cyan-500/20 shadow-[0_0_20px_#22d3ee_inset]"
                              style={{
                                backgroundImage:
                                  "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(34,211,238,0.3) 10px, rgba(34,211,238,0.3) 12px)",
                              }}
                            />
                            <div className="absolute left-0 top-0 bottom-0 w-3 bg-zinc-800 rounded-full border border-cyan-400 z-10 shadow-[0_0_10px_#22d3ee]" />
                            <div className="absolute right-0 top-0 bottom-0 w-3 bg-zinc-800 rounded-full border border-cyan-400 z-10 shadow-[0_0_10px_#22d3ee]" />
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
                      y={(isLandscape ? 70 : 120) - p.y}
                      tier={p.tier}
                      variant={currentIdx === 3 ? "google" : "normal"}
                    />
                  ))}

                  {/* Muzzle Flash for Cowboy / Space Gemini */}
                  {isShooting &&
                    (currentIdx === 3 ||
                      currentIdx === 4 ||
                      currentIdx === 5) && (
                      <motion.div
                        initial={{ opacity: 1, scale: 0.5 }}
                        animate={{ opacity: 0, scale: 1.5 }}
                        className="absolute z-50 w-8 h-8 bg-yellow-400 rounded-full blur-md"
                        style={{
                          left: `${playerXRef.current + 70}px`,
                          bottom: `${(isLandscape ? 70 : 120) - playerYRef.current + 30}px`,
                        }}
                      />
                    )}

                  {/* Competitors Group */}
                  {enemiesRef.current.map(
                    (enemy) =>
                      !enemy.isDead &&
                      enemy.variant !== "farmer" &&
                      enemy.variant !== "professor" && (
                        <div
                          id={`enemy-${enemy.id}`}
                          key={enemy.id}
                          className="absolute z-20 will-change-transform"
                          style={{
                            left: `${enemy.x}px`,
                            bottom: `${(isLandscape ? 70 : 120) - enemy.y}px`,
                            transform: `scale(${(enemy.size || 1) * (isLandscape ? 0.85 : 0.95)}) ${enemy.behavior === "roll" ? `rotate(${enemy.phase}deg)` : ""}`,
                            transformOrigin: "bottom",
                            filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.9))",
                          }}
                        >
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
                                : currentLevel.number === 2
                                  ? "target"
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
                        bottom: `${(isLandscape ? 70 : 120) - playerYRef.current - 20}px`,
                        transform: `scale(${isLandscape ? (window.innerHeight < 500 ? 0.9 : 1.8) : 2.25})`,
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
                        bottom: `${isLandscape ? 70 : 120}px`,
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
                      className="absolute z-[25] pointer-events-none will-change-transform [@media(max-height:500px)]:scale-[0.5] [@media(max-height:500px)]:origin-bottom"
                      style={{
                        left: `${playerXRef.current - 55}px`,
                        bottom: `${(isLandscape ? 70 : 120) - playerYRef.current - 14}px`,
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
                      bottom: `${(isLandscape ? 70 : 120) - playerYRef.current}px`,
                      transformOrigin: "bottom",
                      transform: `scale(${(isFlying ? 0.9 : powerLevel === 2 ? 1.0 : powerLevel === 1 ? 1.0 : 0.8) * (isLandscape ? (currentIdx === 3 ? 1.8 : 1.05) : currentIdx === 3 ? 2.25 : 1)})`,
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
          <div className="fixed inset-0 pointer-events-none z-[9000] [@media(max-height:500px)]:scale-[0.5] [@media(max-height:500px)]:origin-top">
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
                      duration: 6,
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
                <div className="w-64 h-20 bg-slate-400 rounded-[100%] border-b-6 border-slate-600 shadow-[0_20px_50px_rgba(34,211,238,0.5)] relative z-20">
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
                  duration: 6,
                  times: [0, 0.28, 0.82, 0.9],
                  ease: "easeInOut",
                }}
                className="absolute bottom-28 landscape:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center"
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
                  duration: 5,
                  times: [0, 0.2, 0.3, 0.46, 0.58, 0.72, 0.84, 1],
                  ease: "easeInOut",
                }}
                className="absolute bottom-24 landscape:bottom-12 left-[32%] -translate-x-1/2 flex flex-col items-center"
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

            {/* Fade to black → World 6 title card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isAbducting ? { opacity: [0, 0, 1, 1] } : { opacity: 0 }}
              transition={{ times: [0, 0.64, 0.72, 1], duration: 9 }}
              className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center"
            ></motion.div>
          </div>
        )}

        {/* Farmer Boss Overlay — tractor anchored to bottom-right ground line */}
        {currentLevel && hasFarmer && gameState === "playing" && (
          <div className="fixed bottom-[120px] landscape:bottom-[70px] right-16 pointer-events-none z-[150] [@media(max-height:500px)]:scale-[0.5] [@media(max-height:500px)]:origin-bottom-right">
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
                transform: "scale(1.3)",
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
        {currentLevel && hasProfessor && gameState === "playing" && (
          <div className="fixed bottom-[120px] landscape:bottom-[70px] right-16 pointer-events-none z-[150] [@media(max-height:500px)]:scale-[0.5] [@media(max-height:500px)]:origin-bottom-right">
            <div className="flex justify-center mb-1">
              <div
                className={`text-white text-[8px] px-2 py-0.5 rounded font-black uppercase border border-blue-400 ${profPhase === "throwing" ? "bg-red-700" : "bg-blue-700/90"}`}
              >
                {profPhase === "throwing" ? "TESTING!" : "MAD PROFESSOR"}
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
            {/* Big impact explosion at center */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
              style={{
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

        {/* TOUCH CONTROLS (Only visible on small screens) */}
        {gameState === "playing" && (
          <div className="fixed bottom-6 landscape:bottom-2 inset-x-0 flex justify-between px-6 landscape:px-12 z-[60] pointer-events-none lg:hidden [@media(max-height:500px)]:scale-[0.8] [@media(max-height:500px)]:origin-bottom">
            <div className="flex gap-4 landscape:gap-2 pointer-events-auto items-end">
              <button
                className="w-16 h-16 landscape:w-10 landscape:h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center active:scale-90 active:bg-white/30 text-white text-2xl landscape:text-lg select-none shadow-xl"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  keysPressed.current["ArrowLeft"] = true;
                }}
                onPointerUp={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  keysPressed.current["ArrowLeft"] = false;
                }}
                onPointerLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  keysPressed.current["ArrowLeft"] = false;
                }}
              >
                ←
              </button>
              <button
                className="w-16 h-16 landscape:w-10 landscape:h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center active:scale-90 active:bg-white/30 text-white text-2xl landscape:text-lg select-none shadow-xl"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  keysPressed.current["ArrowRight"] = true;
                }}
                onPointerUp={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  keysPressed.current["ArrowRight"] = false;
                }}
                onPointerLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  keysPressed.current["ArrowRight"] = false;
                }}
              >
                →
              </button>
            </div>
            <div className="flex gap-4 landscape:gap-2 pointer-events-auto items-end">
              {(powerLevel > 0 ||
                currentIdx === 3 ||
                currentIdx === 4 ||
                currentIdx === 5) && (
                <button
                  className="w-16 h-16 landscape:w-12 landscape:h-12 bg-blue-500/40 backdrop-blur-md border border-blue-400/50 rounded-full flex items-center justify-center active:scale-90 active:bg-blue-500/60 text-white text-2xl landscape:text-lg select-none z-[75] shadow-xl"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    shoot();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    shoot();
                  }}
                >
                  {currentIdx === 3
                    ? "🔫"
                    : currentIdx === 4 || currentIdx === 5
                      ? "⚡"
                      : "🔥"}
                </button>
              )}
              <div className="flex flex-col gap-2">
                {isFlying && (
                  <button
                    className="w-20 h-20 landscape:w-16 landscape:h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center active:scale-95 active:bg-white/30 text-white font-black select-none z-[70] shadow-xl text-sm"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      keysPressed.current["ArrowDown"] = true;
                    }}
                    onPointerUp={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      keysPressed.current["ArrowDown"] = false;
                    }}
                    onPointerLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      keysPressed.current["ArrowDown"] = false;
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      keysPressed.current["ArrowDown"] = true;
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      keysPressed.current["ArrowDown"] = false;
                    }}
                  >
                    DN
                  </button>
                )}
                <button
                  className="w-20 h-20 landscape:w-16 landscape:h-16 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center active:scale-95 active:bg-white/40 text-white font-black select-none z-[70] shadow-xl text-sm"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isFlying) {
                      keysPressed.current["TouchJump"] = true;
                    } else {
                      triggerJump();
                    }
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    keysPressed.current["TouchJump"] = false;
                  }}
                  onPointerLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    keysPressed.current["TouchJump"] = false;
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isFlying) {
                      keysPressed.current["TouchJump"] = true;
                    } else {
                      triggerJump();
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    keysPressed.current["TouchJump"] = false;
                  }}
                >
                  {isFlying ? "UP" : "JMP"}
                </button>
              </div>
            </div>
          </div>
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
          <div className="absolute top-0 inset-x-0 h-[40px] landscape:h-[28px] w-full flex justify-center z-50 pointer-events-none bg-black/80 backdrop-blur-md border-b border-white/10">
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
              className="flex flex-col items-center justify-center py-4 w-full [@media(max-height:500px)]:scale-[0.6] origin-center z-10 text-center"
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
                <Sparkles className="w-12 h-12 md:w-24 md:h-24 landscape:w-16 landscape:h-16 text-blue-400 relative z-10 drop-shadow-[0_0_30px_rgba(96,165,250,0.5)]" />
              </div>
              <h1
                style={{ fontSize: "clamp(1rem, 4vmin, 3rem)" }}
                className="font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600 italic uppercase shrink-0 leading-none"
              >
                VIBE GAME
              </h1>
              <p
                style={{ fontSize: "clamp(0.5rem, 2vmin, 1.5rem)" }}
                className="text-gray-400 font-light max-w-2xl mx-auto my-1 md:my-6 landscape:my-2 leading-relaxed shrink-0 text-center px-4"
              >
                Run through the AI Cosmos. Dodge the competitors.
                <br />
                Collect{" "}
                <span className="text-yellow-400 font-bold">Dollars</span> to
                fire <span className="text-blue-400 font-bold">Tokens</span>.
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStart();
                }}
                className="mt-2 md:mt-4 px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white font-black text-lg md:text-3xl rounded-full hover:bg-blue-500 hover:scale-110 active:scale-95 transition-all shadow-2xl flex items-center gap-3 landscape:text-lg landscape:py-2 landscape:px-6"
              >
                START DISCOVERY{" "}
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <div className="mt-6 flex flex-col items-center gap-2">
                <p className="text-white/30 text-[10px] uppercase tracking-widest">
                  — Jump to World —
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-xs">
                  {LEVELS.map((level, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJumpToLevel(idx);
                      }}
                      className="w-7 h-7 landscape:w-6 landscape:h-6 bg-white/5 hover:bg-blue-600 border border-white/10 rounded border-b-2 text-white/50 hover:text-white font-black text-[10px] md:text-xs transition-all hover:scale-110 active:scale-95"
                    >
                      {level.number}
                    </button>
                  ))}
                </div>
              </div>
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
              currentLevel?.environment === "nebula") && <TransitionGame />}

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
              className="flex flex-col items-center justify-center py-4 relative w-full [@media(max-height:500px)]:scale-[0.6] origin-center z-10"
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
              className="flex flex-col items-center justify-center py-4 px-4 w-full [@media(max-height:500px)]:scale-[0.6] origin-center z-10"
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
                className="px-6 md:px-12 py-3 md:py-6 bg-blue-600 text-white font-black text-lg md:text-3xl rounded-full hover:bg-white hover:text-blue-600 transition-all shadow-[0_0_60px_rgba(59,130,246,0.9)] flex items-center gap-4 group landscape:text-lg landscape:py-3 landscape:px-6"
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
            className="fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center justify-center z-[9999] bg-blue-950/90 backdrop-blur-md"
          >
            <div
              className="flex flex-col items-center justify-center py-4 w-full [@media(max-height:500px)]:scale-[0.6] origin-center z-10"
            >
              <h2
                style={{ fontSize: "clamp(1rem, 4vmin, 3rem)" }}
                className="leading-none font-black tracking-tighter italic text-center"
              >
                UNITY
              </h2>
              <p
                style={{ fontSize: "clamp(0.5rem, 2vmin, 1.5rem)" }}
                className="text-blue-200 mt-4 mb-12 text-center px-4"
              >
                Gemini has unified the 10 dimensions.
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="flex items-center gap-4 px-8 py-4 bg-white text-blue-900 font-black text-lg md:text-2xl rounded-full hover:scale-110 transition-all shadow-2xl"
              >
                <RotateCcw className="w-8 h-8" /> RESTART VOYAGE
              </button>
            </div>
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

      <RotateScreen />
    </main>
  );
}
