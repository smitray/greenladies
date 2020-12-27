export const GA_TRACKING_ID = process.env.NODE_ENV === 'production' ? 'UA-128342123-2' : '';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageView = (url: string) => {
	(window as any).gtag('config', GA_TRACKING_ID, {
		page_path: url,
	});
};
