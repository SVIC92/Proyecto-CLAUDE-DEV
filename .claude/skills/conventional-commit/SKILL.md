---
name: conventional-commit
description: Crea un commit de git usando el formato Conventional Commits. Úsalo cuando el usuario pida "commitea esto", "haz un commit", "crea un commit convencional" o similar.
---

# Conventional Commit

Crea commits de git siguiendo la especificación [Conventional Commits](https://www.conventionalcommits.org/).

## Pasos

1. Ejecuta en paralelo:
   - `git status` (para ver archivos sin trackear/modificados)
   - `git diff` (o `git diff --staged` si ya hay archivos en stage) para ver los cambios reales
   - `git log --oneline -10` para revisar el estilo de mensajes reciente del repo
2. Analiza el diff completo (no solo el último archivo) y determina:
   - **type**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`, `build`, `ci`
   - **scope** (opcional): carpeta o módulo afectado, p. ej. `backend`, `frontend`, `tasks`, `routes`
   - **description**: resumen corto en imperativo (qué hace el cambio, no cómo)
3. Si el cambio rompe compatibilidad, usa `!` después del type/scope (`feat(api)!: ...`) y agrega un footer `BREAKING CHANGE: ...`.
4. Formato del mensaje:
   ```
   <type>[(scope)]: <description>

   [body opcional — el porqué, no el qué, solo si aporta contexto no obvio]
   ```
5. Haz `git add` solo de los archivos relevantes al cambio (nunca `-A` ni `.` a ciegas; no incluyas `.env`, credenciales, ni binarios grandes sin confirmar con el usuario).
6. Crea el commit con el mensaje vía heredoc (ver protocolo de git del sistema).
7. Ejecuta `git status` después para confirmar que el commit se creó correctamente.

## Reglas

- Nunca uses `git commit --amend` a menos que el usuario lo pida explícitamente.
- Nunca uses `--no-verify` para saltar hooks.
- Nunca hagas `git push` a menos que el usuario lo pida explícitamente.
- Si no hay cambios para commitear, dilo y no crees un commit vacío.
- Si el pre-commit hook falla, corrige el problema y crea un commit NUEVO (no amend).
- El mensaje debe reflejar el "por qué" del cambio cuando no sea obvio, no solo repetir el diff.
