import { ClueText, type ClueHighlight } from './clueText';
import { Portrait } from './Portrait';
import type { MurdokuSuspect } from './types';

type SuspectPanelProps = {
	suspects: MurdokuSuspect[];
	selectedSuspectId: number | null;
	placedSuspectIds: number[];
	victimId: number;
	otherSuspectsPlacedCount: number;
	preVictimError: string | null;
	status: string;
	rooms: string[];
	objects: string[];
	title?: string;
	hint?: string;
	disabled?: boolean;
	activeHighlight: ClueHighlight | null;
	onHighlight: (highlight: ClueHighlight | null) => void;
	onSelect: (suspectId: number) => void;
};

export const SuspectPanel = ({
	suspects,
	selectedSuspectId,
	placedSuspectIds,
	victimId,
	otherSuspectsPlacedCount,
	preVictimError,
	status,
	rooms,
	objects,
	title = 'Personajes',
	hint = 'Clic para elegir · toca una palabra de la pista para resaltarla en el mapa',
	disabled = false,
	activeHighlight,
	onHighlight,
	onSelect,
}: SuspectPanelProps) => {
	const people = suspects.map((suspect) => suspect.name);

	return (
		<section className="suspect-panel">
			<h2>{title}</h2>
			<p className="helper-text" aria-live="polite">
				{status}
			</p>
			<p className="suspect-hint">{hint}</p>
			<div className="suspect-grid">
				{suspects.map((suspect) => {
					const isPlaced = placedSuspectIds.includes(suspect.id);
					const isWaitingVictim =
						suspect.id === victimId &&
						(otherSuspectsPlacedCount < suspects.length - 1 ||
							preVictimError !== null);

					return (
						<article
							key={suspect.id}
							className={`suspect-card${selectedSuspectId === suspect.id ? ' selected' : ''}${suspect.isVictim ? ' victim' : ''}`}
							data-gender={suspect.gender}
							data-placed={isPlaced}
						>
							<button
								type="button"
								className="suspect-select"
								onClick={() => onSelect(suspect.id)}
								aria-pressed={selectedSuspectId === suspect.id}
								aria-label={`Seleccionar ${suspect.name}${isPlaced ? ', ya colocada' : ''}${isWaitingVictim ? ', al final' : ''}`}
								disabled={disabled || isWaitingVictim}
							>
								<Portrait
									gender={suspect.gender}
									isVictim={suspect.isVictim}
									src={suspect.portraitSrc}
									alt={suspect.name}
								/>
								<span className="suspect-name">{suspect.name}</span>
							</button>
							<div className="suspect-clue-wrap">
								<ClueText
									clue={suspect.clue}
									rooms={rooms}
									objects={objects}
									people={people}
									activeHighlight={activeHighlight}
									onHighlight={onHighlight}
								/>
								{isPlaced && (
									<span className="placed-mark">En el tablero</span>
								)}
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
};
