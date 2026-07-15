# Bitácora de uso de Claude Code

Registro de los comandos/funciones de Claude Code utilizados durante la construcción
del proyecto **Gestor de Tareas** (backend Express + Supabase, frontend React + Vite),
y el motivo de cada uso.

## `/init`

**Para qué se usó:** generar el `CLAUDE.md` inicial a partir del código y la
documentación existentes (`docs/spec.md`), para que cualquier sesión futura de
Claude Code (u otro colaborador) tenga de entrada el contexto de arquitectura,
comandos y convenciones del repo sin tener que redescubrirlo leyendo todo el código
cada vez.

**Momento del proyecto:** al arrancar el proyecto, con `docs/spec.md` ya escrito
pero antes de tener código (`backend/` y `frontend/` vacíos), y de nuevo tras
dividir el backend en su propia carpeta (`refactor: split backend into its own
backend/ folder`) para que `CLAUDE.md` reflejara la nueva estructura de dos
proyectos hermanos.

## `/plan` (modo de planificación)

**Para qué se usó:** antes de escribir una sola línea de código del backend, para
acordar con el usuario la arquitectura completa (capas `routes → controllers →
services → repositories → supabaseClient`), la lista exacta de archivos, las
decisiones de diseño clave (PATCH vacío como no-op, criterio de "vencida", orden
de tareas sin fecha, nivel de mock en tests) y el orden de ejecución, **antes**
de tocar el sistema de archivos. Esto evita implementar sobre una base que el
usuario no aprobó.

**Momento del proyecto:** fase inicial, justo después de `/init`, en la sesión
donde se definió cómo implementar `docs/spec.md` desde cero.

**Antes / después:** el plan inicial asumía `npm` como gestor de paquetes. El
usuario pidió cambiarlo a `pnpm`, lo que implicó ajustar la sección de
dependencias, el orden de ejecución, el README y `package.json`
(`packageManager: "pnpm@<version>"`). Las capturas de pantalla completas del plan
(dividido en 3 segmentos porque no cabía en una sola captura) quedan documentadas
antes y después de ese ajuste:

| Segmento | Antes (npm) | Después (pnpm) |
|---|---|---|
| Parte 1 | `docs/Imagenes/Fase 2.1.png` | `docs/Imagenes/Fase 2.1 - D.png` |
| Parte 2 | `docs/Imagenes/Fase 2.2.png` | `docs/Imagenes/Fase 2.2 - D.png` |
| Parte 3 | `docs/Imagenes/Fase 2.3.png` | `docs/Imagenes/Fase 2.3 - D.png` |

**Antes:**

![Plan antes - parte 1](docs/Imagenes/Fase%202.1.png)
![Plan antes - parte 2](docs/Imagenes/Fase%202.2.png)
![Plan antes - parte 3](docs/Imagenes/Fase%202.3.png)

**Después:**

![Plan después - parte 1](docs/Imagenes/Fase%202.1%20-%20D.png)
![Plan después - parte 2](docs/Imagenes/Fase%202.2%20-%20D.png)
![Plan después - parte 3](docs/Imagenes/Fase%202.3%20-%20D.png)

## `/compact`

**Para qué se usó:** comprimir el historial de la conversación cuando creció
demasiado durante tramos largos de implementación (por ejemplo, al ir generando
capa por capa el backend: repositorio, validadores, servicios, controladores,
rutas y tests), de forma que la sesión pudiera seguir trabajando sin perder el
contexto relevante ni acercarse al límite de la ventana de contexto.

## `/rewind`

**Para qué se usó:** volver atrás a un punto anterior de la conversación o del
estado de los archivos cuando un cambio tomaba un rumbo no deseado (por ejemplo,
un ajuste que se prefería descartar antes de seguir avanzando), sin tener que
deshacerlo manualmente archivo por archivo.

## `/cost` y `/usage`

**Para qué se usó:** revisar puntualmente el costo acumulado y el consumo de
tokens de la sesión durante tramos largos de trabajo, para tener visibilidad del
gasto y decidir si convenía cerrar, compactar o continuar la sesión.

## Skills del proyecto (`.claude/skills/`)

El proyecto define skills reutilizables que se invocan durante el desarrollo diario:

- **`conventional-commit`** — usado para crear los commits siguiendo el formato
  Conventional Commits (coherente con el historial real: `feat(frontend): ...`,
  `refactor: ...`).
- **`new-endpoint`** — usado para aplicar las reglas de capas del backend
  (`routes → controllers → services → repositories`) cada vez que se agregó o
  modificó un endpoint de la API.
