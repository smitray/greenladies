export function apiLocation() {
	const PROTOCOL = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';
	return PROTOCOL + apiDomain();
}

export function apiDomain() {
	const DOMAIN = String(process.env.DOMAIN);
	return 'api.' + DOMAIN;
}
