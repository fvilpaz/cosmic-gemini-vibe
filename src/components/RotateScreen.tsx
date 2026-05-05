import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smartphone } from "lucide-react";

export const RotateScreen = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Small screens typically implies mobile, and portrait means height > width
      const isMobilePortrait =
        window.innerWidth < 768 && window.innerHeight > window.innerWidth;
      setIsPortrait(isMobilePortrait);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AnimatePresence>
      {isPortrait && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,rgba(0,0,0,0)_70%)]" />

          <motion.div
            animate={{ rotate: 90 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              repeatDelay: 1,
              ease: "easeInOut",
            }}
            className="mb-8"
          >
            <Smartphone className="w-24 h-24 text-blue-500" />
          </motion.div>

          <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">
            Rotate Your Device
          </h2>
          <p className="text-slate-400 font-medium max-w-[280px]">
            This game is designed to be experienced in{" "}
            <span className="text-white font-bold">Landscape mode</span>. Please
            rotate your phone to continue.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
