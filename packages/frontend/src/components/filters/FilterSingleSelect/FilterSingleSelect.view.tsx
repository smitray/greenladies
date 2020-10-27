import React, { useMemo } from 'react';

import { chunkifyArray } from '../../../utils/chunkify-array';
import { FilterBase } from '../FilterBase';
import { FilterColumnListItem, FilterColumns } from '../FilterColumns';

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

export const FilterSingleSelectView: React.FC<Props> = ({
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
							{chunk.map(item => (
								<FilterColumnListItem
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
								</FilterColumnListItem>
							))}
						</React.Fragment>
					))}
				/>
			}
		/>
	);
};
