# PROJECT INSTRUCTIONS: Gemini The Cosmic Runner

## Core Rules & Architecture
1. **Never use React State for Physics/Positions**: Always use `refs` (e.g., `playerXRef`, `playerYRef`, `velocityYRef`, `enemiesRef`). Update DOM directly in `gameLoop` (e.g., `document.getElementById('player-wrapper').style.left`).
2. **Never use `Math.random()` in React Render Styles**: It causes catastrophic flickering on re-renders. Use deterministic values or index-based calculations.
3. **World Order**: 10 -> 1 (index 0 to 9 in `LEVELS`). You start at world 10 and move down.
4. **Enemy AIs**: There are EXACTLY 8 AI rivals (gpt, claude, copilot, deepseek, llama, grok, mistral, perplexity) mapped to specific hex colors. Never reduce the count to fewer than 8.
5. **worldLength**: Fixed at 4500 (Except World 9 which is 5200). Note: some legacy spawns may exist beyond these limits; they are unreachable and it's fine.

## World Specifics
*   **World 10 (`lab`)**: AI Awakening. Google lab. Professor variant appears. All 8 AIs debut.
*   **World 9 (`cyberpunk`)**: City chase. Helicopter boss at x=1500. No farm animals, horses, or aliens. `zIndex: 0` must be explicitly set on the LevelBackground wrapper to preserve stacking context against game objects.
*   **World 8 (`mad-fields`)**: Farm. ONLY world with `cow`, `pig`, `sheep`, and `farmer` (throws animals).
*   **World 7 (`desert`)**: Wild west. ONLY world where Gemini rides a HORSE. UFO abduction at end.
*   **World 6 (`ship`)**: Alien UFO metal corridors. Gemini ON FOOT. Alien enemies only. Fights alien soldier AIs. NO ships as enemies.
*   **World 5 (`nebula`)**: Space combat. Gemini PILOTS A FIGHTER SHIP. Ship fire on the LEFT side (engine). UFO enemies float and shoot lasers.
*   **World 4 (`water`)**: Alien ocean. Fish variants.
*   **World 3 (`tech`)**: Digital jungle.
*   **World 2 (`graveyard`)**: AI Graveyard. Zombie/Werewolf variants.
*   **World 1 (`void`)**: The Final Sync. Google I/O 2026.
*   *Note: 10% chance for random `cow` conversion EXCEPT in worlds 5, 6, 7, 10, or for the helicopter.*

## File Map & Important Rules
*   `App.tsx`: Main game loop (2800+ lines). Physics in refs, DOM mutated directly.
*   `LevelBackground.tsx`: One file, early returns per environment. (cyberpunk, mad-fields, lab, nebula, ship, generic return).
*   **Z-Index Caution**: Never put high z-index inside LevelBackground. The wrapper must have `zIndex: 0` explicitly.

## Known Issues to Avoid / Fix
*   **Nebula Parallax Bug**: Stars use `parallaxNodesRef` 0-39. Planets must use 50, 51, 52 (supernova 53) to avoid conflict (currently buggy and conflicting with 10, 11, 12).
*   Do NOT put farm animals in cyberpunk or other wrong worlds.
*   Do NOT confuse world 5 (ship) with world 6 (on foot).
