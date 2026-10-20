export async function postMail({
	endpoint,
	secret,
	subject,
	message,
	to,
	html,
	disneyLogo,
	attachment,
	variant,
	ctaUrl,
	ctaLabel,
	preheader,
	hasAttachment,
}) {
	const payload = { secret, subject, message };
	if (to) payload.to = to;
	if (html) payload.html = html;
	if (disneyLogo) payload.disneyLogo = true;
	if (attachment) payload.attachment = attachment;
	if (variant) payload.variant = variant;
	if (ctaUrl) payload.ctaUrl = ctaUrl;
	if (ctaLabel) payload.ctaLabel = ctaLabel;
	if (preheader) payload.preheader = preheader;
	if (hasAttachment) payload.hasAttachment = true;

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'text/plain;charset=utf-8' },
		body: JSON.stringify(payload),
		redirect: 'follow',
	});

	const text = await response.text().catch(() => '');
	let data = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = null;
	}

	if (!response.ok || !data?.ok) {
		const detail = data?.error || text || `HTTP ${response.status}`;
		throw new Error(detail);
	}

	return data;
}
