import fs from 'fs';

const content = fs.readFileSync('src/components/LevelBackground.tsx', 'utf8');

const labBlock = `  if (level.environment === 'lab') {
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
          <div ref={starsRef} className="absolute inset-0 w-[200vw] will-change-transform">
            {/* Hexagonal grid background */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
            {/* Data streams */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={\`stream-\${i}\`}
                className="absolute w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent shadow-[0_0_8px_#3b82f6]"
                style={{ left: \`\${i * 10}vw\`, top: 0, bottom: 0, opacity: 0.3 }}
                animate={{ y: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 2 + Math.random() * 4, ease: "linear" }}
              />
            ))}
          </div>

          {/* Deep screens */}
          <div ref={midCloudsRef} className="absolute inset-0 w-[8000px] flex items-center will-change-transform pointer-events-none">
            {[...Array(30)].map((_, i) => (
               <div key={\`screen-\${i}\`} className="absolute top-[20%] w-[300px] h-[200px] border border-blue-500/30 bg-blue-900/10 backdrop-blur-sm rounded-lg flex flex-col justify-between p-4" style={{left: \`\${i * 450 + 200}px\`}}>
                 <div className="w-full h-2 bg-blue-500/20 rounded" />
                 <div className="w-3/4 h-2 bg-blue-500/20 rounded mt-2" />
                 <div className="mt-auto flex justify-between">
                   <div className="w-16 h-16 rounded-full border border-blue-400/30 flex items-center justify-center">
                     <div className="w-8 h-8 rounded-full border border-blue-300/50" />
                   </div>
                   <div className="w-32 h-16 flex flex-col justify-end gap-1">
                     {[...Array(4)].map((_, j) => <div key={j} className="h-2 bg-blue-500/30 w-full rounded" />)}
                   </div>
                 </div>
                 {/* Glowing edge */}
                 <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-400 shadow-[0_0_10px_#60a5fa]" />
               </div>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[120px] landscape:h-[70px] overflow-hidden">
            <div ref={floorRef} className="flex will-change-transform" style={{ transform: \`translateX(0px)\`, width: 'calc(256px * 32)' }}>
              {[...Array(32)].map((_, i) => (
                <div
                  key={\`floor-\${i}\`}
                  className="flex-shrink-0 relative border-t border-blue-400 bg-slate-900 shadow-[0_0_20px_rgba(59,130,246,0.4)_inset]"
                  style={{ width: '256px', height: '100%' }}
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
  }`;

const replaced = content.replace("if (level.environment === 'nebula') {", labBlock + "\n\n  if (level.environment === 'nebula') {");
fs.writeFileSync('src/components/LevelBackground.tsx', replaced);
console.log('patched');
