import React, { useMemo } from 'react';

import { chunkifyArray } from '../../utils/chunkify-array';
import { CategoryFilterBase } from '../CategoryFilterBase';
import { CategoryFilterColumnListItem, CategoryFilterColumns } from '../CategoryFilterColumns';

interface Props {
	open: boolean;
	onOpenRequest?: () => void;
	onCloseRequest?: () => void;
	title: string;
	selectedItemId: string;
	items: {
		id: string;
		node: React.ReactNode;
	}[];
	onItemSelected?: (itemId: string) => void;
}

export const CategoryFilterSingleSelectView: React.FC<Props> = ({
	open,
	onOpenRequest,
	onCloseRequest,
	title,
	selectedItemId,
	items,
	onItemSelected,
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
							{chunk.map(item => (
								<CategoryFilterColumnListItem
									key={item.id}
									selected={item.id === selectedItemId}
									onClick={() => {
										if (onItemSelected) {
											onItemSelected(item.id);
										}

										if (onCloseRequest) {
											onCloseRequest();
										}
									}}
								>
									{item.node}
								</CategoryFilterColumnListItem>
							))}
						</React.Fragment>
					))}
				/>
			}
		/>
	);
};
