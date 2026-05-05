import { motion } from "motion/react";
import {
  Sparkles,
  Brain,
  Cpu,
  ZapOff,
  Skull,
  Moon,
  Fish,
  Rocket,
  Bug,
  Axe,
  Zap,
  Bot,
  Wind,
  Search,
} from "lucide-react";
import { cn } from "../lib/utils";

export type CompetitorType =
  | "gpt"
  | "claude"
  | "copilot"
  | "deepseek"
  | "prompt"
  | "llama"
  | "grok"
  | "mistral"
  | "perplexity";
export type CompetitorVariant =
  | "zombie"
  | "werewolf"
  | "ufo"
  | "fish"
  | "cow"
  | "sheep"
  | "pig"
  | "normal"
  | "farmer"
  | "missile"
  | "target"
  | "horse"
  | "native"
  | "native_rider"
  | "enemy_laser"
  | "professor"
  | "flask"
  | "wrench"
  | "gadget"
  | "alien"
  | "helicopter";

interface CompetitorProps {
  type: CompetitorType;
  action: string;
  isMoving: boolean;
  behavior?: string;
  text?: string;
  variant?: CompetitorVariant;
  facing?: "left" | "right";
}

export const Competitor = ({
  type,
  action,
  isMoving,
  behavior,
  text,
  variant = "normal",
  facing = "right",
}: CompetitorProps) => {
  const isClose = action.includes("lunge") || isMoving;
  const isPrompt = type === "prompt";
  const isHeadOnly = behavior === "roll" || behavior === "bounce";

  const getIcon = () => {
    if (variant === "fish") return <Fish className="w-4 h-4 text-cyan-200" />;
    if (variant === "ufo")
      return <Rocket className="w-4 h-4 text-purple-200" />;
    if (variant === "cow")
      return <div className="text-[10px] font-black tracking-tighter">MOO</div>;
    if (variant === "sheep")
      return <div className="text-[10px] font-black tracking-tighter">BAA</div>;
    if (variant === "pig")
      return (
        <div className="text-[10px] font-black tracking-tighter">OINK</div>
      );

    switch (type) {
      case "gpt":
        return (
          <Brain
            className={`w-4 h-4 ${variant === "zombie" ? "text-lime-400" : variant === "werewolf" ? "text-amber-700" : "text-emerald-400"}`}
          />
        );
      case "claude":
        return (
          <Sparkles
            className={`w-4 h-4 ${variant === "zombie" ? "text-lime-400" : variant === "werewolf" ? "text-amber-700" : "text-amber-400"}`}
          />
        );
      case "copilot":
        return (
          <Cpu
            className={`w-4 h-4 ${variant === "zombie" ? "text-lime-400" : variant === "werewolf" ? "text-amber-700" : "text-slate-300"}`}
          />
        );
      case "deepseek":
        return (
          <Rocket
            className={`w-4 h-4 ${variant === "zombie" ? "text-lime-400" : variant === "werewolf" ? "text-amber-700" : "text-blue-400"}`}
          />
        );
      case "llama":
        return (
          <Bot
            className={`w-4 h-4 ${variant === "zombie" ? "text-lime-400" : "text-orange-300"}`}
          />
        );
      case "grok":
        return (
          <Zap
            className={`w-4 h-4 ${variant === "zombie" ? "text-lime-400" : "text-white"}`}
          />
        );
      case "mistral":
        return (
          <Wind
            className={`w-4 h-4 ${variant === "zombie" ? "text-lime-400" : "text-orange-200"}`}
          />
        );
      case "perplexity":
        return (
          <Search
            className={`w-4 h-4 ${variant === "zombie" ? "text-lime-400" : "text-teal-300"}`}
          />
        );
      default:
        return null;
    }
  };

  const getName = () => {
    const baseName =
      type === "gpt"
        ? "GPT"
        : type === "claude"
          ? "Claude"
          : type === "copilot"
            ? "Copilot"
            : type === "deepseek"
              ? "DeepSeek"
              : type === "llama"
                ? "Llama"
                : type === "grok"
                  ? "Grok"
                  : type === "mistral"
                    ? "Mistral"
                    : type === "perplexity"
                      ? "Perplexity"
                      : type === "prompt"
                        ? "PROMPT"
                        : "";
    if (variant === "target") return baseName;
    if (variant === "zombie") return `ZOMBIE ${baseName}`;
    if (variant === "werewolf") return `WERE-${baseName}`;
    if (variant === "ufo") return `ALIEN ${baseName}`;
    if (variant === "alien") return `ALIEN ${baseName}`;
    if (variant === "fish") return `AQUA ${baseName}`;
    if (variant === "cow") return `MAD ${baseName}`;
    if (variant === "horse") return `WILD HORSE`;
    if (variant === "sheep") return `CRAZY ${baseName}`;
    if (variant === "pig") return `WILD ${baseName}`;
    if (variant === "missile") return `HOMING ${baseName}`;
    if (variant === "native") return `${baseName} WARRIOR`;
    if (variant === "native_rider") return `${baseName} RIDER`;
    if (variant === "flask") return "ACID FLASK";
    if (variant === "wrench") return "PLASMA WRENCH";
    if (variant === "gadget") return "GLITCH GADGET";
    if (variant === "professor") return "MAD PROFESSOR";
    return baseName;
  };

  const getColors = () => {
    if (type === "prompt")
      return "from-white to-neutral-300 border-neutral-400";
    if (variant === "zombie")
      return type === "gpt"
        ? "from-green-800 to-black border-lime-500 shadow-lime-500/20"
        : type === "claude"
          ? "from-teal-800 to-black border-teal-500 shadow-teal-500/20"
          : "from-emerald-900 to-black border-emerald-500 shadow-emerald-500/20";
    if (variant === "werewolf")
      return type === "gpt"
        ? "from-stone-600 to-black border-stone-400 shadow-orange-500/20"
        : type === "claude"
          ? "from-amber-900 to-black border-orange-500 shadow-red-500/20"
          : "from-yellow-900 to-black border-yellow-600 shadow-yellow-500/20";
    if (variant === "ufo")
      return "from-fuchsia-900 via-purple-900 to-black border-fuchsia-500 shadow-fuchsia-500/40 rounded-full";
    if (variant === "fish")
      return "from-cyan-600 via-blue-800 to-black border-cyan-400 shadow-cyan-500/30 rounded-r-3xl rounded-l-md";
    if (variant === "missile")
      return "from-red-600 via-orange-600 to-black border-red-500 shadow-red-500/50 rounded-r-full rounded-l-md";
    if (variant === "professor")
      return "from-stone-300 via-stone-400 to-white border-blue-500 shadow-blue-500/20";
    if (variant === "flask")
      return "from-green-400 to-lime-600 border-green-800 shadow-green-500/80 rounded-t-full rounded-b-none";
    if (variant === "wrench")
      return "from-zinc-400 to-slate-700 border-zinc-900 shadow-zinc-500/40";
    if (variant === "gadget")
      return "from-fuchsia-500 to-pink-700 border-fuchsia-200 shadow-fuchsia-500/80";
    if (variant === "cow" || variant === "sheep" || variant === "pig")
      return "from-white via-stone-200 to-stone-400 border-black shadow-stone-500/20 rounded-md bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]";

    switch (type) {
      case "gpt":
        return "from-gray-500 to-gray-800 border-gray-400 shadow-gray-500/20";
      case "claude":
        return "from-purple-600 to-purple-900 border-purple-500 shadow-purple-500/20";
      case "copilot":
        return "from-blue-600 to-blue-900 border-blue-500 shadow-blue-500/20";
      case "deepseek":
        return "from-sky-600 to-sky-900 border-sky-400 shadow-sky-500/20";
      case "llama":
        return "from-orange-500 to-amber-800 border-orange-400 shadow-orange-500/20";
      case "grok":
        return "from-zinc-700 to-black border-white/60 shadow-white/10";
      case "mistral":
        return "from-orange-400 to-red-700 border-orange-300 shadow-orange-400/20";
      case "perplexity":
        return "from-teal-500 to-cyan-800 border-teal-400 shadow-teal-500/20";
      default:
        return "";
    }
  };

  if (variant === "professor") {
    return (
      <div className="relative w-16 h-16 flex flex-col items-center">
        <motion.div
          className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-50 delay-100"
          animate={{ scale: [1, 1.1, 1], y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <div className="bg-blue-600 text-white text-[7px] px-1.5 py-0.5 rounded-sm font-black italic mb-0.5 border border-white/20 uppercase">
            DR. {getName()}
          </div>
        </motion.div>

        <div className="absolute inset-0" style={{ transform: "scaleX(-1)" }}>
        {/* Head */}
        <motion.div
          className="absolute top-0 right-1 w-10 h-10 rounded-[40%_60%_70%_30%] border-2 border-black bg-stone-100 flex items-center justify-center z-30"
          animate={isMoving ? { y: [0, -2, 0], rotate: [-10, 10, -10] } : {}}
          transition={{ repeat: Infinity, duration: 0.3 }}
          style={{ transformOrigin: "bottom center" }}
        >
          {/* Crazy white hair - electric spiky */}
          <div className="absolute -left-4 -top-2 w-6 h-6 border-t-4 border-l-4 border-gray-300 rounded-tr-full -rotate-45" />
          <div className="absolute -right-4 -top-0 w-6 h-6 border-t-4 border-r-4 border-gray-300 rounded-tl-full rotate-45" />
          <div className="absolute -top-4 w-6 h-8 border-t-4 border-l-4 border-gray-300 rounded-tr-full -rotate-12" />
          <div className="absolute -top-3 w-5 h-6 border-t-4 border-r-4 border-gray-300 rounded-tl-full rotate-[30deg]" />

          {/* Goggles on forehead */}
          <div className="absolute -top-2 inset-x-0 h-4 flex items-center justify-center gap-[1px]">
            <div className="w-4 h-4 border-2 border-slate-800 bg-emerald-400 rounded-full shadow-[inset_0_0_4px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-yellow-200 rounded-full blur-[1px]" />
            </div>
            <div className="w-4 h-4 border-2 border-slate-800 bg-emerald-400 rounded-full shadow-[inset_0_0_4px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-yellow-200 rounded-full blur-[1px]" />
            </div>
          </div>
          <div className="absolute -top-1 left-0 right-0 h-1 bg-slate-800 -z-10" />

          {/* Big crazy eye */}
          <div className="absolute top-2 left-2 w-3.5 h-3.5 bg-white border border-black rounded-full flex items-center justify-center transform rotate-12">
            <div className="w-1 h-1 bg-black rounded-full" />
          </div>
          {/* Smaller crazy eye */}
          <div className="absolute top-3 left-6 w-2 h-2 bg-white border border-black rounded-full flex items-center justify-center">
            <div className="w-0.5 h-0.5 bg-black rounded-full" />
          </div>

          {/* Huge grin */}
          <div className="absolute bottom-1 left-3 w-6 h-3 bg-red-900 border border-black rounded-b-full overflow-hidden flex justify-between">
            {/* Teeth */}
            <div className="w-full h-1 bg-white mb-auto mt-0" />
            <div className="absolute bottom-0 w-full h-0.5 bg-white" />
          </div>
        </motion.div>

        {/* Hunched Body */}
        <motion.div
          className="absolute top-6 right-2 w-10 h-8 bg-white border-2 border-black rounded-t-3xl rounded-bl-3xl flex justify-center z-20 overflow-hidden"
          animate={isMoving ? { y: [0, 1, 0], rotate: [-2, 2, -2] } : {}}
          transition={{ repeat: Infinity, duration: 0.15 }}
          style={{ transformOrigin: "bottom right" }}
        >
          {/* Lab Coat Details */}
          <div className="absolute top-2 right-2 w-2 h-2 border-b-2 border-l-2 border-gray-400" />
          <div className="absolute bottom-0 inset-x-0 h-2 bg-gray-200" />

          {/* Green splatter on coat */}
          <div className="absolute top-4 left-3 w-2 h-2 bg-lime-400 rounded-full blur-[1px]" />
          <div className="absolute top-6 left-5 w-1.5 h-1.5 bg-lime-400 border border-lime-600 rounded-full" />
        </motion.div>

        {/* Left Arm holding flask */}
        <motion.div
          className="absolute top-8 left-0 w-8 h-3 bg-white border-2 border-black rounded-full origin-right z-30"
          animate={
            action === "throwing"
              ? { rotate: [60, -90] }
              : isMoving
                ? { rotate: [10, -20] }
                : { rotate: 5 }
          }
          transition={
            action === "throwing"
              ? { duration: 0.5 }
              : { repeat: Infinity, duration: 0.3, repeatType: "mirror" }
          }
        >
          {/* Black Glove */}
          <div className="absolute -left-2 -top-1 w-4 h-5 bg-slate-800 border-2 border-black rounded-full flex items-center justify-center">
            {/* Flask */}
            <div className="absolute -top-6 w-4 h-6 bg-lime-400 border border-black rounded-b-md shadow-[0_0_10px_rgba(163,230,53,0.8)] flex flex-col items-center">
              <div className="w-2 h-3 border-l border-r border-black" />
              <div className="w-2 h-1 bg-slate-200 border-b border-black -mt-1" />
              <div className="text-[4px] font-black mt-1 text-black">X</div>
            </div>
          </div>
        </motion.div>

        {/* Right Arm swinging back */}
        <motion.div
          className="absolute top-8 right-2 w-8 h-3 bg-white border-2 border-black border-l-0 rounded-r-full z-10 origin-left flex justify-end items-center"
          animate={
            action === "throwing"
              ? { rotate: [-100, 20] }
              : isMoving
                ? { rotate: [-40, -10] }
                : { rotate: -30 }
          }
          transition={
            action === "throwing"
              ? { duration: 0.5 }
              : { repeat: Infinity, duration: 0.3, repeatType: "mirror" }
          }
        >
          {/* Glove */}
          <div className="absolute -right-1 -top-0.5 w-3 h-4 bg-slate-800 border-2 border-black rounded-full" />
        </motion.div>

        {/* Legs - very thin and crouched */}
        <div className="absolute bottom-0 right-4 flex gap-2 z-10 w-6 justify-between">
          <motion.div
            className="w-1.5 h-4 bg-slate-800 border border-black origin-top rounded-b-sm"
            animate={isMoving ? { rotate: [-30, 40] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              repeatType: "mirror",
            }}
          >
            <div className="absolute bottom-0 -right-1 w-4 h-2 bg-[#8B4513] border border-black rounded-r-full" />
          </motion.div>
          <motion.div
            className="w-1.5 h-4 bg-slate-800 border border-black origin-top rounded-b-sm"
            animate={isMoving ? { rotate: [40, -30] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              repeatType: "mirror",
              delay: 0.1,
            }}
          >
            <div className="absolute bottom-0 -right-1 w-4 h-2 bg-[#8B4513] border border-black rounded-r-full" />
          </motion.div>
        </div>
            </div>
    </div>
    );
  }

  // RENDERING TOOLS
  if (variant === "flask") {
    return (
      <div className="relative w-8 h-10 flex flex-col items-center drop-shadow-[0_0_15px_#10b981]">
        <div className="w-3 h-4 bg-zinc-200 border-2 border-zinc-500 rounded-t-sm" />
        <div className="w-7 h-6 bg-emerald-500 border-2 border-emerald-700 rounded-b-xl font-mono text-[8px] text-emerald-900 flex items-center justify-center font-black">
          H+
        </div>
      </div>
    );
  }
  if (variant === "wrench") {
    return (
      <div className="relative w-4 h-12 flex flex-col items-center justify-between bg-zinc-400 border border-zinc-700 rounded-sm drop-shadow-[0_0_10px_#22d3ee]">
        <div className="w-6 h-5 border-[3px] border-zinc-700 rounded-t-lg bg-cyan-400 rounded-b-sm" />
        <div className="w-6 h-5 border-[3px] border-zinc-700 rounded-b-lg bg-cyan-400 rounded-t-sm" />
      </div>
    );
  }
  if (variant === "gadget") {
    return (
      <div className="relative w-8 h-8 flex flex-col items-center justify-center bg-zinc-800 border-2 border-fuchsia-500 rounded-lg shadow-[0_0_10px_#ec4899] overflow-hidden">
        <motion.div
          className="w-full h-1 bg-fuchsia-500"
          animate={{ y: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 0.4 }}
        />
        <div className="text-[6px] font-mono text-fuchsia-300 font-bold mt-1">
          ERR
        </div>
      </div>
    );
  }

  if (variant === "target") {
    return (
      <div className="relative w-16 h-20 flex flex-col items-center justify-end scale-90 landscape:scale-100">
        <motion.div
          className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-50"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="bg-white/95 text-black text-[8px] px-2 py-0.5 rounded-full font-black border-2 border-red-600 uppercase shadow-lg flex items-center gap-1.5 min-w-[60px] justify-center">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            {getName()}
          </div>
        </motion.div>

        <div className="relative flex flex-col items-center">
          {/* Robot Head */}
          <div
            className={cn(
              "w-9 h-9 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-xl bg-gradient-to-br",
              getColors(),
            )}
          >
            <div className="scale-90 text-white drop-shadow-sm">
              {getIcon()}
            </div>
          </div>

          {/* The Target Board - High visibility and "AI Caras" */}
          <motion.div
            className="absolute -top-14 w-16 h-16 rounded-full border-[6px] border-red-600 bg-white flex items-center justify-center shadow-2xl z-30 ring-4 ring-white/30"
            animate={{
              rotate: isMoving ? [-8, 8] : 0,
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              repeatType: "mirror",
            }}
          >
            {/* Bullseye Rings */}
            <div className="absolute inset-0 border-[4px] border-red-600/10 rounded-full" />
            <div className="w-10 h-10 rounded-full border-[4px] border-red-600 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shadow-inner">
                <div className="scale-125 text-white invert saturate-200 drop-shadow-md">
                  {getIcon()}
                </div>
              </div>
            </div>
            {/* Decorative crosshair */}
            <div className="absolute inset-0 border border-red-600/5 pointer-events-none" />
          </motion.div>

          {/* Arms - Simple robot arms */}
          <div className="absolute top-4 -left-3 w-4 h-1.5 bg-slate-800 rounded-full rotate-45 shadow-sm" />
          <div className="absolute top-4 -right-3 w-4 h-1.5 bg-slate-800 rounded-full -rotate-45 shadow-sm" />

          {/* Leg Movement */}
          <div className="flex gap-1.5 -mt-1.5">
            <motion.div
              className="w-2.5 h-5 bg-slate-950 rounded-b-md origin-top shadow-sm"
              animate={isMoving ? { rotate: [45, -45] } : {}}
              transition={{
                repeat: Infinity,
                duration: 0.25,
                repeatType: "mirror",
              }}
            />
            <motion.div
              className="w-2.5 h-5 bg-slate-950 rounded-b-md origin-top shadow-sm"
              animate={isMoving ? { rotate: [-45, 45] } : {}}
              transition={{
                repeat: Infinity,
                duration: 0.25,
                repeatType: "mirror",
                delay: 0.125,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isPrompt) {
    return (
      <div className="relative flex flex-col items-center">
        <motion.div
          className="bg-white border-2 border-cyan-400 px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.5)] whitespace-nowrap relative overflow-hidden"
          animate={{
            y: [0, -5, 0],
            rotate: [-1, 1, -1],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {/* Futuristic scanline effect */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-cyan-400/30 animate-[scan_2s_linear_infinite]" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center border border-cyan-200 shadow-sm">
              <Brain className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest leading-none mb-1">
                PROMPT POWER
              </span>
              <span className="text-sm font-black italic text-slate-800 font-mono tracking-tighter leading-none">
                {text || "HAZME UN LOGO"}
              </span>
            </div>
          </div>

          {/* Bubble tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-cyan-400 rotate-45" />
        </motion.div>
      </div>
    );
  }

  if (variant === "ufo") {
    const ufoColors = {
      dome:
        type === "gpt"
          ? "bg-emerald-500 border-emerald-300"
          : type === "claude"
            ? "bg-purple-500 border-purple-300"
            : type === "copilot"
              ? "bg-blue-500 border-blue-300"
              : type === "deepseek"
                ? "bg-sky-500 border-sky-300"
                : type === "llama"
                  ? "bg-orange-500 border-orange-300"
                  : type === "grok"
                    ? "bg-white border-gray-300"
                    : type === "mistral"
                      ? "bg-orange-600 border-orange-300"
                      : type === "perplexity"
                        ? "bg-teal-500 border-teal-300"
                        : "bg-fuchsia-400 border-fuchsia-200",
      dish:
        type === "gpt"
          ? "bg-emerald-800 border-emerald-600"
          : type === "claude"
            ? "bg-purple-800 border-purple-600"
            : type === "copilot"
              ? "bg-blue-800 border-blue-600"
              : type === "deepseek"
                ? "bg-sky-800 border-sky-600"
                : type === "llama"
                  ? "bg-orange-800 border-orange-600"
                  : type === "grok"
                    ? "bg-zinc-800 border-zinc-500"
                    : type === "mistral"
                      ? "bg-red-900 border-orange-600"
                      : type === "perplexity"
                        ? "bg-teal-800 border-teal-600"
                        : "bg-zinc-600 border-zinc-400",
      glow:
        type === "gpt"
          ? "rgba(16,185,129,0.6)"
          : type === "claude"
            ? "rgba(168,85,247,0.6)"
            : type === "copilot"
              ? "rgba(59,130,246,0.6)"
              : type === "deepseek"
                ? "rgba(14,165,233,0.6)"
                : type === "llama"
                  ? "rgba(249,115,22,0.6)"
                  : type === "grok"
                    ? "rgba(255,255,255,0.4)"
                    : type === "mistral"
                      ? "rgba(234,88,12,0.6)"
                      : type === "perplexity"
                        ? "rgba(20,184,166,0.6)"
                        : "rgba(217,70,239,0.5)",
      light1:
        type === "gpt"
          ? "bg-emerald-400"
          : type === "claude"
            ? "bg-purple-400"
            : type === "copilot"
              ? "bg-blue-400"
              : type === "deepseek"
                ? "bg-sky-400"
                : type === "llama"
                  ? "bg-orange-400"
                  : type === "grok"
                    ? "bg-white"
                    : type === "mistral"
                      ? "bg-orange-400"
                      : "bg-teal-400",
      beam:
        type === "gpt"
          ? "from-emerald-400/50"
          : type === "claude"
            ? "from-purple-400/50"
            : type === "copilot"
              ? "from-blue-400/50"
              : type === "deepseek"
                ? "from-sky-400/50"
                : type === "llama"
                  ? "from-orange-400/50"
                  : type === "grok"
                    ? "from-white/40"
                    : type === "mistral"
                      ? "from-orange-500/50"
                      : "from-teal-400/50",
    };
    return (
      <div className="relative w-16 h-12 flex flex-col items-center justify-center">
        <motion.div
          className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          animate={{ scale: [1, 1.1, 1], y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <div
            className={`text-white text-[7px] px-1.5 py-0.5 rounded-sm font-black italic border border-white/20 uppercase ${type === "gpt" ? "bg-emerald-700" : type === "claude" ? "bg-purple-700" : type === "copilot" ? "bg-blue-700" : type === "deepseek" ? "bg-sky-700" : type === "llama" ? "bg-orange-700" : type === "grok" ? "bg-zinc-700" : type === "mistral" ? "bg-orange-800" : type === "perplexity" ? "bg-teal-700" : "bg-fuchsia-700"}`}
          >
            {getName()}
          </div>
        </motion.div>
        <motion.div
          className="relative z-20 w-16 h-8 flex flex-col items-center justify-center"
          animate={isMoving ? { y: [-4, 4, -4] } : {}}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div
            className={`w-8 h-4 rounded-t-full border-t border-x flex items-center justify-center ${ufoColors.dome}`}
          >
            <div className="scale-50 opacity-90">{getIcon()}</div>
          </div>
          <div
            className={`w-16 h-4 rounded-full border flex items-center justify-evenly px-2 ${ufoColors.dish}`}
            style={{ boxShadow: `0 0 15px ${ufoColors.glow}` }}
          >
            <motion.div
              className={`w-1.5 h-1.5 rounded-full ${ufoColors.light1}`}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
            />
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-yellow-400"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 0.4, delay: 0.13 }}
            />
            <motion.div
              className={`w-1.5 h-1.5 rounded-full ${ufoColors.light1}`}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.4, delay: 0.26 }}
            />
          </div>
          <div
            className={`absolute top-full w-12 h-16 bg-gradient-to-b ${ufoColors.beam} to-transparent blur-sm rounded-b-full pointer-events-none`}
          />
        </motion.div>
      </div>
    );
  }

  if (variant === "horse") {
    return (
      <div
        className="relative w-16 h-14 flex flex-col items-center justify-end"
        style={{ transform: facing === "left" ? "scaleX(-1)" : undefined }}
      >
        <motion.div
          className="relative flex items-end"
          animate={
            isMoving
              ? {
                  y: [0, -2, 0],
                  rotate: [0, -1, 1, 0],
                }
              : {}
          }
          transition={{ repeat: Infinity, duration: 0.2 }}
        >
          {/* Horse Tail */}
          <motion.div
            className="absolute -left-2 top-2 w-3 h-7 bg-amber-950 rounded-bl-full origin-top-right z-0"
            animate={isMoving ? { rotate: [-10, 20] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              repeatType: "mirror",
            }}
          />

          {/* Horse Body */}
          <div className="w-14 h-8 bg-amber-700 rounded-xl border-2 border-black relative overflow-hidden flex items-center justify-center shadow-inner z-10">
            {/* Saddle */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-red-800 border-b-2 border-x-2 border-black rounded-b-md" />
          </div>

          {/* Horse Neck and Head */}
          <motion.div
            className="absolute -right-3 -top-5 w-6 h-9 border-t-2 border-r-2 border-b-2 border-black rounded-tr-xl flex flex-col items-center bg-amber-700 origin-bottom-left z-20"
            animate={isMoving ? { rotate: [-2, 2] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.4,
              repeatType: "mirror",
            }}
          >
            {/* Ears */}
            <div className="flex justify-between w-full px-1 -mt-2">
              <div className="w-1.5 h-3 bg-amber-800 border border-black rounded-t-full rotate-[-20deg]" />
              <div className="w-1.5 h-3 bg-amber-800 border border-black rounded-t-full rotate-[20deg]" />
            </div>
            {/* Snout */}
            <div className="w-6 h-5 absolute bottom-2 -right-4 bg-amber-600 border-2 border-black rounded-r-lg flex flex-col justify-end pb-0.5 pr-1 z-30">
              <div className="w-1 h-1 bg-black rounded-full self-end" />
            </div>
            {/* Eye */}
            <div className="w-1 h-1 bg-black rounded-full absolute top-2 right-2" />
            {/* Mane */}
            <div className="absolute -left-1 top-0 bottom-0 w-2 bg-amber-950 border-y border-black rounded-l-md" />
            {/* Reins */}
            <div className="absolute top-2 -right-2 w-6 h-5 border-t border-r border-black rounded-tr-full opacity-50" />
          </motion.div>

          {/* Legs */}
          <motion.div
            className="absolute -bottom-3 left-1 w-1.5 h-4 bg-amber-800 border border-black origin-top rounded-b-sm z-0"
            animate={isMoving ? { rotate: [30, -30] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              repeatType: "mirror",
            }}
          />
          <motion.div
            className="absolute -bottom-3 left-4 w-1.5 h-4 bg-amber-900 border border-black origin-top rounded-b-sm z-10"
            animate={isMoving ? { rotate: [-30, 30] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              repeatType: "mirror",
            }}
          />
          <motion.div
            className="absolute -bottom-3 right-5 w-1.5 h-4 bg-amber-800 border border-black origin-top rounded-b-sm z-0"
            animate={isMoving ? { rotate: [30, -30] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              repeatType: "mirror",
            }}
          />
          <motion.div
            className="absolute -bottom-3 right-1 w-1.5 h-4 bg-amber-900 border border-black origin-top rounded-b-sm z-10"
            animate={isMoving ? { rotate: [-30, 30] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              repeatType: "mirror",
            }}
          />
        </motion.div>
      </div>
    );
  }

  if (variant === "cow" || variant === "sheep" || variant === "pig") {
    return (
      <div className="relative w-14 h-12 flex flex-col items-center justify-end">
        <motion.div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <div className="bg-red-600 text-white text-[7px] px-1.5 py-0.5 rounded-sm font-black italic border border-white/20 uppercase">
            {variant === "cow"
              ? "MOO ERROR 404"
              : variant === "sheep"
                ? "BAA FATAL EXCEPTION"
                : "OINK OVERFLOW"}
          </div>
        </motion.div>
        <motion.div
          className="relative flex items-end"
          animate={
            isMoving
              ? {
                  x: behavior === "sprint" ? [-2, 2, -2] : [0, 0],
                  y: [0, -6, 0],
                  rotate: behavior === "sprint" ? [-5, 5, -5] : [0, -5, 5, 0],
                }
              : {}
          }
          transition={{
            repeat: Infinity,
            duration: behavior === "sprint" ? 0.15 : 0.3,
          }}
        >
          {/* Animal Body */}
          <div
            className={`w-12 h-8 rounded-xl border-2 border-black relative overflow-hidden flex items-center justify-center ${variant === "sheep" ? "bg-slate-200 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]" : variant === "pig" ? "bg-pink-300" : "bg-white"}`}
          >
            {variant === "cow" && (
              <>
                <div className="absolute top-1 left-2 w-3 h-3 bg-black rounded-full" />
                <div className="absolute bottom-1 right-2 w-4 h-4 bg-black rounded-full" />
              </>
            )}
            {variant === "sheep" && (
              <div className="absolute inset-0">
                <div className="absolute top-1 left-1 w-2 h-2 bg-slate-300 rounded-full" />
                <div className="absolute top-4 right-1 w-3 h-3 bg-slate-300 rounded-full" />
                <div className="absolute bottom-1 left-4 w-2 h-2 bg-slate-300 rounded-full" />
              </div>
            )}
            {variant === "pig" && (
              <div
                className="absolute right-1 bottom-1 w-3 h-3 border-2 border-pink-400 rounded-full"
                style={{
                  clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)",
                }}
              />
            )}
            <div className="opacity-20 scale-125 saturate-0 relative z-10">
              {getIcon()}
            </div>
          </div>
          {/* Animal Head */}
          <div
            className={`absolute -left-2 -top-2 w-8 h-8 border-2 border-black rounded-md flex flex-col items-center ${variant === "sheep" ? "bg-slate-800" : variant === "pig" ? "bg-pink-400" : "bg-white"}`}
          >
            <div className="flex justify-between w-full px-1 -mt-2">
              {variant === "cow" && (
                <>
                  <div className="w-1 h-2 bg-stone-300 border border-black rounded-t-sm rotate-[-30deg]" />
                  <div className="w-1 h-2 bg-stone-300 border border-black rounded-t-sm rotate-[30deg]" />
                </>
              )}
              {variant === "sheep" && (
                <>
                  <div className="w-2 h-2 bg-slate-200 border border-black rounded-full -ml-1 mt-1" />
                  <div className="w-2 h-2 bg-slate-200 border border-black rounded-full -mr-1 mt-1" />
                </>
              )}
              {variant === "pig" && (
                <>
                  <div className="w-2 h-2 bg-pink-500 border border-black rounded-md rotate-[-15deg] -ml-1" />
                  <div className="w-2 h-2 bg-pink-500 border border-black rounded-md rotate-[15deg] -mr-1" />
                </>
              )}
            </div>
            <div
              className={`flex gap-1 mt-1 font-black text-[6px] font-mono ${variant === "sheep" ? "text-slate-200" : variant === "pig" ? "text-pink-900" : "text-red-600"}`}
            >
              {type === "gpt"
                ? "GPT"
                : type === "claude"
                  ? "CLD"
                  : type === "copilot"
                    ? "COP"
                    : type === "llama"
                      ? "LLM"
                      : type === "grok"
                        ? "GRK"
                        : type === "mistral"
                          ? "MST"
                          : type === "perplexity"
                            ? "PRX"
                            : "DSK"}
            </div>
            <div
              className={`w-full h-3 mt-auto border-t-2 border-black flex items-center justify-around ${variant === "pig" ? "bg-pink-500 rounded-b-md" : "bg-pink-300"}`}
            >
              {/* Smoke from nostrils */}
              <motion.div
                className="w-1 h-1 bg-white/80 rounded-full blur-[1px]"
                animate={{ y: [-2, -8], opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
              <motion.div
                className="w-1 h-1 bg-white/80 rounded-full blur-[1px]"
                animate={{ y: [-2, -8], opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>
          {/* Legs */}
          <div className="absolute -bottom-2 left-2 w-1.5 h-3 bg-black" />
          <div className="absolute -bottom-2 right-2 w-1.5 h-3 bg-black" />
        </motion.div>
      </div>
    );
  }

  if (variant === "missile") {
    return (
      <div className="relative w-16 h-10 flex flex-col items-center">
        <motion.div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <div className="bg-red-600 text-white text-[7px] px-1.5 py-0.5 rounded-sm font-black italic border border-white/20 uppercase">
            {getName()}
          </div>
        </motion.div>
        <motion.div
          className="relative w-16 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-l-md rounded-r-full border-2 border-red-800 flex items-center justify-end pr-2 overflow-hidden"
          animate={{ scale: [1, 1.05, 1], x: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 0.2 }}
        >
          {/* Thruster exhaust */}
          <motion.div
            className="absolute -left-2 w-4 h-6 bg-yellow-400 blur-[2px] rounded-full"
            animate={{ scaleX: [1, 2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 0.1 }}
          />
          {getIcon()}
        </motion.div>
      </div>
    );
  }

  if (variant === "fish") {
    return (
      <div className="relative w-12 h-10 flex flex-col items-center">
        <motion.div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <div className="bg-cyan-600 text-white text-[7px] px-1.5 py-0.5 rounded-sm font-black italic border border-white/20 uppercase">
            {getName()}
          </div>
        </motion.div>
        <motion.div
          className="relative w-12 h-8 bg-cyan-500 rounded-l-full rounded-r-md border-2 border-cyan-800 flex items-center"
          animate={isMoving ? { y: [-2, 2, -2], rotate: [-5, 5, -5] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          <div
            className="absolute -right-2 top-1 w-4 h-6 bg-cyan-600 border-2 border-cyan-800 rounded-r-full"
            style={{ clipPath: "polygon(0 50%, 100% 0, 100% 100%)" }}
          />
          <div className="w-3 h-3 bg-white rounded-full ml-2 flex items-center justify-center border border-cyan-900 overflow-hidden">
            <div className="scale-75 opacity-70">{getIcon()}</div>
          </div>
          <div className="absolute -top-3 left-4 w-4 h-4 bg-cyan-600 border-2 border-cyan-800 rounded-t-full" />
          <div className="absolute -bottom-2 left-4 w-3 h-3 bg-cyan-600 border-2 border-cyan-800 rounded-b-full" />
        </motion.div>
      </div>
    );
  }

  if (variant === "farmer") {
    return (
      <div className="relative w-12 h-14 flex flex-col items-center">
        <motion.div
          className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-50"
          animate={{ scale: [1, 1.1, 1], y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <div className="bg-orange-600 text-white text-[7px] px-1.5 py-0.5 rounded-sm font-black italic mb-0.5 border border-white/20 uppercase">
            FARMER {getName()}
          </div>
        </motion.div>

        {/* Head */}
        <motion.div
          className={`relative z-20 w-8 h-8 rounded-lg ${action === "throwing" ? "bg-red-500" : "bg-red-400"} border-2 border-red-900 flex flex-col items-center justify-center shadow-lg pt-1`}
          animate={
            action === "throwing"
              ? { rotate: [-10, 10, -10], y: [-2, 2, -2] }
              : isMoving
                ? { rotate: [2, -2, 2], y: [0, -2, 0] }
                : {}
          }
          transition={
            action === "throwing"
              ? { repeat: Infinity, duration: 0.1 }
              : { repeat: Infinity, duration: 0.5 }
          }
        >
          {/* Straw Hat */}
          <div className="absolute -top-3 w-12 h-4 bg-yellow-600 rounded-t-full border-2 border-black" />
          <div className="w-14 h-1 bg-yellow-500 absolute -top-1 -left-3 border-2 border-black rounded-full" />

          {/* Face */}
          <div className="flex flex-col items-center mt-1 w-full px-1">
            <div className="flex justify-between w-full h-1 relative">
              {action === "throwing" ? (
                <>
                  <div className="w-2 h-0.5 bg-black rotate-12 origin-right" />
                  <div className="w-2 h-0.5 bg-black -rotate-12 origin-left" />
                </>
              ) : (
                <>
                  <div className="w-2 h-0.5 bg-transparent" />
                  <div className="w-2 h-0.5 bg-transparent" />
                </>
              )}
            </div>
            <div className="flex justify-between w-full px-1 -mt-0.5">
              <div className="w-1 h-1 bg-black rounded-full" />
              <div className="w-1 h-1 bg-black rounded-full" />
            </div>
            {action === "throwing" ? (
              <div className="w-3 h-2 bg-black rounded-full mt-0.5 animate-pulse" />
            ) : (
              <div className="w-3 h-1 bg-black rounded-t-full mt-1" />
            )}
          </div>
        </motion.div>

        {/* Body */}
        <motion.div
          className={`relative w-5 h-6 bg-blue-700 border-2 border-black rounded-sm -mt-1 z-10`}
          animate={action === "throwing" ? { x: [-2, 2, -2] } : {}}
          transition={{ repeat: Infinity, duration: 0.1 }}
        >
          {/* Overalls */}
          <div className="absolute top-0 right-1 w-1 h-3 bg-blue-900" />
          <div className="absolute top-0 left-1 w-1 h-3 bg-blue-900" />
          {/* Shirt */}
          <div className="absolute top-0 inset-x-0 h-2 bg-red-600 -z-10" />

          {/* Arms with Pitchfork/Axe throwing effect */}
          <motion.div
            className={`absolute top-1 w-1.5 h-6 bg-orange-200 border border-black rounded-full origin-top -left-2`}
            animate={
              action === "throwing"
                ? { rotate: [120, -60] }
                : isMoving
                  ? { rotate: [80, -20] }
                  : { rotate: 20 }
            }
            transition={
              action === "throwing"
                ? { duration: 0.5 }
                : { repeat: Infinity, duration: 0.3, repeatType: "mirror" }
            }
          />
          <motion.div
            className={`absolute top-1 w-1.5 h-6 bg-orange-200 border border-black rounded-full origin-top -right-2 flex flex-col items-center justify-end z-20`}
            animate={
              action === "throwing"
                ? { rotate: [120, -60] }
                : isMoving
                  ? { rotate: [-100, -20] }
                  : { rotate: -20 }
            }
            transition={
              action === "throwing"
                ? { duration: 0.5 }
                : { repeat: Infinity, duration: 0.3, repeatType: "mirror" }
            }
          >
            <Axe className="w-3 h-3 text-gray-800 -mb-2" />
          </motion.div>
        </motion.div>

        {/* Legs */}
        <div className="flex gap-1 -mt-1 z-0">
          <motion.div
            className="w-1.5 h-4 bg-orange-900 border border-black rounded-b-sm origin-top"
            animate={isMoving ? { rotate: [-30, 30] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              repeatType: "mirror",
            }}
          />
          <motion.div
            className="w-1.5 h-4 bg-orange-900 border border-black rounded-b-sm origin-top"
            animate={isMoving ? { rotate: [30, -30] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              repeatType: "mirror",
            }}
          />
        </div>
      </div>
    );
  }

  if (variant === "native") {
    return (
      <div className="relative w-12 h-16 flex flex-col items-center">
        {/* Name badge */}
        <motion.div
          className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-50"
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <div className="bg-amber-700 text-white text-[7px] px-1.5 py-0.5 rounded-sm font-black italic border border-white/20 uppercase whitespace-nowrap">
            {getName()}
          </div>
        </motion.div>

        {/* Feather headdress */}
        <div className="flex gap-px items-end -mb-1 z-30">
          {(
            [
              "bg-red-500",
              "bg-yellow-400",
              "bg-orange-500",
              "bg-red-600",
              "bg-amber-400",
              "bg-red-500",
              "bg-yellow-400",
            ] as const
          ).map((color, i) => (
            <motion.div
              key={i}
              className={`w-1.5 rounded-t-full origin-bottom ${color}`}
              style={{ height: `${10 + Math.abs(3 - i) * 3}px` }}
              animate={{
                rotate: [(i - 3) * 12 - 3, (i - 3) * 12 + 3, (i - 3) * 12 - 3],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8 + i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Headband */}
        <div className="w-9 h-1.5 bg-red-700 border border-red-900 rounded-sm z-20" />

        {/* AI Head */}
        <motion.div
          className={`relative z-20 w-8 h-8 rounded-lg bg-gradient-to-br ${getColors()} border-2 flex items-center justify-center shadow-lg`}
          animate={isMoving ? { rotate: [2, -2, 2], y: [0, -2, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.3, repeatType: "mirror" }}
        >
          {getIcon()}
        </motion.div>

        {/* Body with native pattern */}
        <div className="relative w-5 h-6 bg-stone-800 border-x border-stone-600 -mt-1 z-10 rounded-sm overflow-hidden">
          <div className="absolute top-1 w-full h-0.5 bg-red-500/90" />
          <div className="absolute top-2.5 w-full h-0.5 bg-yellow-400/90" />
          <div className="absolute top-4 w-full h-0.5 bg-red-500/90" />
          {/* Arms */}
          <motion.div
            className="absolute top-1 w-1 h-5 bg-stone-700 border border-stone-500 rounded-full origin-top -left-2"
            animate={isMoving ? { rotate: [60, -60] } : { rotate: 20 }}
            transition={{
              repeat: Infinity,
              duration: 0.35,
              repeatType: "mirror",
            }}
          />
          <motion.div
            className="absolute top-1 w-1 h-5 bg-stone-700 border border-stone-500 rounded-full origin-top -right-2"
            animate={isMoving ? { rotate: [-60, 60] } : { rotate: -20 }}
            transition={{
              repeat: Infinity,
              duration: 0.35,
              repeatType: "mirror",
            }}
          />
        </div>

        {/* Legs */}
        <div className="flex gap-1 justify-center -mt-1">
          <motion.div
            className="w-1 h-4 bg-stone-900 rounded-full origin-top"
            animate={isMoving ? { rotate: [40, -40] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.35,
              repeatType: "mirror",
            }}
          />
          <motion.div
            className="w-1 h-4 bg-stone-900 rounded-full origin-top"
            animate={isMoving ? { rotate: [-40, 40] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.35,
              repeatType: "mirror",
              delay: 0.175,
            }}
          />
        </div>

        <motion.div
          className="mt-0.5 w-8 h-1 bg-black/40 rounded-full blur-sm"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 0.4 }}
        />
      </div>
    );
  }

  if (variant === "enemy_laser") {
    const laserColor =
      type === "gpt"
        ? "#10b981"
        : type === "claude"
          ? "#a855f7"
          : type === "copilot"
            ? "#3b82f6"
            : type === "deepseek"
              ? "#0ea5e9"
              : type === "llama"
                ? "#f97316"
                : type === "grok"
                  ? "#ffffff"
                  : type === "mistral"
                    ? "#ea580c"
                    : "#14b8a6";
    return (
      <div className="relative flex items-center">
        <motion.div
          className="relative flex items-center gap-0.5"
          animate={{ x: [0, -3, 0], scaleX: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 0.08 }}
        >
          {/* Tail glow */}
          <div
            className="w-8 h-1.5 rounded-full blur-[1px]"
            style={{
              background: `linear-gradient(to left, ${laserColor}, transparent)`,
            }}
          />
          {/* Bolt head */}
          <div
            className="w-3 h-3 rounded-full shadow-lg"
            style={{
              background: laserColor,
              boxShadow: `0 0 8px ${laserColor}, 0 0 16px ${laserColor}66`,
            }}
          />
        </motion.div>
      </div>
    );
  }

  if (variant === "native_rider") {
    return (
      <div
        className="relative w-16 flex flex-col items-center justify-end"
        style={{
          height: "80px",
          transform: facing === "left" ? "scaleX(-1)" : undefined,
        }}
      >
        {/* Name badge */}
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none z-50"
          style={{ transform: facing === "left" ? "scaleX(-1)" : undefined }}
        >
          <div className="bg-red-900 text-white text-[7px] px-1.5 py-0.5 rounded-sm font-black italic border border-white/20 uppercase whitespace-nowrap">
            {getName()}
          </div>
        </div>

        <motion.div
          className="relative flex items-end"
          animate={isMoving ? { y: [0, -2, 0], rotate: [0, -0.5, 0.5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.2 }}
        >
          {/* ─── RIDER (mounted on horse) ─── */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-40">
            {/* Feather headdress */}
            <div className="flex gap-px items-end -mb-0.5">
              {(
                [
                  "bg-red-500",
                  "bg-yellow-400",
                  "bg-orange-500",
                  "bg-red-600",
                  "bg-amber-400",
                ] as const
              ).map((color, i) => (
                <motion.div
                  key={i}
                  className={`w-1 rounded-t-full origin-bottom ${color}`}
                  style={{ height: `${6 + Math.abs(2 - i) * 3}px` }}
                  animate={{
                    rotate: [
                      (i - 2) * 10 - 2,
                      (i - 2) * 10 + 2,
                      (i - 2) * 10 - 2,
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 0.9 + i * 0.1 }}
                />
              ))}
            </div>
            {/* Headband */}
            <div className="w-6 h-1 bg-red-700 border border-red-900 rounded-sm" />
            {/* AI head */}
            <motion.div
              className={`w-6 h-6 rounded-md bg-gradient-to-br ${getColors()} border-2 flex items-center justify-center shadow-md`}
              animate={isMoving ? { rotate: [2, -2, 2] } : {}}
              transition={{
                repeat: Infinity,
                duration: 0.35,
                repeatType: "mirror",
              }}
            >
              <div className="scale-[0.6]">{getIcon()}</div>
            </motion.div>
            {/* Body */}
            <div className="relative w-4 h-4 bg-stone-800 border-x border-stone-600 rounded-sm overflow-hidden">
              <div className="absolute top-1 w-full h-0.5 bg-red-500/80" />
              <div className="absolute top-2.5 w-full h-0.5 bg-yellow-400/80" />
              {/* Arrow-throwing arm */}
              <motion.div
                className="absolute top-0 w-0.5 h-4 bg-stone-700 rounded-full origin-top -right-2 flex items-start justify-center"
                animate={
                  isMoving ? { rotate: [-70, 35, -70] } : { rotate: -50 }
                }
                transition={{
                  repeat: Infinity,
                  duration: 0.9,
                  ease: "easeInOut",
                }}
              >
                <div className="relative w-0.5 h-3 bg-amber-700 mt-0.5 mx-auto">
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[2px] border-r-[2px] border-b-[4px] border-l-transparent border-r-transparent border-b-red-500" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-white/60 rotate-45" />
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-white/60 -rotate-45" />
                </div>
              </motion.div>
              {/* Rein arm */}
              <motion.div
                className="absolute top-0 w-0.5 h-3 bg-stone-700 rounded-full origin-top -left-2"
                animate={isMoving ? { rotate: [20, -5, 20] } : { rotate: 15 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.9,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>

          {/* ─── HORSE ─── */}
          <motion.div
            className="absolute -left-2 top-2 w-3 h-7 bg-amber-950 rounded-bl-full origin-top-right z-0"
            animate={isMoving ? { rotate: [-10, 20] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              repeatType: "mirror",
            }}
          />
          <div className="w-14 h-8 bg-amber-700 rounded-xl border-2 border-black relative overflow-hidden flex items-center justify-center shadow-inner z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-red-800 border-b-2 border-x-2 border-black rounded-b-md" />
          </div>
          <motion.div
            className="absolute -right-3 -top-5 w-6 h-9 border-t-2 border-r-2 border-b-2 border-black rounded-tr-xl flex flex-col items-center bg-amber-700 origin-bottom-left z-20"
            animate={isMoving ? { rotate: [-2, 2] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.4,
              repeatType: "mirror",
            }}
          >
            <div className="flex justify-between w-full px-1 -mt-2">
              <div className="w-1.5 h-3 bg-amber-800 border border-black rounded-t-full rotate-[-20deg]" />
              <div className="w-1.5 h-3 bg-amber-800 border border-black rounded-t-full rotate-[20deg]" />
            </div>
            <div className="w-6 h-5 absolute bottom-2 -right-4 bg-amber-600 border-2 border-black rounded-r-lg flex flex-col justify-end pb-0.5 pr-1 z-30">
              <div className="w-1 h-1 bg-black rounded-full self-end" />
            </div>
            <div className="w-1 h-1 bg-black rounded-full absolute top-2 right-2" />
            <div className="absolute -left-1 top-0 bottom-0 w-2 bg-amber-950 border-y border-black rounded-l-md" />
          </motion.div>
          <motion.div
            className="absolute -bottom-3 left-1 w-1.5 h-4 bg-amber-800 border border-black origin-top rounded-b-sm z-0"
            animate={isMoving ? { rotate: [30, -30] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              repeatType: "mirror",
            }}
          />
          <motion.div
            className="absolute -bottom-3 left-4 w-1.5 h-4 bg-amber-900 border border-black origin-top rounded-b-sm z-10"
            animate={isMoving ? { rotate: [-30, 30] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              repeatType: "mirror",
            }}
          />
          <motion.div
            className="absolute -bottom-3 right-5 w-1.5 h-4 bg-amber-800 border border-black origin-top rounded-b-sm z-0"
            animate={isMoving ? { rotate: [30, -30] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              repeatType: "mirror",
            }}
          />
          <motion.div
            className="absolute -bottom-3 right-1 w-1.5 h-4 bg-amber-900 border border-black origin-top rounded-b-sm z-10"
            animate={isMoving ? { rotate: [-30, 30] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.2,
              repeatType: "mirror",
            }}
          />
        </motion.div>
      </div>
    );
  }

  if (variant === "helicopter") {
    const neonColor =
      type === "gpt" ? "#10b981"
      : type === "claude" ? "#a855f7"
      : type === "copilot" ? "#3b82f6"
      : type === "deepseek" ? "#0ea5e9"
      : type === "llama" ? "#f97316"
      : type === "grok" ? "#e5e7eb"
      : type === "mistral" ? "#f97316"
      : "#14b8a6";
    return (
      <div className="relative flex flex-col items-center" style={{ width: "88px", height: "52px" }}>
        {/* Name badge */}
        <motion.div
          className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none z-50 whitespace-nowrap"
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <div className="bg-slate-900 text-cyan-400 text-[7px] px-1.5 py-0.5 rounded-sm font-black italic border border-cyan-500/50 uppercase">
            UNIT-{getName()}
          </div>
        </motion.div>

        {/* Main rotor */}
        <motion.div
          className="absolute bg-slate-300 origin-center rounded-full"
          style={{ top: "2px", left: "50%", width: "80px", height: "3px", translateX: "-50%" }}
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 0.12, ease: "linear" }}
        />
        <div
          className="absolute bg-slate-500 rounded-full"
          style={{ top: "0px", left: "50%", width: "6px", height: "6px", transform: "translate(-50%, -50%)" }}
        />

        {/* Body */}
        <div
          className="absolute bg-slate-800 border-2 border-slate-600 flex items-center overflow-hidden"
          style={{ left: "8px", top: "10px", right: "16px", bottom: "10px", borderRadius: "40% 20% 20% 40%" }}
        >
          {/* Neon top stripe */}
          <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: neonColor, boxShadow: `0 0 6px ${neonColor}` }} />
          {/* Neon bottom stripe */}
          <div className="absolute bottom-0 inset-x-0 h-[2px]" style={{ background: neonColor, boxShadow: `0 0 6px ${neonColor}` }} />
          {/* Cockpit window */}
          <div
            className="absolute border border-cyan-300/50 bg-cyan-400/20"
            style={{ left: "4px", top: "4px", width: "22px", height: "14px", borderRadius: "50% 20% 20% 50%" }}
          />
          {/* Pilot blink */}
          <motion.div
            className="absolute rounded-full"
            style={{ left: "8px", top: "8px", width: "5px", height: "5px", background: neonColor, boxShadow: `0 0 5px ${neonColor}` }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
          />
          {/* Missile pod */}
          <div className="absolute bottom-0 left-6 w-5 h-2 bg-red-700 border border-red-500 rounded-r-full" />
        </div>

        {/* Tail boom */}
        <div
          className="absolute bg-slate-700 border-t border-slate-500"
          style={{ right: "0px", top: "50%", width: "20px", height: "4px", transform: "translateY(-50%)" }}
        />
        {/* Tail rotor */}
        <motion.div
          className="absolute bg-slate-400 origin-center"
          style={{ right: "0px", top: "50%", width: "2px", height: "16px", transform: "translateY(-50%)" }}
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 0.08, ease: "linear" }}
        />

        {/* Spotlight cone downward */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: "28px",
            top: "42px",
            width: "32px",
            height: "40px",
            background: `linear-gradient(to bottom, ${neonColor}70, transparent)`,
            clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 0.7 }}
        />
      </div>
    );
  }

  if (variant === "alien") {
    const glowColor =
      type === "gpt"
        ? "#10b981"
        : type === "claude"
          ? "#a855f7"
          : type === "copilot"
            ? "#3b82f6"
            : type === "deepseek"
              ? "#0ea5e9"
              : type === "llama"
                ? "#f97316"
                : type === "grok"
                  ? "#e5e7eb"
                  : type === "mistral"
                    ? "#f97316"
                    : "#14b8a6";
    const suitBg =
      type === "gpt"
        ? "bg-emerald-900"
        : type === "claude"
          ? "bg-purple-900"
          : type === "copilot"
            ? "bg-blue-900"
            : type === "deepseek"
              ? "bg-sky-900"
              : type === "llama"
                ? "bg-orange-900"
                : type === "grok"
                  ? "bg-zinc-800"
                  : type === "mistral"
                    ? "bg-red-900"
                    : "bg-teal-900";
    const labelBg =
      type === "gpt"
        ? "bg-emerald-700"
        : type === "claude"
          ? "bg-purple-700"
          : type === "copilot"
            ? "bg-blue-700"
            : type === "deepseek"
              ? "bg-sky-700"
              : type === "llama"
                ? "bg-orange-700"
                : type === "grok"
                  ? "bg-zinc-700"
                  : type === "mistral"
                    ? "bg-orange-800"
                    : "bg-teal-700";
    return (
      <div className="relative w-12 h-16 flex flex-col items-center">
        <motion.div
          className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-50"
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <div
            className={`${labelBg} text-white text-[7px] px-1.5 py-0.5 rounded-sm font-black italic border border-white/20 uppercase whitespace-nowrap`}
          >
            {getName()}
          </div>
        </motion.div>

        {/* Antennae */}
        <div className="flex gap-4 mb-0.5 z-30">
          <motion.div
            className="w-0.5 h-3 rounded-t-full origin-bottom"
            style={{ background: glowColor, boxShadow: `0 0 4px ${glowColor}` }}
            animate={{ rotate: [-12, 12, -12] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />
          <motion.div
            className="w-0.5 h-3 rounded-t-full origin-bottom"
            style={{ background: glowColor, boxShadow: `0 0 4px ${glowColor}` }}
            animate={{ rotate: [12, -12, 12] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />
        </div>

        {/* Head */}
        <motion.div
          className={`relative z-20 w-9 h-8 rounded-full ${suitBg} border-2 flex items-center justify-center`}
          style={{
            borderColor: glowColor,
            boxShadow: `0 0 10px ${glowColor}55`,
          }}
          animate={isMoving ? { rotate: [2, -2, 2] } : {}}
          transition={{ repeat: Infinity, duration: 0.4 }}
        >
          <div className="flex gap-1.5">
            <motion.div
              className="w-2.5 h-2 rounded-full"
              style={{
                background: glowColor,
                boxShadow: `0 0 6px ${glowColor}`,
              }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
            />
            <motion.div
              className="w-2.5 h-2 rounded-full"
              style={{
                background: glowColor,
                boxShadow: `0 0 6px ${glowColor}`,
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
            />
          </div>
          <div
            className="absolute bottom-1.5 w-4 h-px rounded-full"
            style={{ background: glowColor, opacity: 0.6 }}
          />
        </motion.div>

        {/* Body */}
        <div
          className={`relative w-5 h-5 ${suitBg} border-2 rounded-sm -mt-0.5 z-10 overflow-hidden`}
          style={{ borderColor: `${glowColor}66` }}
        >
          <div
            className="absolute top-1 inset-x-1 h-px"
            style={{ background: glowColor, opacity: 0.5 }}
          />
          <div
            className="absolute top-2.5 inset-x-1 h-px"
            style={{ background: glowColor, opacity: 0.4 }}
          />
          {/* Left arm */}
          <motion.div
            className={`absolute top-0.5 w-1.5 h-4 ${suitBg} border rounded-full origin-top -left-1.5`}
            style={{ borderColor: `${glowColor}55` }}
            animate={isMoving ? { rotate: [50, -50] } : { rotate: 20 }}
            transition={{
              repeat: Infinity,
              duration: 0.35,
              repeatType: "mirror",
            }}
          />
          {/* Right arm with laser gun */}
          <motion.div
            className={`absolute top-0.5 w-1.5 h-4 ${suitBg} border rounded-full origin-top -right-1.5 flex items-end`}
            style={{ borderColor: `${glowColor}55` }}
            animate={isMoving ? { rotate: [-50, 50] } : { rotate: -20 }}
            transition={{
              repeat: Infinity,
              duration: 0.35,
              repeatType: "mirror",
              delay: 0.175,
            }}
          >
            <div
              className="w-3 h-1 rounded-l-sm -ml-0.5"
              style={{
                background: glowColor,
                boxShadow: `0 0 4px ${glowColor}`,
              }}
            />
          </motion.div>
        </div>

        {/* Legs */}
        <div className="flex gap-1 justify-center">
          <motion.div
            className={`w-1.5 h-4 ${suitBg} border rounded-b-sm origin-top`}
            style={{ borderColor: `${glowColor}55` }}
            animate={isMoving ? { rotate: [35, -35] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.35,
              repeatType: "mirror",
            }}
          />
          <motion.div
            className={`w-1.5 h-4 ${suitBg} border rounded-b-sm origin-top`}
            style={{ borderColor: `${glowColor}55` }}
            animate={isMoving ? { rotate: [-35, 35] } : {}}
            transition={{
              repeat: Infinity,
              duration: 0.35,
              repeatType: "mirror",
              delay: 0.175,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-12 h-14 flex flex-col items-center">
      {/* Danger Indicator */}
      {!isHeadOnly && (
        <motion.div
          className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          animate={{ scale: [1, 1.1, 1], y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <div className="bg-red-600 text-white text-[7px] px-1.5 py-0.5 rounded-sm font-black italic mb-0.5 border border-white/20 uppercase">
            {getName()}
          </div>
        </motion.div>
      )}

      {/* Head */}
      <motion.div
        className={`relative z-20 w-8 h-8 rounded-lg bg-gradient-to-br ${getColors()} border-2 flex items-center justify-center shadow-lg`}
        animate={
          isMoving
            ? {
                rotate: isHeadOnly ? [0, 360] : [2, -2, 2],
                y: isHeadOnly ? [0, -10, 0] : [0, -2, 0],
              }
            : {}
        }
        transition={
          isHeadOnly
            ? {
                rotate: { repeat: Infinity, duration: 0.5, ease: "linear" },
                y: { repeat: Infinity, duration: 0.4, repeatType: "mirror" },
              }
            : {}
        }
      >
        {getIcon()}
      </motion.div>

      {!isHeadOnly && (
        <>
          {/* Body */}
          <div
            className={`relative w-4 h-6 bg-slate-800 border-x border-white/10 rounded-md -mt-1 z-10 
            ${variant === "werewolf" ? "bg-stone-800" : variant === "zombie" ? "bg-green-900 border-green-500" : ""}`}
          >
            {/* Arms */}
            <motion.div
              className={`absolute top-1 w-1 bg-slate-700 rounded-full origin-top
                ${variant === "werewolf" ? "h-6 bg-stone-700 -left-2" : variant === "zombie" ? "h-5 bg-green-700 -left-2" : "h-5 -left-1.5"}`}
              animate={
                variant === "zombie"
                  ? { rotate: [-80, -100] }
                  : isMoving
                    ? { rotate: [60, -60] }
                    : { rotate: 20 }
              }
              transition={
                variant === "zombie"
                  ? { repeat: Infinity, duration: 1, repeatType: "mirror" }
                  : { repeat: Infinity, duration: 0.4, repeatType: "mirror" }
              }
            />
            <motion.div
              className={`absolute top-1 w-1 bg-slate-700 rounded-full origin-top
                ${variant === "werewolf" ? "h-6 bg-stone-700 -right-2" : variant === "zombie" ? "h-5 bg-green-700 -right-2" : "h-5 -right-1.5"}`}
              animate={
                variant === "zombie"
                  ? { rotate: [80, 100] }
                  : isMoving
                    ? { rotate: [-60, 60] }
                    : { rotate: -20 }
              }
              transition={
                variant === "zombie"
                  ? {
                      repeat: Infinity,
                      duration: 1,
                      repeatType: "mirror",
                      delay: 0.2,
                    }
                  : { repeat: Infinity, duration: 0.4, repeatType: "mirror" }
              }
            />

            {/* Werewolf Tail */}
            {variant === "werewolf" && (
              <motion.div
                className="absolute -bottom-2 -left-3 w-4 h-1.5 bg-stone-700 rounded-full origin-right"
                animate={isMoving ? { rotate: [-20, 20] } : { rotate: 0 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.2,
                  repeatType: "mirror",
                }}
              />
            )}
          </div>

          {/* Legs */}
          <div className="flex gap-1 justify-center -mt-1.5">
            <motion.div
              className="w-1 h-4 bg-slate-900 rounded-full origin-top"
              animate={isMoving ? { rotate: [40, -40] } : {}}
              transition={{
                repeat: Infinity,
                duration: 0.4,
                repeatType: "mirror",
              }}
            />
            <motion.div
              className="w-1 h-4 bg-slate-900 rounded-full origin-top"
              animate={isMoving ? { rotate: [-40, 40] } : {}}
              transition={{
                repeat: Infinity,
                duration: 0.4,
                repeatType: "mirror",
                delay: 0.2,
              }}
            />
          </div>
        </>
      )}

      {/* Glitch Shadow */}
      <motion.div
        className="mt-1 w-8 h-1 bg-black/40 rounded-full blur-sm"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 0.4 }}
      />
    </div>
  );
};
