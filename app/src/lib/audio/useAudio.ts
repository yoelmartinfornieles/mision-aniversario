import { useEffect, useState } from 'react';
import { audio } from './AudioDirector';

export const useAudioMuted = (): boolean => {
	const [muted, setMuted] = useState(() => audio.isMuted());

	useEffect(() => audio.subscribe(() => setMuted(audio.isMuted())), []);

	return muted;
};
