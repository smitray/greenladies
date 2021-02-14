function rateSize(size: string) {
	let score = NaN;
	if (size === 'OneSize') {
		score = 1000000;
	}

	let matches = size.match(/^\d+$/);
	if (matches) {
		score = parseInt(size, 10);
	}

	matches = size.match(/^W(\d+) L(\d+)$/);
	if (matches) {
		score = parseInt(matches[1], 10) * 100 + parseInt(matches[2], 10);
	}

	let numX = 0;
	matches = size.match(/^(\d+)X/);
	if (matches) {
		numX = parseInt(matches[1], 10);
	} else {
		numX = (size.match(/X/g) || []).length;
	}

	const sizeWithoutX = size.replace(/(X|\d)/g, '');
	if (sizeWithoutX.startsWith('S')) {
		score = -800 - numX + sizeWithoutX.length;
	} else if (sizeWithoutX.startsWith('M')) {
		score = -600 + sizeWithoutX.length;
	} else if (sizeWithoutX.startsWith('L')) {
		score = -400 + numX + sizeWithoutX.length;
	}

	return score;
}

export function sizeCompare(left: string, right: string) {
	return rateSize(left) - rateSize(right);
}
