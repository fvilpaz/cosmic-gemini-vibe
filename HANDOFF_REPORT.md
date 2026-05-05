# HANDOFF REPORT — Gemini: The Cosmic Runner
## Estado del proyecto para continuar con cualquier IA sin perder contexto

---

## CÓMO USAR ESTE DOCUMENTO

Pega esto al inicio de cualquier conversación con Gemini, Claude, ChatGPT u otro:

```
Lee GAME_RULES.md y HANDOFF_REPORT.md antes de tocar cualquier código.
Sigue las reglas estrictamente. No improvises. No toques mundos que no se pidan.
```

---

## ESTADO ACTUAL DEL PROYECTO (Mayo 2026)

Juego funcionando en `localhost:3001` (Vite eligió este puerto automáticamente).
**TypeScript: 0 errores.** El juego compila y corre sin problemas.

---

## CAMBIOS RECIENTES — SESIONES ANTERIORES

### ✅ LevelBackground.tsx — Cyberpunk (World 9) rediseñado

**Problema que había:** El fondo cyberpunk usaba `Math.random()` en los estilos JSX de los edificios. Cada re-render cambiaba tamaños/posiciones → efecto caótico de bloques saltando y flotando.

**Lo que se hizo:**
- Reemplazado `Math.random()` por arrays fijos deterministas (`bh1`, `bh2`, `bh3`, `bw1`, `bw2`, `bw3`)
- Tres capas de edificios compactas sin gaps entre ellos
- Cielo degradado `#0d0221 → #060611` (púrpura oscuro a negro)
- Ventanas en grid (far/mid buildings)
- Edificios cercanos: siluetas oscuras `#080a1a` con borde neón superior (indigo/violeta)
- Suelo neón fuchsia al fondo
- 20 coches voladores con posiciones fijas por índice

**Bug crítico encontrado y arreglado:**
Framer Motion anima `opacity: 0→1` en el wrapper del background. Cuando la animación TERMINA (1.5s), Framer Motion elimina el inline `opacity` style. Sin ese style, la stacking context desaparece. Los edificios con `z-30` dentro competían directamente contra `z-10` del juego → Gemini y enemigos quedaban DETRÁS de los edificios, invisibles.

**Fix aplicado:**
- Añadido `zIndex: 0` explícito en el motion.div wrapper de cyberpunk (mantiene stacking context permanente)
- Eliminados `z-10`, `z-20`, `z-30` de los layers de edificios (usan DOM order para apilarse entre ellos)
- REGLA PARA EL FUTURO: Nunca poner z-index alto dentro de LevelBackground. El wrapper siempre necesita `zIndex: 0` explícito.

---

### ✅ World 9 — Rediseño completo de enemigos

**Antes:** Solo GPT en ondas repetitivas. Monótono.

**Ahora:** Los 8 tipos de IA en 4 oleadas + Helicopter Boss a mitad del nivel:

```
Wave 1 (x 350–1250): GPT, Claude, Copilot, Grok
HELICOPTER BOSS (x 1500): GPT variant="helicopter" behavior="seeker" size=2.2
Wave 2 (x 1800–2600): Llama, Mistral, Deepseek, Perplexity
Wave 3 (x 2900–3550): GPT, Claude, Copilot, Grok
Wave 4 (x 3750–4350): Llama, Mistral, Deepseek, GPT (final sprint)
```

**worldLength:** 4500 (el portal/fin de nivel aparece aquí)
**Plataformas:** x=1000 (y=150) y x=2800 (y=200)
**Coins:** [500, 1400, 2300, 3200, 4100]
**Flyers:** [1700, 3300]

---

### ✅ Competitor.tsx — Nuevo variant: helicopter

Añadido `"helicopter"` a `CompetitorVariant` type.

Visual del helicóptero:
- 88×52px container
- Rotor principal: motion.div giratorio (0.12s, 80px ancho)
- Hub del rotor: posicionado con `transform: "translate(-50%, -50%)"` (NO translateX/translateY separados en divs normales)
- Cuerpo: `borderRadius: "40% 20% 20% 40%"` (forma aerodinámica)
- Stripes de neón (top/bottom) en color del tipo de IA
- Ventana cockpit redondeada, piloto parpadeante
- Pod de misiles
- Boom trasero + rotor de cola (0.08s)
- Spotlight pulsante hacia abajo
- Badge "UNIT-{nombre}" en cyan sobre fondo oscuro
- Colores por tipo: GPT=#10b981, Claude=#a855f7, Copilot=#3b82f6, etc.

**Regla cow:** El variant `helicopter` está excluido de la conversión aleatoria a vaca (10% chance). Añadido `&& spawn.variant !== "helicopter"` en la condición `isRandomCow` de App.tsx.

---

### ✅ types.ts — Variant union actualizado

Añadido `"helicopter"` a la lista de variants en la interfaz `Level.enemySpawns`.

---

### ✅ World 6 — themeColor corregido

**Problema:** La pantalla de interlevel (2 segundos entre mundos) era negro sobre negro — el usuario veía una pantalla en negro.

**Fix:** `themeColor` cambiado de `"from-zinc-950 via-slate-900 to-black"` a `"from-slate-900 via-zinc-900 to-red-950"`.

---

### ✅ World 5 — Fix fuego nave

El fuego de la nave se mostraba en el lado derecho (nariz). La nave va hacia la derecha → el fuego debe salir por la IZQUIERDA (motor/parte trasera).

**Fix en App.tsx:** Cambiado el radial-gradient del fuego para que el punto caliente esté al 15% izquierda en lugar del 60% derecha.

---

### ✅ worldLength — Reducido en todos los mundos

Cambiado de 5000 → 4500 en todos los mundos (usuario pidió "un pelín menos tiempo").

⚠️ **ADVERTENCIA:** Worlds 8 y 10 tienen spawns de enemigos que van hasta x:9000+. Esos spawns están más allá del worldLength (4500) y son inalcanzables. Son datos legacy — los niveles terminan antes de llegar a ellos. No eliminar esos spawns sin verificar que no afecte jugabilidad de los primeros 4500px.

---

### ✅ Cyberpunk — Early return dedicado en LevelBackground

El mundo 9 (cyberpunk) tenía su fondo mezclado con el generic return. Se extrajo a un `if (level.environment === 'cyberpunk')` early return propio, antes de `mad-fields`.

**Orden de early returns en LevelBackground.tsx:**
1. `cyberpunk` ← nuevo, World 9
2. `mad-fields` ← World 8
3. `lab` ← World 10
4. `nebula` ← World 5
5. `ship` ← World 6
6. generic return ← todos los demás

---

### ✅ Patch scripts — Limpieza

Se eliminaron todos los scripts `.cjs`/`.ts`/`.js` de un solo uso que habían quedado en la raíz del proyecto (patch_cyberpunk2.js, fix_spawns.cjs, etc.).

---

## BUGS CONOCIDOS (sin resolver)

### 🐛 parallaxNodesRef conflict en nebula (World 5)
Las estrellas rápidas usan `parallaxNodesRef.current[i]` para i=0..39.
Los planetas usan índices 10, 11, 12.
Las estrellas SOBREESCRIBEN las refs de los planetas → los planetas se desplazan a velocidad incorrecta.

**Fix pendiente:** Cambiar planetas a índices 50, 51, 52 y supernova a índice 53.
Archivo: `src/components/LevelBackground.tsx` — sección `nebula`.

---

## ARQUITECTURA TÉCNICA CLAVE

### Refs vs State — LA REGLA MÁS IMPORTANTE
```
playerXRef / playerYRef / velocityYRef  → posición (NUNCA setState)
enemiesRef     → array de enemigos (mutación directa OK)
isFlyingRef / isHitRef / isJumpingRef   → flags que lee el game loop
```

El DOM se actualiza DIRECTAMENTE en el game loop:
```js
document.getElementById('player-wrapper').style.left = `${nX}px`;
```

### Camera
```js
window.dispatchEvent(new CustomEvent('updateCamera', { detail: camX }))
```
LevelBackground escucha este evento para el parallax.

### Game loop
Single `requestAnimationFrame` con `timeScale = dt / 16.666` para normalizar framerate.

---

## ESTRUCTURA DE ARCHIVOS

```
src/
  App.tsx                    — lógica del juego (2800+ líneas)
  types.ts                   — array LEVELS, interfaces Level/Platform
  components/
    GeminiRunner.tsx         — animación del jugador
    Competitor.tsx           — visuales de enemigos (incluye 'alien', 'helicopter')
    LevelBackground.tsx      — fondos por environment
    TransitionGame.tsx       — mini juego en transiciones void/nebula
    Portal.tsx               — portal fin de nivel
    Dollar.tsx               — monedas coleccionables
    Flyer.tsx                — powerup de vuelo
    Projectile.tsx           — proyectiles del jugador
    RotateScreen.tsx         — aviso portrait en móvil
GAME_RULES.md                — FUENTE DE VERDAD: reglas por mundo
CLAUDE.md                    — arquitectura técnica para Claude Code
HANDOFF_REPORT.md            — este archivo
```

---

## POSIBLES PRÓXIMAS TAREAS (no confirmadas)

- Fix parallax bug en nebula (planetas a índices 50/51/52)
- Revisar spawns de World 8 y World 10 para que encajen en worldLength=4500
- Testear el helicóptero en gameplay real (¿se ve bien el seeker behavior?)
- Verificar que el cyberpunk neon floor scrollea correctamente con la cámara

---

## PROMPT PARA EMPEZAR UNA SESIÓN NUEVA

```
Lee GAME_RULES.md y HANDOFF_REPORT.md antes de cualquier cosa.
El juego es un runner de 10 mundos en React+Vite+TypeScript.
No toques ningún mundo que no te pida explícitamente.
No uses Math.random() en estilos JSX.
No pongas z-index alto dentro de LevelBackground (ver feedback en HANDOFF_REPORT.md).
Verifica siempre con: npx tsc --noEmit
```
