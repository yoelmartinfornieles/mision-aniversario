import { audio } from './AudioDirector';
import { useAudioMuted } from './useAudio';

type SoundToggleProps = {
	className?: string;
};

export const SoundToggle = ({ className = '' }: SoundToggleProps) => {
	const muted = useAudioMuted();

	return (
		<button
			type="button"
			className={`sound-toggle${muted ? ' is-muted' : ''}${className ? ` ${className}` : ''}`}
			aria-pressed={!muted}
			aria-label={muted ? 'Activar sonido' : 'Silenciar'}
			title={muted ? 'Activar sonido' : 'Silenciar'}
			onClick={() => {
				audio.toggleMuted();
				if (!audio.isMuted()) audio.play('ui');
			}}
		>
			<span className="sound-toggle-icon" aria-hidden="true">
				{muted ? (
					<svg viewBox="0 0 24 24" width="18" height="18">
						<path
							fill="currentColor"
							d="M16.5 12a4.5 4.5 0 0 0-1.5-3.3v1.9l1.5 1.5V12zm2.5 0c0 .9-.2 1.7-.5 2.5l1.2 1.2A7.9 7.9 0 0 0 21 12a8 8 0 0 0-3.3-6.5l-1.1 1.1A6.5 6.5 0 0 1 19 12zM4.3 3 3 4.3 7.7 9H4v6h3l5 5v-6.7l4.7 4.7c-.7.5-1.5.9-2.4 1.1v2.1a9 9 0 0 0 3.8-1.6L19.7 21 21 19.7 4.3 3zM12 4 9.9 6.1 12 8.2V4z"
						/>
					</svg>
				) : (
					<svg viewBox="0 0 24 24" width="18" height="18">
						<path
							fill="currentColor"
							d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8.7v6.6A4.5 4.5 0 0 0 16.5 12zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1A9 9 0 0 0 14 3.2z"
						/>
					</svg>
				)}
			</span>
			<span className="sound-toggle-label">{muted ? 'Silencio' : 'Sonido'}</span>
		</button>
	);
};
