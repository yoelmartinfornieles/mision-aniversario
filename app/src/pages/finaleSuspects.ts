/** Desk pile for the finale: every dossier individual, pairs already split. */

const finaleAsset = (file: string) =>
	`${import.meta.env.BASE_URL}finale/${file}`;

export type SuspectPinColor = 'ruby' | 'brass' | 'navy' | 'forest';

export type FinaleSuspect = {
	id: string;
	name: string;
	src: string;
	alt: string;
	x: number;
	y: number;
	r: number;
	mx: number;
	my: number;
	z: number;
	pin: SuspectPinColor;
	featured?: boolean;
};

type SuspectOpts = {
	featured?: boolean;
	alt?: string;
};

const s = (
	id: string,
	name: string,
	file: string,
	x: number,
	y: number,
	r: number,
	mx: number,
	my: number,
	z: number,
	pin: SuspectPinColor,
	opts: SuspectOpts = {}
): FinaleSuspect => ({
	id,
	name,
	src: finaleAsset(file),
	alt: opts.alt ?? name,
	x,
	y,
	r,
	mx,
	my,
	z,
	pin,
	...(opts.featured ? { featured: true } : {}),
});

/** Featured always; fill the rest with a random sample (stable for the visit). */
export const pickDeskSuspects = (
	all: FinaleSuspect[],
	max: number,
	random: () => number = Math.random
): FinaleSuspect[] => {
	if (all.length <= max) return all;
	const featured = all.filter((suspect) => suspect.featured);
	const rest = all.filter((suspect) => !suspect.featured);
	const slots = Math.max(0, max - featured.length);
	if (slots === 0) return featured.slice(0, max);

	const pool = [...rest];
	for (let i = pool.length - 1; i > 0; i -= 1) {
		const j = Math.floor(random() * (i + 1));
		const current = pool[i]!;
		pool[i] = pool[j]!;
		pool[j] = current;
	}

	return [...featured, ...pool.slice(0, slots)];
};

export const FINALE_SUSPECTS: FinaleSuspect[] = [
	s('kai', 'Kai', 'kai-moto.webp', 44.5, 6.3, 2.1, 50.0, 4, 30, 'ruby', { featured: true, alt: 'Kai en su moto Vespa roja' }),
	s('carla', 'Carla', 'carla-sospechosa.webp', 4.9, 5.1, -9.4, 4.8, 5.6, 10, 'brass'),
	s('haizea', 'Haizea', 'haizea-sospechosa.webp', 92.2, 6.0, 9.4, 93.4, 4.4, 17, 'navy'),
	s('luar', 'Luar', 'luar-sospechoso.webp', 4.4, 95.0, 0.3, 5.2, 95.2, 9, 'forest'),
	s('inma', 'Inma', 'inma-sospechosa.webp', 92.6, 94.1, -2.0, 93.4, 94.4, 16, 'brass'),
	s('peque', 'La Peque', 'peque-sospechosa.webp', 55.5, 93.7, 6.0, 50.0, 96, 8, 'navy'),
	s('presi', 'Presi', 'presi-sospechoso.webp', 4, 50.0, 1.3, 5.0, 50.0, 15, 'navy'),
	s('capi', 'El Capi', 'capi-sospechoso.webp', 96, 50.0, -0.2, 95.0, 50.0, 7, 'forest'),
	s('emilio', 'Emilio', 'emilio-sospechoso.webp', 22.0, 5.9, 3.8, 20.9, 5.7, 14, 'ruby'),
	s('rafa', 'Rafa', 'rafa-sospechoso.webp', 76.4, 5.5, -8.7, 76.6, 5.6, 6, 'brass'),
	s('berta', 'Berta', 'berta-sospechosa.webp', 21.1, 94.1, 0.8, 21.0, 94.5, 13, 'brass'),
	s('abupepe', 'AbuPepe', 'abupepe-sospechoso.webp', 76.4, 94.5, -1.7, 77.7, 94.5, 5, 'forest'),
	s('eloy', 'Eloy', 'eloy-sospechoso.webp', 71.6, 63.4, 9.1, 77.6, 32.9, 12, 'navy'),
	s('isa', 'Isa', 'isa-sospechosa.webp', 28.4, 36.6, 8.5, 22.4, 67.1, 4, 'ruby'),
	s('juani', 'Juani', 'juani-sospechoso.webp', 28.3, 63.3, -4.6, 11.0, 27.0, 11, 'ruby'),
	s('luca', 'Luca', 'luca-sospechoso.webp', 71.7, 36.7, -0.5, 89.0, 73.0, 3, 'brass'),
	s('saioa', 'Saioa', 'saioa-sospechosa.webp', 5.5, 26.9, -7.5, 51.1, 75.0, 10, 'brass'),
	s('unai', 'Unai', 'unai-sospechoso.webp', 94.0, 71.3, -1.3, 48.9, 25.0, 17, 'forest'),
	s('yoel', 'Yoel', 'yoel-sospechoso.webp', 18.8, 37.4, 6.3, 6.5, 38.1, 28, 'navy', { featured: true }),
	s('george', 'George', 'george-sospechoso.webp', 9.3, 70.4, 8.0, 95.3, 25.4, 16, 'ruby', { alt: 'George el gato' }),
	s('maria', 'Maria', 'maria-sospechosa.webp', 90.7, 29.6, -0.5, 5.9, 71.0, 8, 'navy'),
	s('charly', 'Charly', 'charly-sospechoso.webp', 45.0, 26.4, -3.7, 33.9, 20.6, 15, 'ruby'),
	s('lourdes', 'Lourdes', 'lourdes-sospechosa.webp', 55.0, 73.6, -6.2, 66.1, 79.4, 7, 'brass'),
	s('david', 'David', 'david-sospechoso.webp', 38.0, 89.0, 2.4, 62.9, 18.9, 14, 'forest'),
	s('raquel', 'Raquel', 'raquel-sospechosa.webp', 61.6, 11.5, 8.5, 37.1, 81.1, 6, 'navy'),
	s('jesus', 'Jesús', 'jesus-sospechoso.webp', 16.5, 55.3, -7.4, 81.8, 53.4, 13, 'ruby'),
	s('jose', 'Jose', 'jose-sospechoso.webp', 83.5, 44.7, 5.6, 18.2, 46.6, 5, 'brass'),
	s('ramon', 'Ramon', 'ramon-sospechoso.webp', 31.0, 23.5, -9.5, 81.8, 17.5, 12, 'navy'),
	s('isabel', 'Isabel', 'isabel-sospechosa.webp', 69.0, 76.5, -6.1, 18.2, 82.5, 4, 'forest'),
	s('paco', 'Paco', 'paco-sospechoso.webp', 32.3, 77.3, -5.5, 93.5, 38.1, 11, 'ruby'),
	s('asun', 'Asun', 'asun-sospechosa.webp', 67.7, 22.7, 3.7, 93.5, 61.9, 3, 'brass'),
	s('luis', 'Luis', 'luis-sospechoso.webp', 84.4, 79.2, -3.6, 81.8, 82.5, 10, 'navy'),
	s('tania', 'Tania', 'tania-sospechosa.webp', 11.4, 16.3, -2.9, 18.2, 17.5, 17, 'forest'),
	s('luis2', 'Luis T.', 'luis2-sospechoso.webp', 88.8, 17.6, 2.4, 61.6, 94.4, 9, 'ruby', { alt: 'Luis' }),
	s('ezequiel', 'Ezequiel', 'ezequiel-sospechoso.webp', 33.7, 8.9, -7.9, 38.4, 94.4, 16, 'brass'),
	s('gorka', 'Gorka', 'gorka-sospechoso.webp', 5.0, 80.5, 4.6, 38.4, 5.6, 8, 'navy'),
	s('jaime', 'Jaime', 'jaime-sospechoso.webp', 15.6, 79.2, -7.5, 61.6, 5.6, 15, 'forest'),
	s('ana', 'Ana', 'ana-sospechosa.webp', 66.3, 91.1, 0.2, 11.3, 61.3, 7, 'ruby'),
	s('montse', 'Montse', 'montse-sospechosa.webp', 5.3, 60.5, -5.0, 5.8, 16.2, 14, 'brass'),
	s('manel', 'Manel', 'manel-sospechoso.webp', 5.3, 39.5, -6.0, 79.3, 63.7, 6, 'navy'),
	s('el-medina', 'El Medina', 'el-medina-sospechoso.webp', 94.7, 60.5, 0.6, 20.7, 36.3, 13, 'forest'),
	s('toval', 'Toval', 'toval-sospechoso.webp', 94.7, 39.5, -1.3, 81.3, 42.8, 5, 'ruby'),
	s('kira', 'Kira', 'kira-sospechosa.webp', 44.8, 73.5, -2.5, 95.7, 80.8, 12, 'brass'),
	s('mirari', 'Mirari', 'mirari-sospechosa.webp', 55.2, 26.5, -1.7, 71.3, 24.6, 4, 'navy'),
	s('edu', 'Edu', 'edu-sospechoso.webp', 12.2, 88.6, 0.6, 28.7, 75.4, 11, 'forest'),
	s('trufe', 'Trufe', 'trufe-sospechoso.webp', 81.2, 62.6, -6.8, 56.8, 83.2, 3, 'ruby'),
	s('amaia', 'Amaia', 'amaia-sospechosa.webp', 95.5, 80.8, -5.9, 43.2, 16.8, 10, 'brass'),
	s('axi', 'Axi', 'axi-sospechoso.webp', 75.5, 54.8, 2.6, 53.2, 16.2, 17, 'navy'),
	s('ander', 'Ander', 'ander-sospechoso.webp', 24.5, 45.2, 2.8, 46.8, 83.8, 9, 'forest'),
	s('ekain', 'Ekain', 'ekain-sospechoso.webp', 50.8, 82.0, 0.6, 29.2, 12.8, 16, 'ruby'),
	s('unax', 'Unax', 'unax-sospechoso.webp', 49.2, 18.0, 7.0, 5.3, 80.0, 8, 'brass'),
	s('haitz', 'Haitz', 'haitz-sospechoso.webp', 28.9, 88.7, 2.2, 68.1, 11.1, 15, 'navy'),
	s('asha', 'Asha', 'asha-sospechosa.webp', 19.4, 64.0, 7.1, 69.7, 87.1, 7, 'forest'),
	s('shabat', 'Shabat', 'shabat-sospechoso.webp', 80.6, 36.0, -5.3, 18.7, 57.2, 14, 'ruby'),
	s('kenneth', 'Kenneth', 'kenneth-sospechoso.webp', 24.8, 71.5, 4.8, 27.5, 89.8, 6, 'brass'),
	s('uxe', 'Uxe', 'uxe-sospechoso.webp', 75.2, 28.5, 6.2, 85.6, 95.9, 13, 'navy'),
	s('riki', 'Riki', 'riki-sospechoso.webp', 60.3, 80.5, 8.1, 84.3, 4.1, 5, 'forest'),
	s('mai', 'Mai', 'mai-sospechosa.webp', 39.7, 19.5, -3.7, 69.4, 95.1, 12, 'ruby'),
	s('txolo', 'El Txolo', 'txolo-sospechoso.webp', 42.5, 48.5, -4.2, 72.4, 58.2, 11, 'navy'),
];
