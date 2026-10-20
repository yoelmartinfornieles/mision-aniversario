import { useMemo } from 'react';

export type ClueHighlight =
	| { type: 'room'; value: string }
	| { type: 'object'; value: string }
	| { type: 'person'; value: string }
	| { type: 'keyword'; value: string };

type ClueTextProps = {
	clue: string;
	rooms?: string[];
	objects?: string[];
	people?: string[];
	activeHighlight?: ClueHighlight | null;
	onHighlight?: (highlight: ClueHighlight | null) => void;
	className?: string;
};

const KEYWORDS = [
	'junto a',
	'junto al',
	'junto a la',
	'junto a un',
	'junto a una',
	'al norte',
	'al sur',
	'al este',
	'al oeste',
	'más al norte',
	'más al sur',
	'más al este',
	'más al oeste',
	'sola',
	'solo',
	'solas',
	'solos',
	'sentado',
	'sentada',
	'sentados',
	'sentadas',
	'entre',
	'ventana',
	'esquina',
	'única',
	'único',
	'nadie',
];

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

type Token =
	| { kind: 'text'; value: string }
	| {
			kind: 'mark';
			value: string;
			highlight: ClueHighlight;
			/** Punctuation glued after the mark so it cannot wrap alone. */
			trailing?: string;
	  };

/** Closing punctuation that must stay with the preceding highlighted word. */
const TRAILING_PUNCT_RE = /^([.,;:!?…»"'”’)\]}]+)/u;

const buildPattern = (parts: string[]) => {
	const unique = [...new Set(parts.filter(Boolean))].sort(
		(a, b) => b.length - a.length
	);
	if (unique.length === 0) return null;
	return new RegExp(`(${unique.map(escapeRegExp).join('|')})`, 'gi');
};

/** Attach ", ." etc. to the previous mark so they never orphan on a new line. */
export const glueTrailingPunctuation = (tokens: Token[]): Token[] => {
	const glued: Token[] = [];
	for (let index = 0; index < tokens.length; index++) {
		const token = tokens[index];
		if (token.kind !== 'mark') {
			glued.push(token);
			continue;
		}

		const next = tokens[index + 1];
		if (next?.kind === 'text') {
			const match = next.value.match(TRAILING_PUNCT_RE);
			if (match) {
				const trailing = match[1];
				const rest = next.value.slice(trailing.length);
				glued.push({ ...token, trailing });
				if (rest) glued.push({ kind: 'text', value: rest });
				index += 1;
				continue;
			}
		}

		glued.push(token);
	}
	return glued;
};

export const tokenizeClue = (
	clue: string,
	rooms: string[] = [],
	objects: string[] = [],
	people: string[] = []
): Token[] => {
	const catalog: Array<{ value: string; highlight: ClueHighlight }> = [
		...rooms.map((value) => ({
			value,
			highlight: { type: 'room' as const, value },
		})),
		...people.map((value) => ({
			value,
			highlight: { type: 'person' as const, value },
		})),
		...objects.map((value) => ({
			value,
			highlight: { type: 'object' as const, value },
		})),
		...KEYWORDS.map((value) => ({
			value,
			highlight: { type: 'keyword' as const, value },
		})),
	];

	const pattern = buildPattern(catalog.map((entry) => entry.value));
	if (!pattern) return [{ kind: 'text', value: clue }];

	const tokens: Token[] = [];
	let lastIndex = 0;
	for (const match of clue.matchAll(pattern)) {
		const raw = match[0];
		const index = match.index ?? 0;
		if (index > lastIndex) {
			tokens.push({ kind: 'text', value: clue.slice(lastIndex, index) });
		}
		const found =
			catalog.find(
				(entry) => entry.value.toLowerCase() === raw.toLowerCase()
			) ?? catalog[0];
		tokens.push({
			kind: 'mark',
			value: raw,
			highlight: {
				...found.highlight,
				value:
					found.highlight.type === 'keyword'
						? found.highlight.value
						: found.value,
			},
		});
		lastIndex = index + raw.length;
	}
	if (lastIndex < clue.length) {
		tokens.push({ kind: 'text', value: clue.slice(lastIndex) });
	}
	return glueTrailingPunctuation(tokens);
};

export const ClueText = ({
	clue,
	rooms = [],
	objects = [],
	people = [],
	activeHighlight = null,
	onHighlight,
	className,
}: ClueTextProps) => {
	const tokens = useMemo(
		() => tokenizeClue(clue, rooms, objects, people),
		[clue, rooms, objects, people]
	);

	return (
		<span className={className ?? 'suspect-text'}>
			{tokens.map((token, index) => {
				if (token.kind === 'text') {
					return <span key={index}>{token.value}</span>;
				}
				const isActive =
					activeHighlight?.type === token.highlight.type &&
					activeHighlight.value.toLowerCase() ===
						token.highlight.value.toLowerCase();
				return (
					<button
						key={index}
						type="button"
						className={`clue-keyword${isActive ? ' is-active' : ''}${
							token.trailing ? ' has-punct' : ''
						}`}
						data-type={token.highlight.type}
						onMouseEnter={() => onHighlight?.(token.highlight)}
						onMouseLeave={() => onHighlight?.(null)}
						onFocus={() => onHighlight?.(token.highlight)}
						onBlur={() => onHighlight?.(null)}
						onClick={(event) => {
							event.stopPropagation();
							onHighlight?.(isActive ? null : token.highlight);
						}}
					>
						<span className="clue-keyword-label">{token.value}</span>
						{token.trailing ? (
							<span className="clue-punct">{token.trailing}</span>
						) : null}
					</button>
				);
			})}
		</span>
	);
};
