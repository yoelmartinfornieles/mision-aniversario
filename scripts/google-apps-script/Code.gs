var PROTECTED_RECIPIENT_ = 'carlagiustozzi@gmail.com';
var UNLOCK_DATE_MADRID_ = '2026-11-13';

function doGet() {
  return json_({ ok: true, service: 'mision-aniversario-mailer' });
}

function doPost(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const expectedSecret = props.getProperty('MAIL_SECRET');
    const defaultTo = props.getProperty('RECIPIENT_EMAIL');
    const bcc = (props.getProperty('BCC_EMAIL') || '').trim();

    if (!expectedSecret || !defaultTo) {
      return json_({ ok: false, error: 'Server not configured (MAIL_SECRET / RECIPIENT_EMAIL)' });
    }

    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: 'Empty body' });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return json_({ ok: false, error: 'Invalid JSON' });
    }

    if (!data || data.secret !== expectedSecret) {
      return json_({ ok: false, error: 'Unauthorized' });
    }

    var subject = String(data.subject || '').trim();
    var message = String(data.message || '').trim();
    if (!subject || !message) {
      return json_({ ok: false, error: 'subject and message required' });
    }

    var to = String(data.to || defaultTo).trim();
    if (!to) {
      return json_({ ok: false, error: 'No recipient' });
    }

    if (isProtectedRecipientLocked_(to) || isProtectedRecipientLocked_(bcc)) {
      return json_({
        ok: false,
        error:
          'Protected recipient locked until ' +
          UNLOCK_DATE_MADRID_ +
          ' (Europe/Madrid)',
      });
    }

    if (!allowSend_()) {
      return json_({ ok: false, error: 'Daily limit reached' });
    }

    var withDisneyLogo = data.disneyLogo === true;
    var blob = attachmentBlob_(data.attachment);
    var variant = String(data.variant || '').trim().toLowerCase();
    if (variant !== 'invite' && variant !== 'finale') {
      variant = withDisneyLogo ? 'finale' : 'invite';
    }

    var brandOpts = {
      variant: variant,
      withDisneyLogo: withDisneyLogo,
      ctaUrl: String(data.ctaUrl || '').trim(),
      ctaLabel: String(data.ctaLabel || '').trim(),
      preheader: String(data.preheader || '').trim(),
      showAttachmentHint: !!blob || data.hasAttachment === true,
    };

    var html =
      data.html && String(data.html).trim()
        ? String(data.html)
        : buildBrandedHtml_(message, brandOpts);

    var options = {
      to: to,
      subject: subject,
      body: message,
      htmlBody: html,
      name: 'Archivo clasificado',
    };
    options.inlineImages = { mailBanner: mailBannerBlob_(variant) };
    if (withDisneyLogo) {
      options.inlineImages.disneyLogo = disneyLogoBlob_();
    }
    if (bcc) {
      options.bcc = bcc;
    }
    if (blob) {
      options.attachments = [blob];
    }

    MailApp.sendEmail(options);
    bumpSend_();

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function normalizeEmail_(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

function isProtectedRecipientLocked_(email) {
  if (normalizeEmail_(email) !== PROTECTED_RECIPIENT_) return false;
  var today = Utilities.formatDate(new Date(), 'Europe/Madrid', 'yyyy-MM-dd');
  return today < UNLOCK_DATE_MADRID_;
}

function allowSend_() {
  var props = PropertiesService.getScriptProperties();
  var today = Utilities.formatDate(new Date(), 'Europe/Madrid', 'yyyy-MM-dd');
  var key = 'SEND_COUNT_' + today;
  var count = Number(props.getProperty(key) || '0');
  var limit = Number(props.getProperty('DAILY_LIMIT') || '20');
  return count < limit;
}

function bumpSend_() {
  var props = PropertiesService.getScriptProperties();
  var today = Utilities.formatDate(new Date(), 'Europe/Madrid', 'yyyy-MM-dd');
  var key = 'SEND_COUNT_' + today;
  var count = Number(props.getProperty(key) || '0');
  props.setProperty(key, String(count + 1));
}

var MAX_ATTACHMENT_BYTES_ = 4.5 * 1024 * 1024;

function attachmentBlob_(att) {
  if (!att || typeof att !== 'object') return null;

  var filename = String(att.filename || '').trim();
  var b64 = String(att.contentBase64 || '').replace(/\s/g, '');
  if (!filename || !b64) return null;

  if (/[\/\\]/.test(filename) || filename.indexOf('..') !== -1) {
    throw new Error('Invalid attachment filename');
  }

  var mime = String(att.mimeType || 'application/octet-stream').trim();
  var bytes = Utilities.base64Decode(b64);
  if (bytes.length > MAX_ATTACHMENT_BYTES_) {
    throw new Error('Attachment too large');
  }

  return Utilities.newBlob(bytes, mime, filename);
}

function escapeHtml_(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripCtaFromMessage_(message, ctaUrl) {
  var text = String(message || '');
  if (!ctaUrl) return text;
  text = text.split(ctaUrl).join('');
  text = text.replace(/Enlace al archivo:\s*/gi, '');
  text = text.replace(/Base de operaciones \(Airbnb\):\s*/gi, '');
  text = text.replace(/[ \t]+\n/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

function splitTrailingSignoff_(text) {
  var match = String(text || '').match(
    /^([\s\S]*?)(\n+—\s*Archivo clasificado[^\n]*)$/
  );
  if (!match) return { body: String(text || ''), signoff: '' };
  return { body: match[1].trim(), signoff: match[2].trim() };
}

function paragraphsToHtml_(text) {
  if (!text) return '';

  var linkStyle =
    'color:#8b3a2a;text-decoration:underline;word-break:break-all;';
  var paraStyle =
    'margin:0 0 16px;font-family:Georgia,Times New Roman,serif;' +
    'font-size:16px;line-height:1.7;color:#1c1914;';

  var paragraphs = text.split(/\r?\n\r?\n/);
  var html = '';
  for (var i = 0; i < paragraphs.length; i++) {
    var chunk = paragraphs[i].trim();
    if (!chunk) continue;
    var escaped = escapeHtml_(chunk);
    var withBreaks = escaped.replace(/\r\n|\r|\n/g, '<br>\n');
    withBreaks = withBreaks.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" style="' + linkStyle + '">$1</a>'
    );
    html += '<p style="' + paraStyle + '">' + withBreaks + '</p>';
  }
  return html;
}

function formatMessageParts_(message, ctaUrl) {
  var text = stripCtaFromMessage_(message, ctaUrl);
  var parts = splitTrailingSignoff_(text);
  return {
    bodyHtml: paragraphsToHtml_(parts.body),
    signoffHtml: parts.signoff
      ? paragraphsToHtml_(parts.signoff)
      : '',
  };
}

function blobFromB64_(b64, mimeType, filename, missingMsg) {
  if (typeof b64 === 'undefined' || !b64) {
    throw new Error(missingMsg);
  }
  return Utilities.newBlob(Utilities.base64Decode(b64), mimeType, filename);
}

function disneyLogoBlob_() {
  return blobFromB64_(
    typeof DISNEY_LOGO_B64_ !== 'undefined' ? DISNEY_LOGO_B64_ : '',
    'image/png',
    'disney-logo.png',
    'Missing LogoData.gs (DISNEY_LOGO_B64_)'
  );
}

/** Invite → Yoel desk; finale → Carla detective. */
function mailBannerBlob_(variant) {
  return variant === 'finale' ? carlaBannerBlob_() : yoelBannerBlob_();
}

function carlaBannerBlob_() {
  return blobFromB64_(
    typeof CARLA_BANNER_B64_ !== 'undefined' ? CARLA_BANNER_B64_ : '',
    'image/jpeg',
    'carla-detective-banner.jpg',
    'Missing BannerData.gs (CARLA_BANNER_B64_)'
  );
}

function yoelBannerBlob_() {
  return blobFromB64_(
    typeof YOEL_BANNER_B64_ !== 'undefined' ? YOEL_BANNER_B64_ : '',
    'image/jpeg',
    'yoel-desk-invite-banner.jpg',
    'Missing InviteBannerData.gs (YOEL_BANNER_B64_)'
  );
}

function preheaderBlock_(text) {
  var safe = escapeHtml_(text);
  var pad = '';
  for (var i = 0; i < 80; i++) {
    pad += '&nbsp;&zwnj;';
  }
  return (
    '<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;' +
    'opacity:0;overflow:hidden;mso-hide:all;">' +
    safe +
    pad +
    '</div>'
  );
}

function stampBlock_(label) {
  return (
    '<p style="margin:0 0 8px;text-align:center;font-family:\'Courier New\',Courier,monospace;' +
    'font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#9a4230;">' +
    escapeHtml_(label) +
    '</p>'
  );
}

function ctaBlock_(url, label) {
  var href = escapeHtml_(url);
  var text = escapeHtml_(label || 'Abrir el expediente');
  return (
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" ' +
    'style="margin:6px auto 10px;">' +
    '<tr><td align="center" bgcolor="#9a4230" ' +
    'style="background:#9a4230;border:1px solid #7a3224;">' +
    '<a href="' +
    href +
    '" style="display:inline-block;padding:14px 26px;' +
    "font-family:'Courier New',Courier,monospace;font-size:12px;letter-spacing:0.14em;" +
    'text-transform:uppercase;color:#f3ebde;text-decoration:none;font-weight:700;">' +
    text +
    '</a></td></tr></table>' +
    '<p style="margin:0 0 18px;text-align:center;font-family:\'Courier New\',Courier,monospace;' +
    'font-size:10px;line-height:1.5;color:#5a5248;word-break:break-all;">' +
    '<a href="' +
    href +
    '" style="color:#8b3a2a;text-decoration:underline;">' +
    href +
    '</a></p>'
  );
}

function logoBlock_() {
  return (
    '<div style="text-align:center;margin:4px 0 18px;">' +
    '<img src="cid:disneyLogo" width="260" height="126" alt="Disney" ' +
    'style="display:block;margin:0 auto;width:48%;max-width:260px;height:auto;' +
    'border:0;outline:none;text-decoration:none;">' +
    '</div>'
  );
}

function bannerBlock_() {
  return (
    '<tr><td bgcolor="#1c1914" style="padding:0;background:#1c1914;line-height:0;font-size:0;">' +
    '<img src="cid:mailBanner" width="544" height="306" alt="Archivo clasificado" ' +
    'style="display:block;width:100%;max-width:544px;height:auto;border:0;outline:none;' +
    'text-decoration:none;">' +
    '</td></tr>'
  );
}

function attachmentHintBlock_() {
  return (
    '<p style="margin:8px 0 0;text-align:center;font-family:\'Courier New\',Courier,monospace;' +
    'font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9a4230;">' +
    '&darr; Prueba adjunta &middot; entradas a los parques</p>'
  );
}

function buildBrandedHtml_(message, opts) {
  opts = opts || {};
  var variant = opts.variant === 'finale' ? 'finale' : 'invite';
  var withDisneyLogo = opts.withDisneyLogo === true;
  var ctaUrl = String(opts.ctaUrl || '').trim();
  var ctaLabel = String(opts.ctaLabel || '').trim();
  var showAttachmentHint = opts.showAttachmentHint === true;

  var defaultPreheader =
    variant === 'finale'
      ? 'Expediente cerrado. La pieza que faltaba: Disneyland Paris.'
      : 'Hay un expediente con tu nombre en la portada.';
  var preheader = String(opts.preheader || defaultPreheader).trim();

  var stamp =
    variant === 'finale' ? 'Caso cerrado' : 'Dossier abierto';
  var parts = formatMessageParts_(message, ctaUrl);
  var ctaHtml = ctaUrl ? ctaBlock_(ctaUrl, ctaLabel) : '';
  var logoHtml = withDisneyLogo ? logoBlock_() : '';
  var attachHtml = showAttachmentHint ? attachmentHintBlock_() : '';

  return (
    '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="color-scheme" content="light only">' +
    '<meta name="supported-color-schemes" content="light only">' +
    '<title>Archivo clasificado</title></head>' +
    '<body style="margin:0;padding:0;background:#1a1714;-webkit-text-size-adjust:100%;">' +
    preheaderBlock_(preheader) +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ' +
    'bgcolor="#1a1714" style="background:#1a1714;width:100%;">' +
    '<tr><td align="center" bgcolor="#1a1714" style="padding:28px 14px;background:#1a1714;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ' +
    'bgcolor="#f3ebde" style="max-width:560px;width:100%;background:#f3ebde;' +
    'border:1px solid rgba(28,25,20,0.22);">' +
    '<tr><td bgcolor="#f3ebde" style="padding:8px;background:#f3ebde;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ' +
    'style="border:1px dashed rgba(28,25,20,0.18);">' +
    bannerBlock_() +
    '<tr><td bgcolor="#f3ebde" style="padding:18px 22px 24px;background:#f3ebde;">' +
    '<p style="margin:0 0 4px;text-align:center;font-family:\'Courier New\',Courier,monospace;' +
    'font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#5a5248;">' +
    'Archivo clasificado</p>' +
    stampBlock_(stamp) +
    '<p style="margin:0 0 18px;text-align:center;font-family:Georgia,\'Times New Roman\',serif;' +
    'font-size:22px;line-height:1.25;color:#1c1914;font-weight:700;">' +
    'El caso del aniversario</p>' +
    '<div style="height:1px;background:rgba(28,25,20,0.18);margin:0 0 20px;"></div>' +
    logoHtml +
    parts.bodyHtml +
    ctaHtml +
    attachHtml +
    parts.signoffHtml +
    '<div style="height:1px;border-top:1px dashed rgba(28,25,20,0.22);margin:24px 0 14px;"></div>' +
    '<p style="margin:0;font-family:\'Courier New\',Courier,monospace;' +
    'font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#5a5248;">' +
    'Confidencial &middot; No reenviar</p>' +
    '</td></tr></table>' +
    '</td></tr></table>' +
    '</td></tr></table>' +
    '</body></html>'
  );
}
