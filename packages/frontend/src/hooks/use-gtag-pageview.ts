import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { pageView } from '../lib/google-tag';

export const useGtagPageview = () => {
	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = (url: string) => {
			pageView(url);
		};
		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);
};
