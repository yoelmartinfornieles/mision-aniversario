import {
	useEffect,
	useRef,
	useState,
	type MutableRefObject,
} from 'react';

const URGENT_SECONDS = 5 * 60;
const CRITICAL_SECONDS = 60;

export const formatElapsedLabel = (totalSeconds: number): string => {
	const safe = Math.max(0, Math.floor(totalSeconds));
	const minutes = Math.floor(safe / 60)
		.toString()
		.padStart(2, '0');
	const seconds = (safe % 60).toString().padStart(2, '0');
	return `${minutes}:${seconds}`;
};

const splitElapsed = (totalSeconds: number) => {
	const safe = Math.max(0, Math.floor(totalSeconds));
	return {
		minutes: Math.floor(safe / 60)
			.toString()
			.padStart(2, '0'),
		seconds: (safe % 60).toString().padStart(2, '0'),
	};
};

export type PuzzleClockProps = {
	mode?: 'elapsed' | 'countdown';
	/** When false, the display freezes at the current ref value. */
	running: boolean;
	initialSeconds: number;
	/**
	 * Bump after extend / reset / replay so the clock resyncs without
	 * lifting tick state into the puzzle tree.
	 */
	session: number;
	/** Always holds the latest seconds for draft persistence. */
	secondsRef: MutableRefObject<number>;
	onExpire?: () => void;
	className?: string;
	expired?: boolean;
};

/**
 * Self-contained timer UI. Ticks locally so the puzzle board does not
 * re-render every second.
 */
export const PuzzleClock = ({
	mode = 'elapsed',
	running,
	initialSeconds,
	session,
	secondsRef,
	onExpire,
	className = 'timer',
	expired = false,
}: PuzzleClockProps) => {
	const [seconds, setSeconds] = useState(initialSeconds);
	const didExpireRef = useRef(false);
	const onExpireRef = useRef(onExpire);
	onExpireRef.current = onExpire;

	useEffect(() => {
		didExpireRef.current = false;
		secondsRef.current = initialSeconds;
		setSeconds(initialSeconds);
	}, [session, initialSeconds, secondsRef]);

	useEffect(() => {
		if (!running) return;

		const id = window.setInterval(() => {
			if (mode === 'countdown') {
				setSeconds((current) => {
					if (current <= 0) return 0;
					const next = current - 1;
					secondsRef.current = next;
					return next;
				});
				return;
			}

			setSeconds((current) => {
				const next = current + 1;
				secondsRef.current = next;
				return next;
			});
		}, 1000);

		return () => window.clearInterval(id);
	}, [running, mode, session, secondsRef]);

	useEffect(() => {
		if (mode !== 'countdown' || !running || expired) return;
		if (seconds !== 0 || didExpireRef.current) return;
		didExpireRef.current = true;
		onExpireRef.current?.();
	}, [mode, running, expired, seconds]);

	const label = formatElapsedLabel(seconds);
	const parts = splitElapsed(seconds);
	const isUrgent =
		mode === 'countdown' && seconds > 0 && seconds <= URGENT_SECONDS;
	const isCritical =
		mode === 'countdown' && seconds > 0 && seconds <= CRITICAL_SECONDS;

	const resolvedClassName = [
		className,
		mode === 'countdown' ? 'countdown' : '',
		isUrgent ? 'is-urgent' : '',
		isCritical ? 'is-critical' : '',
		expired ? 'is-expired' : '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div
			className={resolvedClassName}
			aria-label={
				mode === 'countdown'
					? `Tiempo restante: ${label}`
					: `Tiempo: ${label}`
			}
			aria-live={isCritical ? 'assertive' : 'off'}
		>
			{mode === 'countdown' ? (
				<>
					<span className="timer-tag" aria-hidden="true">
						T−
					</span>
					<span className="timer-readout" aria-hidden="true">
						<span className="timer-mm">{parts.minutes}</span>
						<span className="timer-colon">:</span>
						<span className="timer-ss">{parts.seconds}</span>
					</span>
				</>
			) : (
				label
			)}
		</div>
	);
};
