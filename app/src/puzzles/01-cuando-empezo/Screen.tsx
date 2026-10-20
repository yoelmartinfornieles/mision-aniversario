import { PuzzleIntroCard } from '@/puzzles/shared/PuzzleIntroCard';
import { MurdokuScreen } from '@/puzzles/shared/murdoku';
import { FURNITURE_OBJECT_NAMES } from './data';
import { usePuzzle01 } from './usePuzzle01';

export const Puzzle01Screen = () => {
	const game = usePuzzle01();

	if (!game.started) {
		return (
			<PuzzleIntroCard
				label="Archivo clasificado · 01 · Murdoku 9×9"
				title="Cuando todo comenzó"
				kicker="Barceloneta · El bar del Basko · luces bajas"
				alreadyDone={game.alreadyDone}
				saveCode={game.saveCode}
				startLabel="Abrir el caso"
				onStart={() => game.setStarted(true)}
			>
				La noche olía a vino rancio y tabaco de liar mojado. Un local estrecho en la
				Barceloneta. Luz tenue. El ruido de fondo como un secreto a
				voces. Tú entraste con aquel vestido granate y las Martens a
				juego.
				Nadie, ni siquiera tú, sabía que esa noche iba a abrir un
				expediente de nueve años. Reconstruye la escena. Una
				pregunta quema en el archivo: ¿quién hablaba con la
				despampanante argentina?
			</PuzzleIntroCard>
		);
	}

	return (
		<MurdokuScreen
			game={game}
			brand="Cuando todo comenzó..."
			caseName="El bar del Basko · 9×9"
			boardRule="1 por fila y columna · taburete, sofá, silla y alfombra se ocupan · tacha lo imposible"
			furnitureObjects={FURNITURE_OBJECT_NAMES}
		/>
	);
};
