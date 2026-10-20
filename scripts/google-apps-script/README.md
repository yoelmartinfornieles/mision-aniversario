# Mailer Google Apps Script

Sustituye Formspree: emails con asunto, HTML al estilo “archivo clasificado”, nombre de remitente y adjuntos (desde tu Gmail).

## Despliegue

1. Abre [script.google.com](https://script.google.com) → **Nuevo proyecto** (o abre el proyecto existente).
2. Pega [`Code.gs`](./Code.gs) en el archivo principal.
3. **Archivo → Nuevo → Archivo de script** llamado `LogoData` y pega [`LogoData.gs`](./LogoData.gs) (PNG del logo Disney, fondo transparente, embebido en base64).
4. **Archivo → Nuevo → Archivo de script** llamado `BannerData` y pega [`BannerData.gs`](./BannerData.gs) (banner de Carla, JPEG embebido; fuente [`app/public/mail/carla-detective-banner.jpg`](../../app/public/mail/carla-detective-banner.jpg) — solo **finale**).
5. **Archivo → Nuevo → Archivo de script** llamado `InviteBannerData` y pega [`InviteBannerData.gs`](./InviteBannerData.gs) (banner de Yoel escritorio noir; fuente [`app/public/mail/yoel-desk-invite-banner.jpg`](../../app/public/mail/yoel-desk-invite-banner.jpg) — solo **invite**).
6. **Proyecto → Configuración → Propiedades del script**:

   | Clave | Valor |
   | --- | --- |
   | `MAIL_SECRET` | Cadena larga aleatoria |
   | `RECIPIENT_EMAIL` | Destinataria del regalo |
   | `BCC_EMAIL` | (opcional) tu email |
   | `DAILY_LIMIT` | (opcional) default `20` |

7. **Implementar → Nueva implementación → Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
8. Copia la URL (`https://script.google.com/macros/s/…/exec`).

Si ya tenías una implementación, tras editar el código usa **Implementar → Administrar implementaciones → ✏️ → Nueva versión** para que el cambio entre en vigor (la URL suele ser la misma).

El banner inline (`cid:mailBanner`) cambia por `variant`:
- **invite** → Yoel escritorio noir ([`yoel-desk-invite-banner.jpg`](../../app/public/mail/yoel-desk-invite-banner.jpg) / `InviteBannerData.gs`)
- **finale** → Carla detective ([`carla-detective-banner.jpg`](../../app/public/mail/carla-detective-banner.jpg) / `BannerData.gs`)

Para regenerar un `.gs` de banner tras cambiar el JPEG:

```bash
node scripts/embed-mail-banner.mjs invite   # → InviteBannerData.gs
node scripts/embed-mail-banner.mjs finale   # → BannerData.gs
```

El **logo Disney** (inline `cid:disneyLogo`) solo se incrusta si el body lleva `"disneyLogo": true` — úsalo en el mail de **caso cerrado**, no en la invitación (spoiler). Fuente: [`app/public/finale/disney-logo.png`](../../app/public/finale/disney-logo.png).

**Candado de fecha:** `carlagiustozzi@gmail.com` no recibe nada (ni en `to` ni en `bcc`) **antes** del **13/11/2026** (`Europe/Madrid`). Ese día y después sí — el Action de invitación del 13 debe poder enviar. Pruebas previas: otro `to` (p. ej. `TEST_EMAIL_TO`).

## Secrets del repo / `.env`

| Dónde | Nombre | Valor |
| --- | --- | --- |
| Actions | `GAS_WEBAPP_URL` | URL `/exec` |
| Actions | `GAS_MAIL_SECRET` | mismo `MAIL_SECRET` |
| Actions | `SITE_URL` | URL pública del juego |
| Pages build | `VITE_GAS_WEBAPP_URL` | misma URL |
| Pages build | `VITE_GAS_MAIL_SECRET` | mismo secret |
| Pages build | `VITE_AIRBNB_URL` | (opcional) link Airbnb en el mail de cierre |
| Local `app/.env` | iguales con prefijo `VITE_` | |

## Cuerpo y adjuntos

El mailer envuelve `message` en una plantilla HTML (papel manila, tipografía serif). Variantes:

| Campo | Uso |
| --- | --- |
| `variant` | `invite` (sello **Dossier abierto**) o `finale` (**Caso cerrado**). Si falta: `finale` si `disneyLogo`, si no `invite`. |
| `ctaUrl` / `ctaLabel` | Botón HTML (invite: expediente; finale: Airbnb / base de operaciones). La URL se quita del cuerpo HTML para no duplicar; sigue en el texto plano. |
| `preheader` | Texto de bandeja de entrada (default por variante). |
| `disneyLogo` | Logo inline (solo **caso cerrado**). |
| `attachment` | Adjunto; muestra pista “↓ Prueba adjunta” en el HTML. |

Caso cerrado:

```json
{
  "variant": "finale",
  "disneyLogo": true,
  "preheader": "Expediente cerrado. La pieza que faltaba: Disneyland Paris.",
  "attachment": {
    "filename": "entradas-disney-parques.jpg",
    "mimeType": "image/jpeg",
    "contentBase64": "…"
  }
}
```

Invitación:

```json
{
  "variant": "invite",
  "ctaUrl": "https://…",
  "ctaLabel": "Abrir el expediente",
  "preheader": "Hay un expediente con tu nombre en la portada."
}
```

## Probar el web app

```bash
curl -sL -X POST "$GAS_WEBAPP_URL" \
  -H 'Content-Type: text/plain;charset=utf-8' \
  -d "{\"secret\":\"$GAS_MAIL_SECRET\",\"subject\":\"Prueba\",\"message\":\"Hola\",\"to\":\"tu@email.com\"}"
```

Respuesta esperada: `{"ok":true}`.

Ambos mails de prueba (invite + finale con adjunto):

```bash
GAS_WEBAPP_URL=… GAS_MAIL_SECRET=… SITE_URL=… \
TEST_EMAIL_TO=tu@email.com \
node scripts/send-test-emails.mjs
```

La primera llamada puede pedir autorizar el acceso a Gmail en el editor de Apps Script (menú **Ejecutar** sobre una función de prueba, o aceptar el diálogo al desplegar).

## Nota de seguridad

`VITE_GAS_MAIL_SECRET` viaja en el bundle del cliente. El límite diario y el secret mitigan abuso; no es un sistema cerrado. Para la invitación del 13/nov el secret solo vive en GitHub Actions.
