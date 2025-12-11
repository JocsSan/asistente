<!--
SYNC IMPACT REPORT
Version change: 0.0.0 -> 1.0.0
List of modified principles:
- Defined I. Arquitectura Basada en Features
- Defined II. Separación Estricta de Responsabilidades (Logic vs UI)
- Defined III. Código Limpio y Escalable (Clean Code)
- Defined IV. Estilos Nativos (Native Styling)
Removed sections: Principle 5, Section 2, Section 3 (Unused placeholders)
Templates requiring updates: None (Templates are generic enough)
Follow-up TODOs: None
-->

# Asistente Constitution

## Core Principles

### I. Arquitectura Basada en Features (Feature-Based Architecture)
El código se organiza estrictamente por dominio de negocio (`features/`), no por tipo técnico. Cada feature debe ser autocontenida en `src/features/[feature-name]` con la estructura obligatoria: `api/` (lógica pura), `components/` (UI presentacional), `hooks/` (lógica de negocio/estado), y `screens/` (conexión con navegación). `shared/` se reserva exclusivamente para elementos agnósticos al dominio.

### II. Separación Estricta de Responsabilidades (Logic vs UI)
La UI (`components`, `screens`) solo debe renderizar datos y capturar eventos; prohibido contener lógica de negocio o llamadas directas a APIs. Toda la lógica de estado, efectos y comunicación debe residir en `hooks` personalizados. La capa `api` debe consistir en funciones puras de JavaScript.

### III. Código Limpio y Escalable (Clean Code)
Se prioriza la legibilidad y mantenibilidad. Nombres de variables y funciones deben ser descriptivos (en español o inglés, manteniendo consistencia). Funciones pequeñas con responsabilidad única. Aplicar principios DRY (Don't Repeat Yourself) y SOLID donde aplique para facilitar la escalabilidad.

### IV. Estilos Nativos (Native Styling)
El estilizado debe realizarse exclusivamente mediante `StyleSheet` de React Native o el sistema de temas centralizado en `shared/theme`. No se permite el uso de Tailwind CSS ni librerías de estilos externas por el momento.

## Governance

Esta constitución define la estructura y reglas inquebrantables del proyecto. Cualquier desviación debe ser justificada y aprobada mediante una enmienda a este documento. Las revisiones de código (PRs) deben verificar estrictamente el cumplimiento de la arquitectura basada en features y la separación de lógica/UI.

**Version**: 1.0.0 | **Ratified**: 2025-12-11 | **Last Amended**: 2025-12-11
