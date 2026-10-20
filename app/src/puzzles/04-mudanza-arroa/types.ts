export type TileFaceId =
	| 'boxes'
	| 'keys'
	| 'home'
	| 'path'
	| 'table'
	| 'coffee'
	| 'nest'
	| 'kai'
	| 'friends'
	| 'toast'
	| 'neighbors'
	| 'mountain'
	| 'fog'
	| 'sea'
	| 'bow'
	| 'heart';

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
