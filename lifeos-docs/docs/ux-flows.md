# UX Flows — LifeOS (MVP)

## Journey principal: registrar una acción diaria
1. Usuario entra a Dashboard → ve sus 6 mascotas
2. Toca la categoría "Entrenamiento" → entra al detalle
3. Ve lista de acciones disponibles ("Entrené hoy", "Cardio 20 min"...)
4. Marca "Entrené hoy" → animación de +XP → posible evolución de mascota (animación especial si aplica)
5. Regresa al dashboard → mascota actualizada, racha actualizada

## Journey: crear un objetivo
1. Usuario va a "Objetivos" → "Nuevo objetivo"
2. Elige categoría (ej. Finanzas), título ("Ahorrar $5000"), fecha límite
3. Agrega subtareas opcionales
4. Guarda → aparece en dashboard como objetivo activo con barra de progreso

## Journey: revisar progreso semanal
1. Usuario va a Calendario
2. Ve heatmap de actividad por día
3. Filtra por categoría → ve cuánto tiempo/veces invirtió esa semana
4. (FASE 2: aquí se conectará el reporte generado por IA)

## Estados de UI requeridos en cada pantalla
- Loading (skeleton, no spinner genérico)
- Empty state (ej. "Aún no tienes acciones registradas hoy")
- Error (mensaje claro, opción de reintentar)
- Success / confirmación (ej. toast de "+15 XP")

## Principio de diseño
Debe sentirse como un juego, no como una app de productividad: prioridad visual a las mascotas,
XP y evolución por encima de tablas y formularios. Los formularios existen pero no son el centro
de la experiencia.
