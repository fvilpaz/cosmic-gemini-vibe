# Portal: The Construct (System Core / Matrix)

Este documento detalla todas las modificaciones realizadas en el código base para implementar el mundo "Matrix - The Construct" (Mundo 2). Esta información es valiosa para migrar estos cambios a otras instancias del código o comprender la arquitectura del nuevo diseño visual y comportamientos.

## 1. Archivos Modificados

*   `src/types.ts`: Incorporación del nuevo entorno y configuración del mundo.
*   `src/components/LevelBackground.tsx`: Lógica de renderizado del escenario (grid de suelo, lluvia digital, stands decorativos).
*   `src/components/Competitor.tsx`: Renderizado y animación del enemigo temático "Agent" (Agente de Matrix).

## 2. Cambios en `src/types.ts`

**Tipos:**
*   Se agregó el literal `"matrix"` a la propiedad `environment` del tipo `Level`.
*   Se agregó `"agent"` a al tipo `variant` en `enemySpawns`.

**Configuración del Mundo (Nivel 2):**
*   `planetName`: Actualizado a `"World 2 — THE CONSTRUCT — System Core"`.
*   `themeColor`: Ajustado a una paleta oscura y verde (`from-[#001a00] via-[#000a00] to-black`).
*   `secondaryColor` / `particleColor`: Ajustados a tonos `emerald`.
*   `environment`: Asignado a `"matrix"`.
*   `coyoteAction`: Modificado a `"WAKE UP, NEO..."`.
*   `enemySpawns`: Se han actualizado todos los enemigos de este nivel a comportarse o vestir con la variante `"agent"`.

## 3. Cambios en `src/components/LevelBackground.tsx`

Se creó un escenario envolvente, estilo "Construct" de Matrix.

*   **Bloque Principal (`if (level.environment === "matrix")`)**: Se renderiza al inicio del flujo del componente para inyectar este entorno específico.
*   **Lluvia Digital (Matrix Rain)**: Renderizada como un bucle iterando sobre 60 columnas (`[...Array(60)]`). 
    *   No usa `Math.random()`; todo se calcula con índices cíclicos `(i % X)` para evitar _flickering_ en los renders de React.
    *   Uso exhaustivo de Framer Motion (`animate={{ y: ["0vh", "200vh"] }}`) para lograr el efecto de goteo en bucle infinito.
*   **Perspectiva del Suelo**: En vez del suelo estándar, implementé un div padre con rotación 3D para darle profundidad y renderizar un _grid perspective_ (Cielo abierto con rejillas verdes infinitas). 
    *   Se manipuló la perspectiva de rotación del suelo artificial con `perspective: 600px` y `transform: rotateX(75deg)`.
*   **Decoraciones Moduladas**: En los bloques base ("SYS.CORE") del suelo se agregan `props` (elementos) en el escenario iterados cíclicamente (`i % N`), tales como:
    *   `i % 8 === 4`: Cabina telefónica (El bloque de salida del sistema, con un destello en la manivela/receptor).
    *   `i % 6 === 3`: Píldora Roja vs Píldora Azul, insertadas como micro divs rotados.

## 4. Cambios en `src/components/Competitor.tsx`

Se inyectó un aspecto visual para la variante "Agent" en la colección de enemigos.

*   **Identificador en Pantalla (`getName`)**: Ahora cada enemigo de mundo 2 reescribe su nombre original anteponiendo "AGENT" (p.ej. "AGENT GPT").
*   **Esquema de Colores (`getColors`)**: Una variante sobria en negro `#002200` hasta negro puro con borde esmeralda.
*   **Aspecto Visual (Render JSX)**:
    *   Generé una figura que usa gabardina / saco negro ("Black Suit") con corbata verde sobre fondo blanco (`bg-slate-100` flex box + line verde).
    *   Diseño de cabeza más seria que incluye anteojos negros oscuros que ocupan horizontalmente la cara y detalles corporativos estilo agente smith (earpiece o auricular de cordón transparente hecho con bordes CSS).
    *   Mantenimiento de las animaciones de _caminar_ estándar del juego.

### Notas para futuros Agentes implementadores:
*   Si agregas efectos como lluvia digital que cubren toda la vista, recuerda posicionarlo en un plano index-z o bajo una capa con degradado opaco de forma que no compita bruscamente con la cámara del jugador y no canse la vista.
*   Ningún render puede contar con números flotantes generados aleatoriamente (`Math.random()`) directo en JSX (`<div style={...} />`), este motor redibuja constantemente la UI basada en ticks rápidos. Genera secuencias numéricas iterando sobre un mod operator en `[...Array(x)].map((_, i) => i)`.
*   **Gestión de Tipos (TypeScript)**: ¡Atento! Si agregas nuevas variantes (`"agent"` en la lista de `CompetitorVariant`), asegúrate de añadirla exhaustivamente también en los tipos genéricos, y recuerda revisar el alcance de funciones compartidas (ej. `getBrandIcon()`) sacándolas del bloque condicional `if (variant === 'ghost')` a un *scope* global del componente para que otras variantes, como `"agent"`, puedan reutilizarlas sin disparar errores en el Linter (pantalla en blanco o fallos de compilación).
