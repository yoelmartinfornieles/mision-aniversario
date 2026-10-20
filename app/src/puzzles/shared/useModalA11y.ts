import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
	return Array.from(
		container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
	).filter(
		(el) =>
			!el.hasAttribute('disabled') &&
			el.getAttribute('aria-hidden') !== 'true' &&
			el.tabIndex !== -1 &&
			el.offsetParent !== null,
	);
}

export type UseModalA11yOptions = {
	/** When false, listeners are inactive and focus is not moved. Defaults to true. */
	open?: boolean;
	/** Escape invokes this when provided. */
	onClose?: () => void;
	/**
	 * Element to restore focus to on close. If omitted, the element that was
	 * focused when the dialog opened is restored (document.body as fallback).
	 */
	returnFocusTo?: HTMLElement | null;
};

export type UseModalA11yResult = {
	containerRef: RefObject<HTMLDivElement | null>;
};

/**
 * Dialog a11y: Escape to close, Tab focus trap, initial focus into the dialog,
 * and restore focus to the opener (or `returnFocusTo`) when the dialog closes.
 */
export function useModalA11y({
	open = true,
	onClose,
	returnFocusTo,
}: UseModalA11yOptions = {}): UseModalA11yResult {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const previouslyFocusedRef = useRef<HTMLElement | null>(null);
	const onCloseRef = useRef(onClose);

	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		if (!open) return;

		const container = containerRef.current;
		if (!container) return;

		previouslyFocusedRef.current =
			returnFocusTo ??
			(document.activeElement instanceof HTMLElement
				? document.activeElement
				: null);

		const focusables = getFocusableElements(container);
		const initial = focusables[0] ?? container;
		if (initial === container && !container.hasAttribute('tabindex')) {
			container.tabIndex = -1;
		}
		initial.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				if (!onCloseRef.current) return;
				event.preventDefault();
				event.stopPropagation();
				onCloseRef.current();
				return;
			}

			if (event.key !== 'Tab') return;

			const nodes = getFocusableElements(container);
			if (nodes.length === 0) {
				event.preventDefault();
				container.focus();
				return;
			}

			const first = nodes[0];
			const last = nodes[nodes.length - 1];
			const active = document.activeElement;

			if (event.shiftKey) {
				if (active === first || !container.contains(active)) {
					event.preventDefault();
					last.focus();
				}
			} else if (active === last || !container.contains(active)) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('keydown', onKeyDown);
			const restore =
				returnFocusTo ??
				previouslyFocusedRef.current ??
				(document.body as HTMLElement);
			if (typeof restore.focus === 'function') {
				restore.focus();
			}
		};
	}, [open, returnFocusTo]);

	return { containerRef };
}
