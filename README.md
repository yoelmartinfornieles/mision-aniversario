# Misión: Aniversario

Escape room web personal con estética de archivo clasificado. Cinco dossiers, avance por códigos de guardado y un cierre por email cuando el caso queda resuelto.

> **Archivo clasificado · Confidencial**  
> *Una aventura acaba… pero otra empieza.*

## Qué es

Una experiencia interactiva (React + TypeScript + Vite) pensada como regalo de aniversario: la detective abre dossiers, resuelve escenas del pasado compartido y, al cerrar el expediente, recibe la pieza que faltaba.

| Dossier | Título | Tipo (alto nivel) |
| ---: | --- | --- |
| 1 | Cuando todo comenzó | Lógica tipo murdoku |
| 2 | La primera casa | Puzzle hexagonal |
| 3 | Nacimiento de Kai | Lógica tipo murdoku |
| 4 | Mudanza a Arroa | Mahjong / matching |
| 5 | El complot del regalo | Revelación final (se desbloquea al completar los cuatro) |

El progreso se guarda en el navegador. Tras cada dossier, el juego ofrece un **código de continuación** para retomar en otro dispositivo.

## Estructura

```
app/                 Aplicación web (Vite)
  src/pages/         Landing e enrutado de retos
  src/puzzles/       Un directorio por dossier (+ shared/)
  src/lib/           Progreso, navegación, aviso final
  public/            Assets estáticos (fondos, finale…)
scripts/             Envío programado de la invitación
.github/workflows/   Cron del email del 13 de noviembre
```

## Desarrollo local

Requisitos: Node.js 20+ recomendado.

```bash
cd app
npm install
cp .env.example .env   # opcional: Formspree para el email final
npm run dev
```

### Scripts (`app/`)

| Comando | Uso |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Typecheck + build de producción |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | Oxlint |
| `npm run format` | Prettier |

## Email al cerrar el caso (dossier 5)

Al resolver el último dossier, la app hace un `POST` a Formspree **una sola vez por navegador** (marca en `localStorage`).

1. Crea un formulario en [Formspree](https://formspree.io).
2. Destino principal: la dirección de quien debe recibir el regalo.
3. Añade una notificación extra / BCC **en el dashboard de Formspree** (no en el código cliente: acabaría en el bundle).
4. Copia el endpoint a `app/.env`:

```bash
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxx
```

Sin esta variable el juego funciona igual; el envío se omite y queda un aviso en consola.

Detalle de variables: [`app/.env.example`](./app/.env.example).

## Email de invitación (13 de noviembre)

El frontend no puede programar envíos. Un GitHub Action hace un `POST` a Formspree el **13 de noviembre a las 09:00 UTC** con el enlace al juego y el tono de “dossier abierto”.

**Idempotencia:** el cron de GitHub es anual, pero el script (y un gate en el workflow) solo envían si el año UTC es **2026**. Así no se reenvía en 2027+. Tras el envío real, desactiva el workflow (**Actions → Invite email → ⋯ → Disable workflow**) o borra el `schedule`.

1. Despliega la app y anota la URL pública.
2. En el repo → **Settings → Secrets and variables → Actions**:
   - `FORMSPREE_ENDPOINT` — mismo `https://formspree.io/f/xxxx` del `.env`
   - `SITE_URL` — URL pública sin barra final (p. ej. `https://tu-dominio.com`)
3. Prueba: **Actions → Invite email (13 Nov) → Run workflow**.
4. Para forzar fuera de 2026 (solo pruebas): variable de Actions `FORCE_INVITE=1`.

Prueba local:

```bash
FORMSPREE_ENDPOINT=https://formspree.io/f/xxxx \
SITE_URL=https://tu-dominio.com \
node scripts/send-invite-email.mjs
```

## Despliegue (GitHub Pages)

El workflow [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) construye `app/` y publica en Pages al hacer push a `aniversary` o `main`.

1. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. (Opcional) Secret `VITE_FORMSPREE_ENDPOINT` para el email del dossier 5.
3. URL esperada: `https://yoelmartinfornieles.github.io/mision-aniversario/`
4. Pon esa URL (sin barra final) en el secret `SITE_URL` del workflow de invitación.

En CI el `base` de Vite es `/mision-aniversario/`; en local sigue siendo `/`.

## Privacidad

Repo pensado como proyecto personal / sorpresa. No publiques spoilers de códigos de guardado ni el contenido del email final si la destinataria aún no ha jugado.
