import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { pageView } from '../lib/facebook-pixel';

// From https://github.com/vercel/next.js/blob/dc4beade676b6c0310320c1a15de9213105c13cb/examples/with-facebook-pixel/components/FacebookPixel.js
const handleRouteChange = () => {
	pageView();
};

export const usePixelPageview = () => {
	const router = useRouter();

	useEffect(() => {
		// This pageview only trigger first time (it is important for Pixel to have real information)
		pageView();

		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);
};
