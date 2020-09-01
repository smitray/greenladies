export function setIntersection(first: Set<string>, second: Set<string>) {
	return new Set([...first].filter(x => second.has(x)));
}

export function setIntersections(sets: Set<string>[]) {
	const sortedSets = sets.sort((left, right) => left.size - right.size);
	const [firstSet, ...restOfSets] = sortedSets;

	return restOfSets.reduce((prev, current) => {
		return setIntersection(prev, current);
	}, firstSet);
}
