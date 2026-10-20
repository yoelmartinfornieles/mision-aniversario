export type TileFaceId =
	| 'monte'
	| 'mar'
	| 'hogar'
	| 'camino'
	| 'lluvia'
	| 'sol'
	| 'coche'
	| 'rio'
	| 'puente'
	| 'cambios'
	| 'euskera'
	| 'amigos'
	| 'miedos'
	| 'roble'
	| 'ola'
	| 'familia';

export type GridPos = {
	x: number;
	y: number;
	z: number;
};

export type TileFace = {
	id: TileFaceId;
	label: string;
	tone: string;
};

export type MahjongTile = GridPos & {
	uid: string;
	faceId: TileFaceId;
};

export type MatchPair = [string, string];
