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

### V. Control de Versiones y Commits (Git Workflow)
Todos los commits deben seguir estrictamente la convención **Conventional Commits** e incluir un **emoji** representativo después de los dos puntos. La descripción del commit debe escribirse estrictamente en **español**.
Formato: `<tipo>(<scope>): <emoji> <descripción>`

#### Tabla de Referencia Gitmoji

| Emoji | Código | Descripción |
| :---: | :--- | :--- |
| 🎨 | `:art:` | Improve structure / format of the code. |
| ⚡ | `:zap:` | Improve performance. |
| 🔥 | `:fire:` | Remove code or files. |
| 🐛 | `:bug:` | Fix a bug. |
| 🚑 | `:ambulance:` | Critical hotfix. |
| ✨ | `:sparkles:` | Introduce new features. |
| 📝 | `:memo:` | Add or update documentation. |
| 🚀 | `:rocket:` | Deploy stuff. |
| 💄 | `:lipstick:` | Add or update the UI and style files. |
| 🎉 | `:tada:` | Begin a project. |
| ✅ | `:white_check_mark:` | Add, update, or pass tests. |
| 🔒 | `:lock:` | Fix security issues. |
| 🔐 | `:closed_lock_with_key:` | Add or update secrets. |
| 🔖 | `:bookmark:` | Release / Version tags. |
| 🚨 | `:rotating_light:` | Fix compiler / linter warnings. |
| 🚧 | `:construction:` | Work in progress. |
| 💚 | `:green_heart:` | Fix CI Build. |
| ⬇️ | `:arrow_down:` | Downgrade dependencies. |
| ⬆️ | `:arrow_up:` | Upgrade dependencies. |
| 📌 | `:pushpin:` | Pin dependencies to specific versions. |
| 👷 | `:construction_worker:` | Add or update CI build system. |
| 📈 | `:chart_with_upwards_trend:` | Add or update analytics or track code. |
| ♻️ | `:recycle:` | Refactor code. |
| ➕ | `:heavy_plus_sign:` | Add a dependency. |
| ➖ | `:heavy_minus_sign:` | Remove a dependency. |
| 🔧 | `:wrench:` | Add or update configuration files. |
| 🔨 | `:hammer:` | Add or update development scripts. |
| 🌐 | `:globe_with_meridians:` | Internationalization and localization. |
| ✏️ | `:pencil2:` | Fix typos. |
| 💩 | `:poop:` | Write bad code that needs to be improved. |
| ⏪ | `:rewind:` | Revert changes. |
| 🔀 | `:twisted_rightwards_arrows:` | Merge branches. |
| 📦 | `:package:` | Add or update compiled files or packages. |
| 👽 | `:alien:` | Update code due to external API changes. |
| 🚚 | `:truck:` | Move or rename resources (e.g.: files, paths, routes). |
| 📄 | `:page_facing_up:` | Add or update license. |
| 💥 | `:boom:` | Introduce breaking changes. |
| 🍱 | `:bento:` | Add or update assets. |
| ♿ | `:wheelchair:` | Improve accessibility. |
| 💡 | `:bulb:` | Add or update comments in source code. |
| 💬 | `:speech_balloon:` | Add or update text and literals. |
| 🗃️ | `:card_file_box:` | Perform database related changes. |
| 🔊 | `:loud_sound:` | Add or update logs. |
| 🔇 | `:mute:` | Remove logs. |
| 👥 | `:busts_in_silhouette:` | Add or update contributor(s). |
| 🚸 | `:children_crossing:` | Improve user experience / usability. |
| 🏗️ | `:building_construction:` | Make architectural changes. |
| 📱 | `:iphone:` | Work on responsive design. |
| 🤡 | `:clown_face:` | Mock things. |
| 🥚 | `:egg:` | Add or update an easter egg. |
| 🙈 | `:see_no_evil:` | Add or update a .gitignore file. |
| 📸 | `:camera_flash:` | Add or update snapshots. |
| ⚗️ | `:alembic:` | Perform experiments. |
| 🔍 | `:mag:` | Improve SEO. |
| 🏷️ | `:label:` | Add or update types. |
| 🌱 | `:seedling:` | Add or update seed files. |
| 🚩 | `:triangular_flag_on_post:` | Add, update, or remove feature flags. |
| 🥅 | `:goal_net:` | Catch errors. |
| 💫 | `:dizzy:` | Add or update animations and transitions. |
| 🗑️ | `:wastebasket:` | Deprecate code that needs to be cleaned up. |
| 🛂 | `:passport_control:` | Work on code related to authorization, roles and permissions. |
| 🩹 | `:adhesive_bandage:` | Simple fix for a non-critical issue. |
| 🧐 | `:monocle_face:` | Data exploration/inspection. |
| ⚰️ | `:coffin:` | Remove dead code. |
| 🧪 | `:test_tube:` | Add a failing test. |
| 👔 | `:necktie:` | Add or update business logic. |
| 🩺 | `:stethoscope:` | Add or update healthcheck. |
| 🧱 | `:bricks:` | Infrastructure related changes. |
| 🧑‍💻 | `:technologist:` | Improve developer experience. |
| 💸 | `:money_with_wings:` | Add sponsorships or money related infrastructure. |
| 🧵 | `:thread:` | Add or update code related to multithreading or concurrency. |
| 🦺 | `:safety_vest:` | Add or update code related to validation. |

### VI. Pruebas (Testing)
Las pruebas deben ubicarse colocalizadas dentro de cada feature en una carpeta `__tests__` (`src/features/[feature-name]/__tests__/`). Las descripciones de los casos de prueba (`describe`, `it`, `test`) deben escribirse estrictamente en **español**.

### VII. Integridad del Flujo de Trabajo (Workflow Integrity)
Antes de iniciar una nueva especificación o feature, es obligatorio tener el repositorio en un estado limpio (commit realizado) y verificado (tests pasando).
*Excepción*: Esta regla aplica a cambios funcionales; se pueden obviar configuraciones efímeras de entornos de prueba (URLs, variables temporales) que no afecten la lógica.

## Governance

Esta constitución define la estructura y reglas inquebrantables del proyecto. Cualquier desviación debe ser justificada y aprobada mediante una enmienda a este documento. Las revisiones de código (PRs) deben verificar estrictamente el cumplimiento de la arquitectura basada en features y la separación de lógica/UI.

**Version**: 1.2.0 | **Ratified**: 2025-12-11 | **Last Amended**: 2025-12-11
