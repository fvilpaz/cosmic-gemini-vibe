import fs from 'fs';

let content = fs.readFileSync('./src/App.tsx', 'utf8');

// 1. Strip all manual media query scales
content = content.replace(/ \[@media\(max-height:500px\)\]:[^\s"']+/g, '');

// 2. Modify handleResize
content = content.replace(
  /const handleResize = \(\) => \{\n\s*winWRef\.current = window\.innerWidth;\n\s*winHRef\.current = window\.innerHeight;\n\s*setIsLandscape\(window\.innerWidth > window\.innerHeight\);\n\s*\};/,
  `const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isL = w > h;
      // Global mobile landscape scale factor
      const scaleBase = (isL && h < 500) ? Math.max(0.45, h / 750) : 1;
      
      winWRef.current = w / scaleBase;
      winHRef.current = h / scaleBase;
      setIsLandscape(isL);
      document.documentElement.style.setProperty('--mobile-scale', scaleBase.toString());
      document.documentElement.style.setProperty('--mobile-inv-scale', (1 / scaleBase).toString());
    };`
);

fs.writeFileSync('./src/App.tsx', content);
console.log("Replaced handleResize and stripped media queries.");
