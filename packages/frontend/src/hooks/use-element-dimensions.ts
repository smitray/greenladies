import { useLayoutEffect, useState } from 'react';

export const useElementDimensions = (ref: React.RefObject<HTMLElement>) => {
	const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

	useLayoutEffect(() => {
		if (ref.current) {
			setDimensions(ref.current.getBoundingClientRect());
		}
	}, [ref]);

	return dimensions;
};
