import { PuzzleIntroCard } from '@/puzzles/shared/PuzzleIntroCard';
import { MurdokuScreen } from '@/puzzles/shared/murdoku';
import { FURNITURE_OBJECT_NAMES } from './data';
import { usePuzzle03 } from './usePuzzle03';

export const Puzzle03Screen = () => {
	const game = usePuzzle03();

	if (!game.started) {
		return (
			<PuzzleIntroCard
				label="Archivo clasificado · 03 · Murdoku 10×10"
				title="Nacimiento de Kai"
				kicker="La casa de Hondarribia"
				alreadyDone={game.alreadyDone}
				saveCode={game.saveCode}
				startLabel="Entrar en la casa"
				onStart={() => game.setStarted(true)}
			>
				Hondarribia. El mar demasiado azul para un caso así. Fuimos a traer a
				Kai al mundo; días que brillaban… y una casa que, a ratos, se llenaba
				de más sospechosos de los que cabían en el plano: unos en el salón,
				otros colgados desde Argentina. El piso que encontraste era perfecto.
				Demasiado perfecto. Ahora reconstruye la escena pieza a
				pieza. La pregunta del expediente: ¿quién cuidaba a Kai aquel
				día?
			</PuzzleIntroCard>
		);
	}

	return (
		<MurdokuScreen
			game={game}
			brand="Nacimiento de Kai"
			caseName="Hondarribia · casa · 10×10"
			boardRule="1 por fila y columna · sofá/hamaca se ocupan · tacha lo imposible"
			furnitureObjects={FURNITURE_OBJECT_NAMES}
			gridClassName="board-grid board-grid--10"
		/>
	);
};
