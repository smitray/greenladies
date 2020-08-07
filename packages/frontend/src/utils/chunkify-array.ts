interface ChunkifyArrayOptions {
	maxChunks: number;
	maxPerChunk: number;
}

const defaultOptions: ChunkifyArrayOptions = {
	maxChunks: 3,
	maxPerChunk: 10,
};

export function chunkifyArray<T>(array: T[], options?: Partial<ChunkifyArrayOptions>) {
	const { maxChunks, maxPerChunk } = { ...defaultOptions, ...options };
	const neededChunks = Math.floor(Math.max(0, array.length - 1) / maxPerChunk) + 1;
	const chunks = Math.min(neededChunks, maxChunks);

	return [...Array(chunks).keys()].map(index => {
		return array.slice(Math.ceil((array.length / chunks) * index), Math.ceil((array.length / chunks) * (index + 1)));
	});
}
