export function apiLocation() {
	const PROTOCOL = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';
	return PROTOCOL + apiDomain();
}

export function apiDomain() {
	return 'api.' + domain();
}

export function domain() {
	return String(process.env.DOMAIN);
}
