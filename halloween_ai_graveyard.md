# Portal: Halloween Nightmare (AI Graveyard)

Este documento detalla todas las modificaciones realizadas en el código base para implementar el mundo "Halloween Nightmare / Cementerio de IA" (Mundo 3). Puedes usar esta información para migrar estos cambios a otro repositorio o informar a otros agentes sobre la estructura de la implementación.

## 1. Archivos Modificados

*   `src/types.ts`: Definición del entorno y configuración del nivel.
*   `src/components/LevelBackground.tsx`: Renderizado principal del entorno visual, paralaje y decoraciones (lápidas, calabazas, murciélagos).
*   `src/components/Competitor.tsx`: Renderizado y animación del enemigo tipo "Fantasma" (Ghost).
*   `src/App.tsx`: Asignación de variantes de enemigos según el entorno (eliminación de variantes antiguas, estandarización).

## 2. Cambios en `src/types.ts`

**Tipos:**
*   Se añadió `"halloween"` a la unión de tipos `Environment`.
*   Se eliminó `"target"` del tipo `EnemyVariant` (limpieza de código heredado/no usado).

**Configuración del Mundo (Nivel 3):**
*   `environment`: Se cambió a `"halloween"`.
*   `themeColor`: Se oscureció el cielo base usando `from-[#1a0b33] via-[#4d1d66] to-black` (tonos morados oscuros y negro).
*   `secondaryColor`: Actualizado a `text-orange-400`.
*   `coyoteAction`: Modificado de `"SPOOKY PROTOCOL ACTIVE"` a `"HALLOWEEN PROTOCOL ACTIVE"`.

## 3. Cambios en `src/components/LevelBackground.tsx`

Este es el archivo con más cambios, donde se construyó toda la escena visual. 

**Nuevas Constantes/Variables:**
*   `const isHalloween = level.environment === "halloween";` para agrupar condicionales.

**Ajuste del Bucle del Suelo (Floor Looping):**
*   Se modificó la fórmula de traslación del escenario base. En este mundo las decoraciones aparecen intercaladas matemáticamente (`i % 2`, `i % 3`, `i % 4`). El Mínimo Común Múltiplo para asegurar un ciclo sin cortes aparentes es 12. Al medir 128px por baldosa de suelo, el ciclo completo mide 1536px. 
*   **Código:** `floorRef.current.style.transform = translateX(${-(Math.floor(sx) % 1536)}px);`
*   Se aumentó el array del suelo de 30 a 40 bloques (`[...Array(40)]`) para poder cubrir el ancho incrementado (hasta pantallas Ultra Wide) sin huecos negros.

**Efectos Atmosféricos y Fondos:**
*   **Nubes oscuras:** Se añadieron divs (`bg-zinc-950/80 blur-[60px]`) moviéndose lentamente en el fondo.
*   **Murciélagos sobre la Luna:** Usando animaciones de `framer-motion` para trasladarlos horizontalmente y un contenedor que oscila las alas del murciélago modificando `rotateZ`.
*   **Suelo/Tierra:** En la sección donde el nivel _NO_ es un barco, vacío, etc. (se encarga el default render), agregamos bloques IF para inyectar los nuevos props.

**Elementos del Suelo (Lápidas, Calabazas y Decoraciones):**
Dichos elementos se insertan iterando el entorno:
*   **Lápidas Epístolas de IAs deprecadas (`i % 2 === 0`):** Se crearon _divs_ con forma de lápida integrando inscripciones de "GPT-3 (2020-2023)", "BARD", "LAMDA", "CODEX", etc., mediante cálculos cíclicos `[i % 6]`.
*   **Calabazas iluminadas (`i % 4 === 0`):** Un renderizado en CSS usando `border-radius: 50% 50% 45% 45%` y color naraja con doble filtro de sombra (`box-shadow` naranja) simulando iluminación interna.
*   **Velas Místicas (`i % 3 === 0`):** Pequeños cilindros con una flama usando un `scaleY` de framer-motion con velocidad alta para dar sensación de parpadeo.
*   **Niebla y Espíritus Digitales:**
    *   Fog: Nubes moradas al ras del suelo que se deslizan a izquierda y derecha.
    *   Espíritus: Pequeñas partículas blancas (pixeles/bytes) con `y: ["0vh", "-100vh"]` ascendiendo, con opacidad baja simulando almas digitales que abandonan las lápidas.

**Corrección Importante: Eliminación de `Math.random()` en React Render**
De acuerdo a las reglas del proyecto (`AGENTS.md`), no se puede usar `Math.random()` dentro del DOM del render para propiedades de partículas porque causan flickering al haber re-renders constantes manejados por el motor (`App.tsx`). Se reemplazó todo por multiplicadores basados en el Index `i` (ej., `(i * 17.3) % 100`, `12 + (i % 12)`).

## 4. Cambios en `src/components/Competitor.tsx`

**Mejora de la Variantes (Fantasmas):**
*   Se mejoró el CSS de la variante Ghost, incrementando el desenfoque (`backdrop-blur`) y agregando ojos cian (`cyan-400`) con un _glow effect_.
*   Se implementó una geometría sinusoide simple en la parte baja ("falda de fantasma") usando un Array de 4 elipses animadas con un pequeño _delay_ escalado para simular flotabilidad natural.

## Resumen de Reglas y Patrones a Seguir en Futuras Migraciones
1. **Evitar Math.random():** Cualquier nuevo mundo con niebla, estrellas o efectos atmosféricos debe indexarse de forma determinista `(i * X)`.
2. **Loop de Parallax:** Si agregas un nuevo mundo con decoraciones anidadas muy complejas (como estas lápidas y calabazas) recuerda calcular el Mínimo Común Múltiplo para el `floorRef` mod, y aumentar el array inicial si el mod excede los bloques renderizados por defecto.
3. **Optimización con Tailwind:** Cada detalle de iluminación de estos mundos se hizo pura y exclusivamente con `box-shadow` o `drop-shadow` de Tailwind y gradientes, no necesitas SVG ni imágenes externas.
