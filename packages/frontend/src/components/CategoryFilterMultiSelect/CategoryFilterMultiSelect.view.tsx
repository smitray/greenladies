import React, { useMemo } from 'react';

import { chunkifyArray } from '../../utils/chunkify-array';
import { CategoryFilterBase } from '../CategoryFilterBase';
import { CategoryFilterColumnListItem, CategoryFilterColumns } from '../CategoryFilterColumns';

interface Props {
	open: boolean;
	onOpenRequest?: () => void;
	onCloseRequest?: () => void;
	title: string;
	selectedItemIds: string[];
	items: {
		id: string;
		node: React.ReactNode;
	}[];
	onItemSelected?: (itemId: string) => void;
	onItemUnselected?: (itemId: string) => void;
}

export const CategoryFilterMultiSelectView: React.FC<Props> = ({
	open,
	onOpenRequest,
	onCloseRequest,
	title,
	selectedItemIds,
	items,
	onItemSelected,
	onItemUnselected,
}) => {
	const itemChunks = useMemo(() => chunkifyArray(items), [items]);

	return (
		<CategoryFilterBase
			open={open}
			onOpenRequest={onOpenRequest}
			onCloseRequest={onCloseRequest}
			title={title}
			content={
				<CategoryFilterColumns
					onCloseRequest={onCloseRequest}
					columns={itemChunks.map((chunk, index) => (
						<React.Fragment key={index}>
							{chunk.map(item => {
								const selected = selectedItemIds.findIndex(itemId => itemId === item.id) !== -1;
								return (
									<CategoryFilterColumnListItem
										key={item.id}
										selected={selected}
										onClick={() => {
											if (selected && onItemUnselected) {
												onItemUnselected(item.id);
											}

											if (!selected && onItemSelected) {
												onItemSelected(item.id);
											}
										}}
									>
										{item.node}
									</CategoryFilterColumnListItem>
								);
							})}
						</React.Fragment>
					))}
				/>
			}
		/>
	);
};
