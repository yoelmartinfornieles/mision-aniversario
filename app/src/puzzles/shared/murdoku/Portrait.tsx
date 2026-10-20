type PortraitProps = {
	gender: string;
	isVictim?: boolean;
	size?: 'card' | 'board';
	src?: string;
	alt?: string;
};

export const Portrait = ({
	gender,
	isVictim = false,
	size = 'card',
	src,
	alt = '',
}: PortraitProps) => (
	<span
		className={`portrait portrait--${size}${isVictim ? ' portrait--victim' : ''}${src ? ' portrait--photo' : ''}`}
		data-gender={gender}
		aria-hidden={src ? undefined : true}
	>
		{src ? (
			<img
				className="portrait-img"
				src={src}
				alt={alt}
				loading="lazy"
				decoding="async"
				draggable={false}
			/>
		) : (
			<svg className="portrait-svg" viewBox="0 0 64 64">
				{/* shoulders */}
				<path
					className="portrait-body"
					d="M10 60 C14 42, 22 38, 32 38 C42 38, 50 42, 54 60 Z"
				/>
				{/* head */}
				<circle cx="32" cy="24" r="13" className="portrait-head" />
				{/* hair */}
				<path
					className="portrait-hair"
					d="M19 24 C19 10, 45 10, 45 24 C42 14, 22 14, 19 24 Z"
				/>
			</svg>
		)}
	</span>
);

/**
 * Initials from the name (or a compact shortName like "E+I").
 * "Carla" → C · "Eloy e Isa" → EI · "AbuPepe" → AP
 */
export const letterForSuspect = (
	name: string,
	shortName?: string
): string => {
	if (shortName && shortName.length <= 3 && /[+·]/.test(shortName)) {
		return shortName.toUpperCase();
	}

	const parts = name
		.split(/\s+(?:e|y|and|&)\s+|\s+/i)
		.map((part) => part.trim())
		.filter(Boolean);

	if (parts.length >= 2) {
		return parts
			.map((part) => part.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 3);
	}

	const camelCaps = name.match(/[A-ZÁÉÍÓÚÜÑ]/g);
	if (camelCaps && camelCaps.length >= 2 && !/\s/.test(name)) {
		return camelCaps.slice(0, 2).join('');
	}

	return name.charAt(0).toUpperCase();
};
