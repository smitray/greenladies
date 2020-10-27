import React, { useMemo } from 'react';

import { FaCheckSquare, FaRegSquare } from 'react-icons/fa';

import { chunkifyArray } from '../../../utils/chunkify-array';
import { FilterBase } from '../FilterBase';
import { FilterColumnListItem, FilterColumns } from '../FilterColumns';

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

export const FilterMultiSelectView: React.FC<Props> = ({
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
		<FilterBase
			open={open}
			onOpenRequest={onOpenRequest}
			onCloseRequest={onCloseRequest}
			title={title}
			content={
				<FilterColumns
					onCloseRequest={onCloseRequest}
					columns={itemChunks.map((chunk, index) => (
						<React.Fragment key={index}>
							{chunk.map(item => {
								const selected = selectedItemIds.findIndex(itemId => itemId === item.id) !== -1;
								return (
									<FilterColumnListItem
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
										<div style={{ display: 'flex', alignItems: 'center' }}>
											<div style={{ marginRight: '4px', height: '16px', width: '16px' }}>
												{selected ? <FaCheckSquare size="16" /> : <FaRegSquare size="16" />}
											</div>
											{item.node}
										</div>
									</FilterColumnListItem>
								);
							})}
						</React.Fragment>
					))}
				/>
			}
		/>
	);
};
