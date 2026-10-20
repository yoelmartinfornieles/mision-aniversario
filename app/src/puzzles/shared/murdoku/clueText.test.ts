import { describe, expect, it } from 'vitest';
import { glueTrailingPunctuation, tokenizeClue } from './clueText';

describe('glueTrailingPunctuation', () => {
	it('attaches commas and periods to the preceding mark', () => {
		const tokens = glueTrailingPunctuation([
			{ kind: 'text', value: 'del ' },
			{
				kind: 'mark',
				value: 'Muelle',
				highlight: { type: 'room', value: 'Muelle' },
			},
			{ kind: 'text', value: ', junto a un ' },
			{
				kind: 'mark',
				value: 'barco',
				highlight: { type: 'object', value: 'barco' },
			},
			{ kind: 'text', value: '.' },
		]);

		expect(tokens).toEqual([
			{ kind: 'text', value: 'del ' },
			{
				kind: 'mark',
				value: 'Muelle',
				highlight: { type: 'room', value: 'Muelle' },
				trailing: ',',
			},
			{ kind: 'text', value: ' junto a un ' },
			{
				kind: 'mark',
				value: 'barco',
				highlight: { type: 'object', value: 'barco' },
				trailing: '.',
			},
		]);
	});
});

describe('tokenizeClue', () => {
	it('keeps Unai-style punctuation glued to highlighted words', () => {
		const tokens = tokenizeClue(
			'Estaba en una ventana del Muelle, junto a un barco.',
			['Muelle'],
			['barco']
		);

		const marks = tokens.filter((token) => token.kind === 'mark');
		expect(marks).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ value: 'ventana' }),
				expect.objectContaining({ value: 'Muelle', trailing: ',' }),
				expect.objectContaining({ value: 'junto a un' }),
				expect.objectContaining({ value: 'barco', trailing: '.' }),
			])
		);

		const orphanPunct = tokens.filter(
			(token) =>
				token.kind === 'text' && /^[.,;:!?…]+$/.test(token.value.trim())
		);
		expect(orphanPunct).toEqual([]);
	});
});
