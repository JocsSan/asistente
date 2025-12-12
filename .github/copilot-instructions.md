# Instrucciones de Comportamiento para GitHub Copilot

## Normativa de Commits (Git Workflow)
Siempre que generes comandos de git commit, DEBES seguir estrictamente la convención **Conventional Commits** e incluir un **emoji** representativo después de los dos puntos.

Formato: `<tipo>(<scope>): <emoji> <descripción>`

### Tabla de Referencia Gitmoji

| Emoji | Código | Descripción |
| :---: | :--- | :--- |
| ✨ | `:sparkles:` | Introduce new features. |
| 🐛 | `:bug:` | Fix a bug. |
| ♻️ | `:recycle:` | Refactor code. |
| 📝 | `:memo:` | Add or update documentation. |
| 🚀 | `:rocket:` | Deploy stuff. |
| 💄 | `:lipstick:` | Add or update the UI and style files. |
| 🔧 | `:wrench:` | Add or update configuration files. |
| 🔨 | `:hammer:` | Add or update development scripts. |
| 📦 | `:package:` | Add or update compiled files or packages. |
| ✅ | `:white_check_mark:` | Add, update, or pass tests. |
| 🔒 | `:lock:` | Fix security issues. |
| 🚧 | `:construction:` | Work in progress. |

## Estilo de Código
- Usa TypeScript y React Native.
- Prefiere componentes funcionales y Hooks.
- Estilos: StyleSheet.create (no inline, no Tailwind).
