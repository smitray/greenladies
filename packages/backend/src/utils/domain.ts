export function apiLocation() {
	const PROTOCOL = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';
	const DOMAIN = String(process.env.DOMAIN);
	return PROTOCOL + 'api.' + DOMAIN;
}
