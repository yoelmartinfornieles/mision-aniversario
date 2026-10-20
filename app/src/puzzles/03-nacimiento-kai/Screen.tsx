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
				kicker="Hondarribia · el mar demasiado azul"
				alreadyDone={game.alreadyDone}
				saveCode={game.saveCode}
				startLabel="Entrar en la casa"
				onStart={() => game.setStarted(true)}
			>
				Hondarribia. El mar, demasiado azul para un caso así. Kai acababa
				de llegar y la casa era un hormiguero: visitas en el salón,
				ruido en la cocina, voces al teléfono desde Argentina. Nadie lo
				perdió de vista. Nadie supo decir dónde estaba. Reconstruye la
				escena. Una pregunta, un pequeño y demasiados testigos: ¿dónde
				estaba Kai?
			</PuzzleIntroCard>
		);
	}

	return (
		<MurdokuScreen
			game={game}
			brand="Nacimiento de Kai"
			caseName="Hondarribia · casa · 10×10"
			boardRule="1 por fila y columna · sofá, banco y alfombra se ocupan · tacha lo imposible"
			furnitureObjects={FURNITURE_OBJECT_NAMES}
			gridClassName="board-grid board-grid--10"
		/>
	);
};
