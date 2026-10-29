# iest-tfi_quini-178-362

Trabajo Final Integrador de **Quini 178/362**: sistema de fichas digitales
para dos agencias de quiniela, desarrollado con IA y Spec-Driven Development
(SDD).

- **Repositorio:** <https://github.com/samelit-spect/iest-tfi_quini-178-362>
- **Sitio publicado:** <https://iest-tfi-quini-178-362.netlify.app>
- **Video promocional:** [ver en YouTube](https://youtu.be/LKNPjyKvsok)

## Qué resuelve

La app reemplaza la ficha de papel por un registro digital: carga de
movimientos, confirmación por el dueño, planilla pública para el cliente,
cierre de turno en tirillas y panel de administración para las agencias
178 y 362.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Firebase Auth + Firestore
- Vitest + Oxlint
- Deploy previsto en Netlify

## Estructura

```text
iest-tfi_quini-178-362/
├── AGENTS.md · CLAUDE.md · memory.md · README.md
├── docs/                 # kit TP4, constitución, identidad, prompts, seguridad
├── specs/                # 001, 002 y 003 con spec, plan, tasks y verificación
├── .agents/ · .opencode/ # skills y comandos del agente
├── src/                  # app React
├── tests/                # tests básicos
├── public/marca/         # logo, isotipo, favicon, banner y paleta
├── public/media/         # piezas finales publicadas
└── multimedia/           # imágenes, video, gráficos, guiones y fichas IA
```

## Puesta en marcha

```bash
npm install
cp .env.example .env
npm run dev
```

Completar en `.env` las variables `VITE_FIREBASE_*`. El archivo `.env` está
ignorado por git y **nunca** debe subirse.

## Scripts

```bash
npm run dev      # servidor local
npm run build    # build de producción en dist/
npm run lint     # Oxlint
npm test         # Vitest
```

## Documentación clave

- [Constitución](docs/CONSTITUCION.md)
- [Identidad de marca](docs/IDENTIDAD-MARCA.md)
- [Guía de commits y deploy](docs/GUIA-COMMITS.md)
- [Prompts y errores de IA](docs/PROMPTS.md)
- [Especificaciones](specs/)
- [Fichas de piezas IA](multimedia/FICHAS-IA.md)

## Uso de IA

El proyecto se desarrolló con un agente de IA siguiendo SDD: una tarea por
vez, tests primero, revisión de cada archivo y un commit por tarea. Los
pedidos, errores y correcciones se documentan en `docs/PROMPTS.md` y
`docs/SESION-ERRORES-IA.md`; el detalle de las piezas generadas está en
`multimedia/FICHAS-IA.md` y la declaración en `docs/DECLARACION-IA.md`.

## Seguridad

- No commitear `.env`, credenciales ni claves privadas.
- Los movimientos confirmados son inmutables.
- Las reglas de Firestore viven en `firestore.rules`.
