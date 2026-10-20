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
				kicker="El bar donde nos conocimos"
				alreadyDone={game.alreadyDone}
				saveCode={game.saveCode}
				startLabel="Abrir el caso"
				onStart={() => game.setStarted(true)}
			>
				La noche olía a sal y a cerveza barata. Un local estrecho en la
				Barceloneta, luces bajas, el ruido de fondo como una confesión a
				medias. Tú entraste con aquel vestido y las Martens granates; nadie
				—ni siquiera tú— podía imaginar lo que iba a seguir. Reconstruye la
				escena pieza a pieza. Una sola pregunta quema en el expediente:
				¿quién hablaba con la chica de pelo negro?
			</PuzzleIntroCard>
		);
	}

	return (
		<MurdokuScreen
			game={game}
			brand="Cuando todo comenzó..."
			caseName="El bar del Basko · 9×9"
			boardRule="1 por fila y columna · taburete/sofá/silla se ocupan · tacha lo imposible"
			furnitureObjects={FURNITURE_OBJECT_NAMES}
		/>
	);
};
