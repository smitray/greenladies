export interface Empty {}

export interface Node {
	__typename?: string;
	id: string;
}

export interface Edge {
	node: Node;
	cursor: string;
}
