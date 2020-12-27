// export const FB_PIXEL_ID = process.env.NODE_ENV === 'production' ? '2717399138495684' : '';
export const FB_PIXEL_ID = '451305489206609';

export const pageView = () => {
	if (typeof window !== 'undefined') {
		(window as any).fbq('track', 'PageView');
	}
};
