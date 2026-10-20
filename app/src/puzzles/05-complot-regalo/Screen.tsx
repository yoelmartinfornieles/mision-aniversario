import { goToFinale } from '@/lib/navigation';
import { PuzzleIntroCard } from '@/puzzles/shared/PuzzleIntroCard';
import { MurdokuScreen } from '@/puzzles/shared/murdoku';
import { FURNITURE_OBJECT_NAMES } from './data';
import { usePuzzle05 } from './usePuzzle05';

export const Puzzle05Screen = () => {
	const game = usePuzzle05();

	if (!game.started) {
		return (
			<PuzzleIntroCard
				label="Archivo clasificado · 05 · Murdoku 8×8"
				title="El complot del regalo"
				kicker="¿Quién ha elegido el regalo de aniversario?"
				alreadyDone={game.alreadyDone}
				saveCode={game.saveCode}
				startLabel="Entrar al parque"
				onStart={game.begin}
			>
				Cuatro pruebas cerradas… y el archivo escupe un último dossier. En
				Arroa hay gente maja. Demasiado maja. Sospechosamente maja. Yoel,
				Carla, Kai, Luar, Haizea, Saioa, Unai y hasta George: todos pringados
				hasta las cejas en tu regalo. Alguien eligió. Alguien dejó caer la
				espada de Damocles justo donde debía. El escenario es un parque de
				atracciones —avenida, selva, castillo, cuentos, plaza, espacio,
				muelle—. La banqueta de la plaza se puede ocupar. Reconstruye la
				escena pieza a pieza: una persona por fila y columna; Carla al final,
				a solas con quien eligió el regalo. El temporizador corre. La tensión
				sube.
			</PuzzleIntroCard>
		);
	}

	return (
		<MurdokuScreen
			game={game}
			brand="El complot del regalo"
			caseName="¿Quién eligió el regalo? · 8×8"
			boardRule="1 por fila y columna · banqueta se ocupa · el reloj no perdona"
			furnitureObjects={FURNITURE_OBJECT_NAMES}
			gridClassName="board-grid board-grid--8"
			shellClassName="murdoku-shell murdoku-shell--park"
			legendAriaLabel="Zonas"
			suspectTitle="Implicados"
			suspectHint="Clic para elegir · toca una palabra de la pista para resaltarla · Carla al final"
			countdown
			saveCodeTitle="¡Fue Kai!"
			saveCodeSubtitle="Casi. Queda una última pregunta antes de dictar sentencia."
			saveCodeContinueLabel="Última pregunta"
			onSaveCodeContinue={goToFinale}
		/>
	);
};
