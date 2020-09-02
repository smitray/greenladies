import { useLayoutEffect, useState } from 'react';

import { useWindowDimensions } from './use-window-dimensions';

export const useElementDimensions = (ref: React.RefObject<HTMLElement>) => {
	const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
	const { width: windowWidth, height: windowHeight } = useWindowDimensions();

	useLayoutEffect(() => {
		if (ref.current) {
			setDimensions(ref.current.getBoundingClientRect());
		}
	}, [ref, windowWidth, windowHeight]);

	return dimensions;
};
