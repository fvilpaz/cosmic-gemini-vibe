# Registro de Cambios: Portal 1 - The Final Sync

Este documento detalla las modificaciones realizadas para implementar la pasarela final de personajes en el Mundo 1 (Google I/O 2026) de **Gemini: The Cosmic Runner**.

## Resumen de Cambios
Se ha transformado el Mundo 1 en un nivel de celebración donde los enemigos no atacan, no pueden morir y desfilan ante el jugador. Se han ajustado escalas, comportamientos y elementos visuales del fondo.

## Archivos Modificados

### 1. `src/types.ts`
*   **Configuración del Mundo 1**: Se ha rediseñado el array `enemySpawns` para incluir a todos los personajes.
    *   **Orden de aparición**: Los 8 AIs (GPT, Claude, Copilot, Deepseek, Llama, Grok, Mistral, Perplexity) seguidos del Caballero Géminis (Caballo), la Vaca, el Cerdo, la Oveja, el Granjero Loco y el Doctor Loco.
    *   **Escalado**: Se han asignado valores de `size` entre 1.6 y 2.1 para que los personajes se vean grandes y definidos.
    *   **Comportamiento**: Se cambió el `behavior` a `"walk"` para el Granjero y el Profesor para que se desplacen por la pantalla.

### 2. `src/App.tsx`
*   **Inmortalidad de Personajes**: Se ha modificado la lógica de colisión de proyectiles para que en el Mundo 1 los personajes no mueran (`e.isDead || currentLevelRef.current?.number === 1`).
*   **Desactivación de Daños**: Se aseguró que el jugador no reciba daño al chocar con ellos en este nivel.
*   **Escalado de Géminis**: Se ha actualizado la prop `style` del `player-wrapper` para aumentar significativamente el tamaño del jugador en el Mundo 1 (`currentIdx === 9`), llegando a una escala de hasta 3.0 en móvil para que destaque sobre la multitud.
*   **Lógica de Bosses**: Se han añadido condiciones para que el Granjero y el Profesor no se comporten como "Bosses" estáticos en la derecha de la pantalla si el nivel es el Mundo 1, permitiendo que aparezcan como enemigos normales que caminan.
*   **Limpieza**: Se eliminó el componente `RotateScreen` que ya no era necesario.

### 3. `src/components/LevelBackground.tsx`
*   **Multitud (Emojis)**: 
    *   Se ha reducido el tamaño de los emojis de la multitud (`text-lg md:text-2xl`) para no robar protagonismo.
    *   Se ha bajado la opacidad a `0.7` para mejorar la visibilidad de los personajes.
    *   Se redujo la amplitud de la animación de salto (`y: [0, -15, 0]`).
*   **Posicionamiento del Texto**: 
    *   Se ha ajustado el contenedor del texto "I/O 2026 COUNTDOWN" para que en pantallas móviles se sitúe más arriba (`pt-[12vh]`) y no tape a los personajes que pasan por la pasarela.

## Guía para Replicar (Prompt)
Si deseas replicar este comportamiento en otro repositorio, puedes usar un prompt similar a este:

> "Configura el nivel final (Mundo 1) como una pasarela de celebración. Haz que aparezcan todos los modelos de IA, animales, el granjero y el profesor en orden. Los personajes deben ser un 50% más grandes de lo normal y el jugador debe ser el doble de grande. Evita que los proyectiles maten a los personajes en este nivel y desactiva el daño por contacto. Ajusta los emojis del fondo para que sean más pequeños y transparentes, y mueve el título principal hacia arriba para que no tape el desfile."
