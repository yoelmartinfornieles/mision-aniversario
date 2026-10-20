# El caso del aniversario

Escape room web personal con estética de archivo clasificado. Cinco dossiers, avance por claves de guardado y un cierre por email cuando el caso queda resuelto.

> **Archivo clasificado · Confidencial**  
> *El expediente lleva nueve años abierto. Hoy toca cerrarlo.*

![Portada del archivo — El caso del aniversario](docs/screenshots/01-landing.png)

<p align="center">
  <img src="docs/screenshots/02-murdoku.png" alt="Dossier 1 — Murdoku" width="32%" />
  <img src="docs/screenshots/03-hexagon.png" alt="Dossier 2 — Hexágono" width="32%" />
  <img src="docs/screenshots/04-mahjong.png" alt="Dossier 4 — Mahjong" width="32%" />
</p>

## Qué es

Una experiencia interactiva (React + TypeScript + Vite) pensada como regalo de aniversario: la detective abre dossiers, resuelve escenas del pasado compartido y, al cerrar el expediente, recibe la pieza que faltaba.

| Dossier | Título | Tipo (alto nivel) |
| ---: | --- | --- |
| 1 | Cuando todo comenzó | Lógica tipo murdoku |
| 2 | La primera casa | Puzzle hexagonal |
| 3 | Nacimiento de Kai | Lógica tipo murdoku |
| 4 | Mudanza a Arroa | Mahjong / matching |
| 5 | El complot del regalo | Revelación final (se desbloquea al completar los cuatro) |

El progreso se guarda automáticamente en el navegador. Tras cada dossier, el juego ofrece una **clave de guardado** para recuperar el avance en otro dispositivo o si se borran los datos.

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
cp .env.example .env   # opcional: Apps Script para el email final
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

## Emails (Google Apps Script)

Invitación (13 nov) y cierre del caso salen como **mail normal desde Gmail** (asunto, HTML “archivo clasificado”, nombre de remitente y adjunto de entradas en el cierre), vía un web app de Apps Script.

### Cierre del caso (dossier 5)

Al cerrar el caso (última pregunta), la app hace un `POST` al web app **una sola vez por navegador** (`localStorage`), con el adjunto `entradas-disney.jpg`.

En `app/.env` (y secrets de Pages):

```bash
VITE_GAS_WEBAPP_URL=https://script.google.com/macros/s/XXXX/exec
VITE_GAS_MAIL_SECRET=mismo-que-MAIL_SECRET-del-script
# Opcional — link Airbnb en el cuerpo del mail:
# VITE_AIRBNB_URL=https://www.airbnb.com/rooms/XXXX
```

Sin esas variables el juego funciona igual; el envío se omite.

La destinataria y un BCC opcional viven en **propiedades del script** (`RECIPIENT_EMAIL`, `BCC_EMAIL`), no en el cliente.

### Invitación (13 de noviembre)

Un GitHub Action hace `POST` el **13 de noviembre a las 09:00 UTC**.

**Idempotencia:** el cron es anual; el script solo envía si el año UTC es **2026**. 

1. Prueba: **Actions → Invite email (13 Nov) → Run workflow**.
2. Fuera de 2026: variable `FORCE_INVITE=1`.

Prueba local:

```bash
GAS_WEBAPP_URL=https://script.google.com/macros/s/XXXX/exec \
GAS_MAIL_SECRET=… \
SITE_URL=https://tu-dominio.com \
node scripts/send-invite-email.mjs
```

Ambos mails de prueba:

```bash
GAS_WEBAPP_URL=… GAS_MAIL_SECRET=… SITE_URL=… \
TEST_EMAIL_TO=tu@email.com \
node scripts/send-test-emails.mjs
```

## Despliegue (GitHub Pages)

El workflow [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) construye `app/` y publica en Pages al hacer push a `aniversary` o `main`.

1. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. (Opcional) Secrets `VITE_GAS_WEBAPP_URL`, `VITE_GAS_MAIL_SECRET`, `VITE_AIRBNB_URL`.
3. URL esperada: `https://yoelmartinfornieles.github.io/mision-aniversario/`
4. Pon esa URL (sin barra final) en el secret `SITE_URL` del workflow de invitación.

En CI el `base` de Vite es `/mision-aniversario/`; en local sigue siendo `/`.

## Privacidad

Repo pensado como proyecto personal / sorpresa. No publiques spoilers de claves de guardado ni el contenido del email final si la destinataria aún no ha jugado... Por favor!
