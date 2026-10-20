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
				kicker="Último dossier · demasiados sospechosos"
				alreadyDone={game.alreadyDone}
				saveCode={game.saveCode}
				startLabel="Entrar al parque"
				onStart={game.begin}
			>
				Cuatro dossiers cerrados. Pero sorpresa, el archivo escupe uno
				más, escondido como una rata al fondo del cajón. Dice que Arroa
				está lleno de gente maja. Parece que demasiado maja. Ocho
				sospechosos: Yoel, Carla, Kai, Luar, Haizea, Saioa, Unai y
				George. Todos pringados hasta las cejas en tu regalo. Uno de
				ellos lo eligió. Los demás callaron como perros sarnosos. El
				escenario: un parque de atracciones, con sus luces, sus farolas
				y sus señuelos. Reconstruye la escena. Carla va la última, para
				recibir el presente. El reloj corre. ¿Quién eligió el regalo?
			</PuzzleIntroCard>
		);
	}

	return (
		<MurdokuScreen
			game={game}
			brand="El complot del regalo"
			caseName="¿Quién eligió el regalo? · 8×8"
			boardRule="1 por fila y columna · carrusel y carro de chuches se ocupan · el reloj no perdona"
			furnitureObjects={FURNITURE_OBJECT_NAMES}
			gridClassName="board-grid board-grid--8"
			shellClassName="murdoku-shell murdoku-shell--park"
			legendAriaLabel="Zonas"
			suspectTitle="Implicados"
			suspectHint="Clic para elegir · toca una palabra de la pista para resaltarla · Carla al final"
			countdown
			saveCodeTitle="Fue Yoel"
			saveCodeSubtitle="Casi. Queda un último candado antes de acceder a la sentencia."
			saveCodeContinueLabel="Última pregunta"
			onSaveCodeContinue={goToFinale}
		/>
	);
};
