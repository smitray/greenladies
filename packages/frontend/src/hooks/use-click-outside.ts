import { RefObject, useEffect } from 'react';

export const useClickOutside = (ref: RefObject<HTMLElement>, onClickOutside: () => void) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !(ref.current as any).contains(event.target)) {
				onClickOutside();
			}
		};
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref, onClickOutside]);
};
